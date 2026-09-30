'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function uploadArtwork(formData:FormData){
 const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub; if(!userId) throw new Error('ARTWORK_ACCESS_DENIED');
 const file=formData.get('file'); const bookId=String(formData.get('book_id')??''); const pageId=String(formData.get('page_id')??'')||null;
 if(!(file instanceof File)||!file.size||!bookId) return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('ARTWORK_FILE_TYPE_NOT_SUPPORTED');
 const ext=file.name.split('.').pop()?.toLowerCase()||'png'; const path=`${userId}/${bookId}/${crypto.randomUUID()}.${ext}`;
 const up=await supabase.storage.from('book-assets').upload(path,file,{contentType:file.type,upsert:false}); if(up.error) throw new Error(`ARTWORK_UPLOAD_FAILED: ${up.error.message}`);
 const ins=await supabase.from('assets').insert({book_id:bookId,page_id:pageId,user_id:userId,asset_type:'illustration',storage_bucket:'book-assets',storage_path:path,file_name:file.name,mime_type:file.type,file_size:file.size,status:'approved'});
 if(ins.error){await supabase.storage.from('book-assets').remove([path]); throw new Error(`ARTWORK_RECORD_FAILED: ${ins.error.message}`);}
 revalidatePath('/library');
}
export async function deleteArtwork(formData:FormData){
 const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub; if(!userId) throw new Error('ARTWORK_ACCESS_DENIED');
 const id=String(formData.get('asset_id')??''); const {data:asset}=await supabase.from('assets').select('storage_bucket,storage_path').eq('id',id).eq('user_id',userId).single(); if(!asset)return;
 await supabase.storage.from(asset.storage_bucket).remove([asset.storage_path]); const del=await supabase.from('assets').delete().eq('id',id).eq('user_id',userId); if(del.error)throw new Error(`ARTWORK_DELETE_FAILED: ${del.error.message}`); revalidatePath('/library');
}