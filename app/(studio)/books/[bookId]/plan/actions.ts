'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateStructuredText } from '@/lib/ai/text';

async function userClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) throw new Error('BOOK_ACCESS_DENIED');
  return supabase;
}

export async function savePagePlan(formData: FormData) {
  const supabase = await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id'));
  const { error }=await supabase.from('book_pages').update({title:String(formData.get('title')??'').trim()||null,concept:String(formData.get('concept')??'').trim()||null,description:String(formData.get('description')??'').trim()||null,notes:String(formData.get('notes')??'').trim()||null}).eq('id',pageId).eq('book_id',bookId);
  if(error) throw new Error(`PAGE_PLAN_SAVE_FAILED: ${error.message}`); revalidatePath(`/books/${bookId}/plan`);
}

export async function togglePageApproval(formData: FormData) {
  const supabase=await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id')); const approved=String(formData.get('approved'))==='true';
  const {error}=await supabase.from('book_pages').update({approved:!approved,status:!approved?'approved':'draft'}).eq('id',pageId).eq('book_id',bookId);
  if(error) throw new Error(`PAGE_APPROVAL_FAILED: ${error.message}`); revalidatePath(`/books/${bookId}/plan`);
}

export async function generateBookPlan(formData: FormData) {
  const supabase=await userClient(); const bookId=String(formData.get('book_id'));
  const [{data:book,error:bookError},{data:settings},{data:pages,error:pagesError}]=await Promise.all([
    supabase.from('books').select('title,subtitle,description,audience,age_range,theme,page_count').eq('id',bookId).single(),
    supabase.from('book_settings').select('complexity,illustration_style,background_detail,open_space_level').eq('book_id',bookId).maybeSingle(),
    supabase.from('book_pages').select('id,page_number').eq('book_id',bookId).order('page_number')
  ]);
  if(bookError||pagesError||!book||!pages) throw new Error('BOOK_PLAN_LOAD_FAILED');
  const count=pages.length;
  const schema={type:'object',additionalProperties:false,required:['pages'],properties:{pages:{type:'array',minItems:count,maxItems:count,items:{type:'object',additionalProperties:false,required:['page_number','title','concept','description'],properties:{page_number:{type:'integer'},title:{type:'string'},concept:{type:'string'},description:{type:'string'}}}}}};
  const {data}=await generateStructuredText<{pages:Array<{page_number:number;title:string;concept:string;description:string}>}>('coloring_book_plan',schema,'You are the Coloring Book Studio planning engine. Create distinct, age-appropriate, printable coloring-page concepts. Do not include copyrighted characters, logos, brands, sample filler, or publication claims. Return exactly the requested number of pages.','Book brief: '+JSON.stringify({book,settings,mustAppear:String(formData.get('must_appear')??''),avoid:String(formData.get('avoid')??''),feel:String(formData.get('feel')??'')}));
  const byNumber=new Map(data.pages.map(p=>[p.page_number,p]));
  for(const page of pages){const generated=byNumber.get(page.page_number); if(!generated) continue; const {error}=await supabase.from('book_pages').update({title:generated.title,concept:generated.concept,description:generated.description,status:'draft',approved:false}).eq('id',page.id).eq('book_id',bookId); if(error) throw new Error(`BOOK_PLAN_SAVE_FAILED: ${error.message}`);}
  await supabase.from('activity_logs').insert({book_id:bookId,user_id:(await supabase.auth.getClaims()).data.claims?.sub,action:'PLAN_GENERATED',entity_type:'book',entity_id:bookId,metadata:{page_count:count}});
  revalidatePath(`/books/${bookId}/plan`);
}
