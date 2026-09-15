'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateStructuredText } from '@/lib/ai/text';

async function userClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) throw new Error('BOOK_ACCESS_DENIED');
  return { supabase, userId };
}

export async function savePagePlan(formData: FormData) {
  const { supabase } = await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id'));
  const { error }=await supabase.from('book_pages').update({title:String(formData.get('title')??'').trim()||null,concept:String(formData.get('concept')??'').trim()||null,description:String(formData.get('description')??'').trim()||null,notes:String(formData.get('notes')??'').trim()||null}).eq('id',pageId).eq('book_id',bookId);
  if(error) throw new Error(`PAGE_PLAN_SAVE_FAILED: ${error.message}`); revalidatePath(`/books/${bookId}/plan`);
}

export async function togglePageApproval(formData: FormData) {
  const { supabase }=await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id')); const approved=String(formData.get('approved'))==='true';
  const {error}=await supabase.from('book_pages').update({approved:!approved,status:!approved?'approved':'draft'}).eq('id',pageId).eq('book_id',bookId);
  if(error) throw new Error(`PAGE_APPROVAL_FAILED: ${error.message}`); revalidatePath(`/books/${bookId}/plan`);
}

async function resequence(supabase: any, bookId: string) {
  const {data:pages,error}=await supabase.from('book_pages').select('id,page_number').eq('book_id',bookId).order('page_number');
  if(error) throw new Error(`PAGE_REORDER_FAILED: ${error.message}`);
  for(let i=0;i<(pages??[]).length;i++){const {error:updateError}=await supabase.from('book_pages').update({page_number:i+1}).eq('id',pages[i].id).eq('book_id',bookId); if(updateError) throw new Error(`PAGE_REORDER_FAILED: ${updateError.message}`);}
  await supabase.from('books').update({page_count:pages?.length??0}).eq('id',bookId);
}

export async function addPage(formData: FormData) {
  const {supabase}=await userClient(); const bookId=String(formData.get('book_id'));
  const {data:last}=await supabase.from('book_pages').select('page_number').eq('book_id',bookId).order('page_number',{ascending:false}).limit(1).maybeSingle();
  const {error}=await supabase.from('book_pages').insert({book_id:bookId,page_number:(last?.page_number??0)+1,status:'draft',approved:false}); if(error) throw new Error(`PAGE_ADD_FAILED: ${error.message}`);
  await resequence(supabase,bookId); revalidatePath(`/books/${bookId}/plan`);
}

export async function duplicatePage(formData: FormData) {
  const {supabase}=await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id'));
  const {data:source,error}=await supabase.from('book_pages').select('title,concept,description,notes').eq('id',pageId).eq('book_id',bookId).single(); if(error||!source) throw new Error('PAGE_DUPLICATE_FAILED');
  const {data:last}=await supabase.from('book_pages').select('page_number').eq('book_id',bookId).order('page_number',{ascending:false}).limit(1).maybeSingle();
  const {error:insertError}=await supabase.from('book_pages').insert({...source,book_id:bookId,page_number:(last?.page_number??0)+1,status:'draft',approved:false}); if(insertError) throw new Error(`PAGE_DUPLICATE_FAILED: ${insertError.message}`);
  await resequence(supabase,bookId); revalidatePath(`/books/${bookId}/plan`);
}

export async function deletePage(formData: FormData) {
  const {supabase}=await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id'));
  const {error}=await supabase.from('book_pages').delete().eq('id',pageId).eq('book_id',bookId); if(error) throw new Error(`PAGE_DELETE_FAILED: ${error.message}`);
  await resequence(supabase,bookId); revalidatePath(`/books/${bookId}/plan`);
}

export async function movePage(formData: FormData) {
  const {supabase}=await userClient(); const bookId=String(formData.get('book_id')); const pageId=String(formData.get('page_id')); const direction=String(formData.get('direction'));
  const {data:pages,error}=await supabase.from('book_pages').select('id,page_number').eq('book_id',bookId).order('page_number'); if(error||!pages) throw new Error('PAGE_REORDER_FAILED');
  const index=pages.findIndex((p:any)=>p.id===pageId); const swapIndex=direction==='up'?index-1:index+1; if(index<0||swapIndex<0||swapIndex>=pages.length) return;
  const current=pages[index],other=pages[swapIndex]; const temp=100000+current.page_number;
  for(const [id,num] of [[current.id,temp],[other.id,current.page_number],[current.id,other.page_number]] as Array<[string,number]>){const {error:updateError}=await supabase.from('book_pages').update({page_number:num}).eq('id',id).eq('book_id',bookId); if(updateError) throw new Error(`PAGE_REORDER_FAILED: ${updateError.message}`);}
  revalidatePath(`/books/${bookId}/plan`);
}

export async function generateBookPlan(formData: FormData) {
  const {supabase,userId}=await userClient(); const bookId=String(formData.get('book_id'));
  const [{data:book,error:bookError},{data:settings},{data:pages,error:pagesError}]=await Promise.all([
    supabase.from('books').select('title,subtitle,description,audience,age_range,theme,page_count').eq('id',bookId).single(),
    supabase.from('book_settings').select('complexity,illustration_style,background_detail,open_space_level').eq('book_id',bookId).maybeSingle(),
    supabase.from('book_pages').select('id,page_number,approved,title,concept,description').eq('book_id',bookId).order('page_number')
  ]);
  if(bookError||pagesError||!book||!pages) throw new Error('BOOK_PLAN_LOAD_FAILED');
  const drafts=pages.filter(p=>!p.approved); if(!drafts.length) throw new Error('BOOK_PLAN_ALL_PAGES_APPROVED'); const count=drafts.length;
  const schema={type:'object',additionalProperties:false,required:['pages'],properties:{pages:{type:'array',minItems:count,maxItems:count,items:{type:'object',additionalProperties:false,required:['page_number','title','concept','description'],properties:{page_number:{type:'integer'},title:{type:'string'},concept:{type:'string'},description:{type:'string'}}}}}};
  const approvedPages=pages.filter(p=>p.approved).map(({page_number,title,concept,description})=>({page_number,title,concept,description}));
  const {data}=await generateStructuredText<{pages:Array<{page_number:number;title:string;concept:string;description:string}>}>('coloring_book_plan',schema,'You are the Coloring Book Studio planning engine. Create distinct, age-appropriate, printable coloring-page concepts only for the requested draft page numbers. Approved pages are immutable context: do not replace or duplicate them. Do not include copyrighted characters, logos, brands, sample filler, or publication claims.','Book brief: '+JSON.stringify({book,settings,draft_page_numbers:drafts.map(p=>p.page_number),approved_pages:approvedPages,mustAppear:String(formData.get('must_appear')??''),avoid:String(formData.get('avoid')??''),feel:String(formData.get('feel')??'')}));
  const expected=new Set(drafts.map(p=>p.page_number)); const generatedNumbers=data.pages.map(p=>p.page_number); if(generatedNumbers.length!==count||new Set(generatedNumbers).size!==count||generatedNumbers.some(n=>!expected.has(n))) throw new Error('AI_PLAN_PAGE_MISMATCH');
  const byNumber=new Map(data.pages.map(p=>[p.page_number,p]));
  for(const page of drafts){const generated=byNumber.get(page.page_number)!; const {error}=await supabase.from('book_pages').update({title:generated.title,concept:generated.concept,description:generated.description,status:'draft',approved:false}).eq('id',page.id).eq('book_id',bookId).eq('approved',false); if(error) throw new Error(`BOOK_PLAN_SAVE_FAILED: ${error.message}`);}
  const {error:logError}=await supabase.from('activity_logs').insert({book_id:bookId,user_id:userId,action:'PLAN_GENERATED',entity_type:'book',entity_id:bookId,metadata:{draft_page_count:count,approved_pages_preserved:pages.length-count}}); if(logError) console.error('PLAN_ACTIVITY_LOG_FAILED',logError.message);
  revalidatePath(`/books/${bookId}/plan`);
}
