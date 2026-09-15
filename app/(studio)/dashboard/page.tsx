import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, ImagePlus, Plus, Sparkles, WandSparkles } from 'lucide-react';

const steps = [
  ['Book information', true], ['Page plan', true], ['Style Lock', false], ['Artwork', false], ['Page design', false], ['Cover', false], ['Validation', false], ['Export', false], ['Listing', false], ['Published', false]
] as const;

export default function DashboardPage() {
  return <>
    <section className="hero-row"><div><span className="section-kicker">YOUR CREATIVE DESK</span><h1>Welcome to your studio.</h1><p>Turn an idea into a polished, publication-ready coloring book—one guided step at a time.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create New Book</Link></section>

    <section className="active-project card">
      <div className="book-cover cozy-cover"><span>QUIET</span><strong>Moments</strong><small>30 Cozy Spaces to Color</small><div className="cover-doodle">✿</div></div>
      <div className="project-info"><div className="label-row"><span className="status planning">PLANNING</span><span>Adult Relaxation · 30 pages</span></div><h2>Quiet Moments</h2><p className="muted">A cozy coloring collection designed for calm, comfort, and creative breaks.</p><div className="progress-label"><strong>20% complete</strong><span>2 of 10 production steps</span></div><div className="progress"><span style={{width:'20%'}}/></div><div className="next-step"><Sparkles size={19}/><div><small>NEXT STEP</small><strong>Lock your visual style</strong></div></div><Link href="/books/demo/style" className="primary-btn">Continue Creating <ArrowRight size={17}/></Link></div>
      <div className="checklist"><h3>Production checklist</h3>{steps.map(([label,done]) => <div className={done ? 'done check-row' : 'check-row'} key={label}>{done ? <CheckCircle2 size={18}/> : <span className="empty-check"/>}<span>{label}</span></div>)}</div>
    </section>

    <div className="section-heading"><div><span className="section-kicker">SHORTCUTS</span><h2>What would you like to do?</h2></div></div>
    <section className="quick-grid">
      <Link href="/books/new" className="quick-card"><div className="quick-icon"><Plus/></div><strong>New Book</strong><span>Start with the guided book wizard.</span></Link>
      <Link href="/books/demo/plan" className="quick-card"><div className="quick-icon"><WandSparkles/></div><strong>Generate Book Plan</strong><span>Build page ideas for your current project.</span></Link>
      <Link href="/books" className="quick-card"><div className="quick-icon"><BookOpen/></div><strong>Continue Book</strong><span>Pick up exactly where you stopped.</span></Link>
      <Link href="/library" className="quick-card"><div className="quick-icon"><ImagePlus/></div><strong>Upload Artwork</strong><span>Add illustrations to your asset library.</span></Link>
    </section>

    <div className="section-heading"><div><span className="section-kicker">RECENT WORK</span><h2>Your books</h2></div><Link href="/books" className="text-link">View all books <ArrowRight size={16}/></Link></div>
    <section className="book-grid"><article className="book-card card"><div className="mini-cover dreamers"><span>Little</span><strong>Dreamers</strong><small>Magical Animals</small></div><div><span className="status artwork">ARTWORK</span><h3>Little Dreamers</h3><p>Kids 4–7 · 30 pages</p><div className="progress"><span style={{width:'46%'}}/></div><small>46% complete</small></div></article><article className="book-card card"><div className="mini-cover affirm"><span>Affirm &</span><strong>Become</strong><small>Self-Love Edition</small></div><div><span className="status idea">IDEA</span><h3>Affirm & Become</h3><p>Teen / Adult · 30 pages</p><div className="progress"><span style={{width:'8%'}}/></div><small>8% complete</small></div></article></section>
    <div className="dashboard-note"><Clock3 size={18}/><span>Your work will autosave as the production system is connected.</span></div>
  </>;
}
