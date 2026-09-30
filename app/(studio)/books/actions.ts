'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function authedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect('/login');
  return { supabase, userId };
}

export async function updateBook(formData: FormData) {
  const { supabase, userId } = await authedClient();
  const id = String(formData.get('book_id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  if (!id || !title) return;
  const { error } = await supabase.from('books').update({
    title,
    subtitle: String(formData.get('subtitle') ?? '').trim() || null,
    theme: String(formData.get('theme') ?? '').trim() || null,
    status: String(formData.get('status') ?? 'planning'),
  }).eq('id', id).eq('user_id', userId);
  if (error) throw new Error(`BOOK_UPDATE_FAILED: ${error.message}`);
  revalidatePath('/books');
  revalidatePath('/dashboard');
}

export async function deleteBook(formData: FormData) {
  const { supabase, userId } = await authedClient();
  const id = String(formData.get('book_id') ?? '');
  if (!id) return;
  const { error } = await supabase.from('books').delete().eq('id', id).eq('user_id', userId);
  if (error) throw new Error(`BOOK_DELETE_FAILED: ${error.message}`);
  revalidatePath('/books');
  revalidatePath('/dashboard');
}

export async function duplicateBook(formData: FormData) {
  const { supabase, userId } = await authedClient();
  const sourceId = String(formData.get('book_id') ?? '');
  const { data: source, error: sourceError } = await supabase.from('books').select('*').eq('id', sourceId).eq('user_id', userId).single();
  if (sourceError || !source) throw new Error('BOOK_DUPLICATE_SOURCE_NOT_FOUND');

  const { id: _id, created_at: _created, updated_at: _updated, ...copy } = source;
  const { data: created, error: createError } = await supabase.from('books').insert({
    ...copy, user_id: userId, title: `${source.title} Copy`, status: 'planning', progress: 0,
  }).select('id').single();
  if (createError || !created) throw new Error(`BOOK_DUPLICATE_FAILED: ${createError?.message ?? 'No book returned'}`);

  const newId = created.id;
  const [{ data: settings }, { data: styles }, { data: pages }] = await Promise.all([
    supabase.from('book_settings').select('*').eq('book_id', sourceId).maybeSingle(),
    supabase.from('style_profiles').select('*').eq('book_id', sourceId),
    supabase.from('book_pages').select('*').eq('book_id', sourceId).order('page_number'),
  ]);

  if (settings) {
    const { id, book_id, created_at, updated_at, ...rest } = settings;
    await supabase.from('book_settings').insert({ ...rest, book_id: newId });
  }
  if (styles?.length) {
    await supabase.from('style_profiles').insert(styles.map(({ id, book_id, created_at, updated_at, ...rest }) => ({ ...rest, book_id: newId })));
  }
  if (pages?.length) {
    await supabase.from('book_pages').insert(pages.map(({ id, book_id, created_at, updated_at, ...rest }) => ({ ...rest, book_id: newId, approved: false, status: 'draft' })));
  }

  revalidatePath('/books');
  revalidatePath('/dashboard');
  redirect(`/books/${newId}/plan`);
}
