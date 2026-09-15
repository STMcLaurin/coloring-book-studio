'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateStructuredText } from '@/lib/ai/text';

async function authClient(){const supabase=await createClient(); const {data}=await supabase.auth.getClaims(); if(!data?.claims?.sub) throw new Error('BOOK_ACCESS_DENIED'); return {supabase,userId:data.claims.sub};}

export async function savePrompt(formData: FormData) {
 const {supabase}=await authClient(); const bookId=String(formData.get('book_id')); const promptId=String(formData.get('prompt_id')??''); const pageId=String(formData.get('page_id')); const promptText=String(formData.get('prompt_text')??'').trim(); const approved=String(formData.get('approved'))==='true'; if(!promptText)return;
 const existing=promptId?await supabase.from('prompts').select('version').eq('id',promptId).eq('book_id',bookId).single():null; const version=existing?.data?.version??1;
 const result=promptId?await supabase.from('prompts').update({prompt_text:promptText,approved,version}).eq('id',promptId).eq('book_id',bookId):await supabase.from('prompts').insert({book_id:bookId,page_id:pageId,prompt_type:'illustration',prompt_text:promptText,version,approved}); if(result.error)throw new Error(`PROMPT_SAVE_FAILED: ${result.error.message}`); revalidatePath(`/books/${bookId}/prompts`);
}

export async function generatePrompts(formData: FormData){
 const {supabase,userId}=await authClient(); const bookId=String(formData.get('book_id'));
 const [{data:book,error:bookError},{data:style},{data:pages,error:pagesError}]=await Promise.all([supabase.from('books').select('title,audience,age_range,theme').eq('id',bookId).single(),supabase.from('style_profiles').select('illustration_style,line_weight,complexity,character_rules,background_rules,required_elements,prohibited_elements,base_prompt,negative_prompt').eq('book_id',bookId).limit(1).maybeSingle(),supabase.from('book_pages').select('id,page_number,title,concept,description').eq('book_id',bookId).eq('approved',true).order('page_number')]);
 if(bookError||pagesError||!book||!pages?.length)throw new Error('PROMPT_GENERATION_REQUIRES_APPROVED_PAGES'); const count=pages.length;
 const schema={type:'object',additionalProperties:false,required:['prompts'],properties:{prompts:{type:'array',minItems:count,maxItems:count,items:{type:'object',additionalProperties:false,required:['page_number','prompt'],properties:{page_number:{type:'integer'},prompt:{type:'string'}}}}}};
 const {data,model}=await generateStructuredText<{prompts:Array<{page_number:number;prompt:string}>}>('coloring_book_prompts',schema,'You are the Coloring Book Studio illustration prompt engine. Produce production-ready black-and-white coloring-page prompts. Follow the Style Lock exactly. Preserve open coloring areas, clean printable line art, and age-appropriate complexity. Do not request copyrighted characters, brands, signatures, watermarks, grayscale shading, or color.','Approved project data: '+JSON.stringify({book,style,pages}));
 const byNumber=new Map(data.prompts.map(p=>[p.page_number,p.prompt])); for(const page of pages){const text=byNumber.get(page.page_number); if(!text)continue; const {data:existing}=await supabase.from('prompts').select('id,version').eq('book_id',bookId).eq('page_id',page.id).eq('prompt_type','illustration').order('version',{ascending:false}).limit(1).maybeSingle(); const version=(existing?.version??0)+1; const result=existing?await supabase.from('prompts').update({prompt_text:text,provider:'openai',model,version,approved:false}).eq('id',existing.id):await supabase.from('prompts').insert({book_id:bookId,page_id:page.id,prompt_type:'illustration',prompt_text:text,provider:'openai',model,version,approved:false}); if(result.error)throw new Error(`PROMPT_GENERATION_SAVE_FAILED: ${result.error.message}`);}
 await supabase.from('activity_logs').insert({book_id:bookId,user_id:userId,action:'PROMPTS_GENERATED',entity_type:'book',entity_id:bookId,metadata:{count,model}}); revalidatePath(`/books/${bookId}/prompts`);
}
