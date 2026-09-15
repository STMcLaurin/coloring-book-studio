import Link from 'next/link';
import { ArrowLeft, WandSparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { savePrompt } from './actions';

export default async function PromptStudioPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase.from('books').select('id,title').eq('id', bookId).single();
  if (!book) notFound();
  const { data: pages } = await supabase.from('book_pages').select('id,page_number,title,concept,description,approved').eq('book_id', bookId).eq('approved', true).order('page_number');
  const { data: prompts } = await supabase.from('prompts').select('id,page_id,prompt_text,approved,version').eq('book_id', bookId).eq('prompt_type','illustration');
  const promptByPage = new Map((prompts ?? []).map(prompt => [prompt.page_id, prompt]));
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · PROMPT STUDIO</span><h1>{book.title} — Prompt Studio</h1><p>Create, edit, save, and approve illustration prompts for approved pages.</p></div><Link className="outline-btn" href={`/books/${bookId}/style`}><ArrowLeft size={16}/> Style Lock</Link></section>
    {!pages?.length ? <section className="card" style={{padding:'32px'}}><div className="wizard-title"><WandSparkles/><div><h2>No approved pages yet</h2><p>Approve at least one page in Book Planner before creating illustration prompts.</p></div></div><Link className="primary-btn" href={`/books/${bookId}/plan`}>Open Book Planner</Link></section> : <section style={{display:'grid',gap:'16px'}}>{pages.map(page => { const prompt = promptByPage.get(page.id); return <article className="card" style={{padding:'24px'}} key={page.id}><div className="label-row"><span className="status ready">PAGE {page.page_number}</span><span>{page.title || page.concept || 'Approved page'}</span></div><form action={savePrompt}><input type="hidden" name="book_id" value={bookId}/><input type="hidden" name="page_id" value={page.id}/><input type="hidden" name="prompt_id" value={prompt?.id ?? ''}/><label className="full">Illustration prompt<textarea name="prompt_text" required defaultValue={prompt?.prompt_text ?? ''} placeholder="Write the production-ready illustration prompt for this page"/></label><label style={{display:'flex',gap:'8px',alignItems:'center',marginTop:'12px'}}><input type="checkbox" name="approved" value="true" defaultChecked={prompt?.approved ?? false}/> Approve this prompt for artwork production</label><div className="wizard-actions"><button className="primary-btn" type="submit">{prompt?'Save Prompt':'Create Prompt'}</button></div></form></article>; })}</section>}
    <p className="muted" style={{marginTop:'18px'}}>Manual prompt production is now live. Server-side AI generation is the next Creation Engine integration and will write into these same prompt records.</p>
  </>;
}
