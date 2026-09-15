'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function userClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) throw new Error('BOOK_ACCESS_DENIED');
  return supabase;
}

export async function savePagePlan(formData: FormData) {
  const supabase = await userClient();
  const bookId = String(formData.get('book_id'));
  const pageId = String(formData.get('page_id'));
  const { error } = await supabase.from('book_pages').update({
    title: String(formData.get('title') ?? '').trim() || null,
    concept: String(formData.get('concept') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
  }).eq('id', pageId).eq('book_id', bookId);
  if (error) throw new Error(`PAGE_PLAN_SAVE_FAILED: ${error.message}`);
  revalidatePath(`/books/${bookId}/plan`);
}

export async function togglePageApproval(formData: FormData) {
  const supabase = await userClient();
  const bookId = String(formData.get('book_id'));
  const pageId = String(formData.get('page_id'));
  const approved = String(formData.get('approved')) === 'true';
  const { error } = await supabase.from('book_pages').update({ approved: !approved, status: !approved ? 'approved' : 'draft' }).eq('id', pageId).eq('book_id', bookId);
  if (error) throw new Error(`PAGE_APPROVAL_FAILED: ${error.message}`);
  revalidatePath(`/books/${bookId}/plan`);
}
