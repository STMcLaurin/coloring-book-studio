import Link from 'next/link';
import { ArrowLeft, WandSparkles } from 'lucide-react';

export default async function PromptStudioPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · PROMPT STUDIO</span><h1>Prompt Studio</h1><p>Create and approve illustration prompts from your book plan and Style Lock.</p></div><Link className="outline-btn" href={`/books/${bookId}/overview`}><ArrowLeft size={16}/> Book Overview</Link></section>
    <section className="card" style={{padding:'32px'}}>
      <div className="wizard-title"><WandSparkles/><div><h2>No prompts yet</h2><p>Prompts will be created from this book’s approved page plan and locked style. No demo prompts are included.</p></div></div>
      <button className="primary-btn" disabled>Generate Page Prompts</button>
      <p className="muted">Generation stays disabled until the real project persistence and server-side AI service are connected.</p>
    </section>
  </>;
}
