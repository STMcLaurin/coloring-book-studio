import Link from 'next/link';
import { BookOpen, ImagePlus, Plus, WandSparkles } from 'lucide-react';

export default function DashboardPage() {
  return <>
    <section className="hero-row"><div><span className="section-kicker">YOUR CREATIVE DESK</span><h1>Welcome to your studio.</h1><p>Turn an idea into a polished, publication-ready coloring book—one guided step at a time.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create New Book</Link></section>

    <section className="card" style={{padding:'32px', textAlign:'center'}}>
      <h2>Your studio is ready for its first book.</h2>
      <p className="muted">No sample projects are loaded. Create a book and your real project progress will appear here.</p>
      <Link className="primary-btn" href="/books/new"><Plus size={18}/> Create Your First Book</Link>
    </section>

    <div className="section-heading"><div><span className="section-kicker">SHORTCUTS</span><h2>What would you like to do?</h2></div></div>
    <section className="quick-grid">
      <Link href="/books/new" className="quick-card"><div className="quick-icon"><Plus/></div><strong>New Book</strong><span>Start with the guided book wizard.</span></Link>
      <Link href="/books" className="quick-card"><div className="quick-icon"><WandSparkles/></div><strong>Book Planner</strong><span>Create a book first, then build its page plan.</span></Link>
      <Link href="/books" className="quick-card"><div className="quick-icon"><BookOpen/></div><strong>My Books</strong><span>Open your saved book projects.</span></Link>
      <Link href="/library" className="quick-card"><div className="quick-icon"><ImagePlus/></div><strong>Artwork Library</strong><span>Manage artwork connected to your real projects.</span></Link>
    </section>
  </>;
}
