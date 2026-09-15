'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveStyle(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) throw new Error('BOOK_ACCESS_DENIED');
  const bookId = String(formData.get('book_id'));
  const styleId = String(formData.get('style_id'));
  const payload = {
    illustration_style: String(formData.get('illustration_style') ?? '').trim() || null,
    line_weight: String(formData.get('line_weight') ?? '').trim() || null,
    complexity: String(formData.get('complexity') ?? '').trim() || null,
    character_rules: String(formData.get('character_rules') ?? '').trim() || null,
    background_rules: String(formData.get('background_rules') ?? '').trim() || null,
    required_elements: String(formData.get('required_elements') ?? '').trim() || null,
    prohibited_elements: String(formData.get('prohibited_elements') ?? '').trim() || null,
    base_prompt: String(formData.get('base_prompt') ?? '').trim() || null,
    negative_prompt: String(formData.get('negative_prompt') ?? '').trim() || null,
  };
  const result = styleId ? await supabase.from('style_profiles').update(payload).eq('id', styleId).eq('book_id', bookId) : await supabase.from('style_profiles').insert({ book_id: bookId, name: 'Primary Style', ...payload });
  if (result.error) throw new Error(`STYLE_LOCK_SAVE_FAILED: ${result.error.message}`);
  revalidatePath(`/books/${bookId}/style`);
}
