'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function savePrompt(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) throw new Error('BOOK_ACCESS_DENIED');
  const bookId = String(formData.get('book_id'));
  const promptId = String(formData.get('prompt_id') ?? '');
  const pageId = String(formData.get('page_id'));
  const promptText = String(formData.get('prompt_text') ?? '').trim();
  const approved = String(formData.get('approved')) === 'true';
  if (!promptText) return;
  const payload = { book_id: bookId, page_id: pageId, prompt_type: 'illustration', prompt_text: promptText, version: 1, approved };
  const result = promptId ? await supabase.from('prompts').update({ prompt_text: promptText, approved }).eq('id', promptId).eq('book_id', bookId) : await supabase.from('prompts').insert(payload);
  if (result.error) throw new Error(`PROMPT_SAVE_FAILED: ${result.error.message}`);
  revalidatePath(`/books/${bookId}/prompts`);
}
