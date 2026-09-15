'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createBook(formData: FormData) {
  const supabase = await createClient();
  const { data: claimsData, error: authError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (authError || !userId) redirect('/login');

  const title = String(formData.get('title') ?? '').trim();
  const pageCount = Math.max(1, Math.min(100, Number(formData.get('page_count') ?? 30)));
  if (!title) redirect('/books/new?error=Book+title+is+required');

  const { data: book, error: bookError } = await supabase.from('books').insert({
    user_id: userId,
    title,
    subtitle: String(formData.get('subtitle') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    audience: String(formData.get('audience') ?? '').trim() || null,
    age_range: String(formData.get('age_range') ?? '').trim() || null,
    theme: String(formData.get('theme') ?? '').trim() || null,
    page_count: pageCount,
    status: 'planning',
    progress: 10,
  }).select('id').single();
  if (bookError || !book) throw new Error(`BOOK_CREATE_FAILED: ${bookError?.message ?? 'No book returned'}`);

  const bookId = book.id;
  const settings = {
    book_id: bookId,
    trim_width: Number(formData.get('trim_width') ?? 8.5),
    trim_height: Number(formData.get('trim_height') ?? 11),
    measurement_unit: 'in',
    orientation: String(formData.get('orientation') ?? 'Portrait').toLowerCase(),
    complexity: String(formData.get('complexity') ?? 'Balanced'),
    line_weight: String(formData.get('line_weight') ?? 'Medium'),
    illustration_style: String(formData.get('illustration_style') ?? ''),
    background_detail: String(formData.get('background_detail') ?? 'Balanced'),
    open_space_level: String(formData.get('coloring_space') ?? 'Balanced'),
    single_sided: String(formData.get('page_printing') ?? 'Single-sided') === 'Single-sided',
    bleed: String(formData.get('bleed') ?? 'No bleed') === 'Bleed',
  };
  const { error: settingsError } = await supabase.from('book_settings').insert(settings);
  if (settingsError) throw new Error(`BOOK_SETTINGS_CREATE_FAILED: ${settingsError.message}`);

  const { error: styleError } = await supabase.from('style_profiles').insert({
    book_id: bookId,
    name: 'Primary Style',
    illustration_style: String(formData.get('illustration_style') ?? ''),
    line_weight: String(formData.get('line_weight') ?? 'Medium'),
    complexity: String(formData.get('complexity') ?? 'Balanced'),
    background_rules: `Background detail: ${String(formData.get('background_detail') ?? 'Balanced')}. Coloring space: ${String(formData.get('coloring_space') ?? 'Balanced')}.`,
  });
  if (styleError) throw new Error(`STYLE_PROFILE_CREATE_FAILED: ${styleError.message}`);

  const pages = Array.from({ length: pageCount }, (_, index) => ({ book_id: bookId, page_number: index + 1, status: 'draft', approved: false }));
  const { error: pagesError } = await supabase.from('book_pages').insert(pages);
  if (pagesError) throw new Error(`BOOK_PAGES_CREATE_FAILED: ${pagesError.message}`);

  redirect(`/books/${bookId}/plan`);
}
