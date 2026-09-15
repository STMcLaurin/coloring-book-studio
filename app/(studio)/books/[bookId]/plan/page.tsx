import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default async function BookPlanPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · BOOK PLANNER</span><h1>Book Plan</h1><p>Build, review, and approve the page-by-page plan for this book.</p></div><Link className="outline-btn" href={`/books/${bookId}/overview`}><ArrowLeft size={16}/> Book Overview</Link></section>
    <section className="card" style={{padding:'32px'}}>
      <div className="wizard-title"><Sparkles/><div><h2>No page plan yet</h2><p>This project has no generated or saved page ideas. The planner will show only real project data.</p></div></div>
      <button className="primary-btn" disabled>Generate Book Plan</button>
      <p className="muted">AI generation will activate when the server-side AI service is connected. Manual page planning will be added in this phase without using sample records.</p>
    </section>
  </>;
}
