import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';

export default async function StyleLockPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">CREATION ENGINE · STYLE LOCK</span><h1>Style Lock</h1><p>Define the visual rules that keep every page consistent.</p></div><Link className="outline-btn" href={`/books/${bookId}/overview`}><ArrowLeft size={16}/> Book Overview</Link></section>
    <section className="card" style={{padding:'32px'}}>
      <div className="wizard-title"><LockKeyhole/><div><h2>Create this book’s visual rules</h2><p>No sample style is preloaded. Saved settings for the selected book will populate this workspace after persistence is connected.</p></div></div>
      <div className="form-grid"><label>Illustration style<input placeholder="Describe the illustration style"/></label><label>Line weight<select defaultValue=""><option value="" disabled>Select line weight</option><option>Thin</option><option>Medium</option><option>Thick</option></select></label><label className="full">Character rules<textarea placeholder="Rules for recurring characters and features"/></label><label className="full">Background rules<textarea placeholder="Rules for background detail and composition"/></label><label className="full">Required elements<textarea placeholder="Elements that must appear"/></label><label className="full">Avoid<textarea placeholder="Elements or treatments to avoid"/></label><label className="full">Base prompt<textarea placeholder="Reusable base prompt"/></label><label className="full">Negative instructions<textarea placeholder="Reusable negative instructions"/></label></div>
      <div className="wizard-actions"><button className="primary-btn" disabled>Save & Lock Style</button></div>
    </section>
  </>;
}
