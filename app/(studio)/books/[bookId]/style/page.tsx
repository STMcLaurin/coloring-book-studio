import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { saveStyle } from './actions';

export default async function StyleLockPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase.from('books').select('id,title').eq('id', bookId).single();
  if (!book) notFound();
  const { data: style } = await supabase.from('style_profiles').select('*').eq('book_id', bookId).order('created_at').limit(1).maybeSingle();
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · STYLE LOCK</span><h1>{book.title} — Style Lock</h1><p>Define the visual rules that every page prompt and illustration should follow.</p></div><Link className="outline-btn" href={`/books/${bookId}/plan`}><ArrowLeft size={16}/> Book Plan</Link></section>
    <section className="card" style={{padding:'32px'}}><div className="wizard-title"><LockKeyhole/><div><h2>Primary visual system</h2><p>These settings persist to this book and become the shared creative direction for Prompt Studio.</p></div></div><form action={saveStyle}><input type="hidden" name="book_id" value={bookId}/><input type="hidden" name="style_id" value={style?.id ?? ''}/><div className="form-grid"><label>Illustration style<input name="illustration_style" defaultValue={style?.illustration_style ?? ''} placeholder="Describe the illustration style"/></label><label>Line weight<select name="line_weight" defaultValue={style?.line_weight ?? 'Medium'}><option>Thin</option><option>Medium</option><option>Thick</option></select></label><label>Complexity<select name="complexity" defaultValue={style?.complexity ?? 'Balanced'}><option>Simple</option><option>Balanced</option><option>Intricate</option></select></label><label className="full">Character rules<textarea name="character_rules" defaultValue={style?.character_rules ?? ''} placeholder="Rules for recurring characters and features"/></label><label className="full">Background rules<textarea name="background_rules" defaultValue={style?.background_rules ?? ''} placeholder="Rules for background detail and composition"/></label><label className="full">Required elements<textarea name="required_elements" defaultValue={style?.required_elements ?? ''} placeholder="Elements that must appear"/></label><label className="full">Avoid<textarea name="prohibited_elements" defaultValue={style?.prohibited_elements ?? ''} placeholder="Elements or treatments to avoid"/></label><label className="full">Base prompt<textarea name="base_prompt" defaultValue={style?.base_prompt ?? ''} placeholder="Reusable base prompt"/></label><label className="full">Negative instructions<textarea name="negative_prompt" defaultValue={style?.negative_prompt ?? ''} placeholder="Reusable negative instructions"/></label></div><div className="wizard-actions"><button className="primary-btn" type="submit">Save Style Lock</button><Link className="outline-btn" href={`/books/${bookId}/prompts`}>Continue to Prompt Studio</Link></div></form></section>
  </>;
}
