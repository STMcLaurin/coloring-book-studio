import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { savePagePlan, togglePageApproval } from './actions';

export default async function BookPlanPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const supabase = await createClient();
  const { data: book } = await supabase.from('books').select('id,title,page_count').eq('id', bookId).single();
  if (!book) notFound();
  const { data: pages, error } = await supabase.from('book_pages').select('id,page_number,title,concept,description,notes,status,approved').eq('book_id', bookId).order('page_number');
  if (error) throw new Error(`BOOK_PLAN_LOAD_FAILED: ${error.message}`);
  const approvedCount = pages?.filter(page => page.approved).length ?? 0;
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · BOOK PLANNER</span><h1>{book.title} — Book Plan</h1><p>Plan each coloring page, save it, and approve it when the concept is ready for Prompt Studio.</p></div><Link className="outline-btn" href="/books"><ArrowLeft size={16}/> My Books</Link></section>
    <section className="card" style={{padding:'24px', marginBottom:'20px'}}><div className="wizard-title"><Sparkles/><div><h2>{approvedCount} of {book.page_count} pages approved</h2><p>Manual planning is live. AI generation will be layered onto these same records rather than creating separate demo data.</p></div></div><div className="progress"><span style={{width:`${book.page_count ? Math.round((approvedCount/book.page_count)*100) : 0}%`}}/></div></section>
    <section style={{display:'grid', gap:'16px'}}>{pages?.map(page => <article className="card" style={{padding:'22px'}} key={page.id}><form action={savePagePlan}><input type="hidden" name="book_id" value={bookId}/><input type="hidden" name="page_id" value={page.id}/><div className="label-row"><span className={page.approved?'status ready':'status planning'}>PAGE {page.page_number}</span>{page.approved && <span><CheckCircle2 size={16}/> Approved</span>}</div><div className="form-grid top-space"><label>Page title<input name="title" defaultValue={page.title ?? ''} placeholder="Optional page title"/></label><label>Concept<input name="concept" defaultValue={page.concept ?? ''} placeholder="What happens on this page?"/></label><label className="full">Description<textarea name="description" defaultValue={page.description ?? ''} placeholder="Describe the composition, subject, setting, and coloring experience"/></label><label className="full">Notes<textarea name="notes" defaultValue={page.notes ?? ''} placeholder="Creative notes or revisions"/></label></div><div className="wizard-actions"><button className="outline-btn" type="submit">Save Page</button></div></form><form action={togglePageApproval}><input type="hidden" name="book_id" value={bookId}/><input type="hidden" name="page_id" value={page.id}/><input type="hidden" name="approved" value={String(page.approved)}/><button className="primary-btn" type="submit">{page.approved?'Return to Draft':'Approve Page'}</button></form></article>)}</section>
    <div className="wizard-actions"><Link className="primary-btn" href={`/books/${bookId}/style`}>Continue to Style Lock</Link></div>
  </>;
}
