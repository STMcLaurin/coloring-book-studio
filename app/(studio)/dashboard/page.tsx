import Link from 'next/link';
import { BookOpen, ImagePlus, Plus, WandSparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub; if(!userId) redirect('/login');
  const {data:books,error}=await supabase.from('books').select('id,title,status,progress,page_count,updated_at').eq('user_id',userId).order('updated_at',{ascending:false});
  if(error) throw new Error(`DASHBOARD_LOAD_FAILED: ${error.message}`);
  const total=books?.length??0, published=books?.filter(b=>b.status==='published').length??0, active=books?.filter(b=>!['published','archived'].includes(b.status)).length??0;
  const avg=total?Math.round((books??[]).reduce((n,b)=>n+(b.progress??0),0)/total):0;
  return <>
    <section className="hero-row"><div><span className="section-kicker">YOUR CREATIVE DESK</span><h1>Welcome to your studio.</h1><p>Turn an idea into a polished, publication-ready coloring book—one guided step at a time.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create New Book</Link></section>
    <section className="quick-grid">
      <div className="quick-card"><strong>{total}</strong><span>Total books</span></div><div className="quick-card"><strong>{active}</strong><span>In progress</span></div><div className="quick-card"><strong>{published}</strong><span>Published</span></div><div className="quick-card"><strong>{avg}%</strong><span>Average progress</span></div>
    </section>
    {!total?<section className="card" style={{padding:'32px',textAlign:'center',marginTop:'20px'}}><h2>Your studio is ready for its first book.</h2><p className="muted">No sample projects are loaded.</p><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create Your First Book</Link></section>:<><div className="section-heading"><div><span className="section-kicker">RECENT PROJECTS</span><h2>Continue creating</h2></div><Link href="/books">View all books</Link></div><section style={{display:'grid',gap:'14px'}}>{books?.slice(0,5).map(b=><article className="card" style={{padding:'20px'}} key={b.id}><div className="label-row"><strong>{b.title}</strong><span className="status planning">{String(b.status).toUpperCase()}</span></div><div className="progress" style={{margin:'14px 0'}}><span style={{width:`${b.progress??0}%`}}/></div><div className="label-row"><span>{b.page_count??0} pages · {b.progress??0}% complete</span><Link className="outline-btn" href={`/books/${b.id}/plan`}>Continue</Link></div></article>)}</section></>}
    <div className="section-heading"><div><span className="section-kicker">SHORTCUTS</span><h2>Creation tools</h2></div></div><section className="quick-grid"><Link href="/books/new" className="quick-card"><div className="quick-icon"><Plus/></div><strong>New Book</strong><span>Start the guided wizard.</span></Link><Link href="/books" className="quick-card"><div className="quick-icon"><WandSparkles/></div><strong>Book Planner</strong><span>Continue a saved project.</span></Link><Link href="/books" className="quick-card"><div className="quick-icon"><BookOpen/></div><strong>My Books</strong><span>Manage real projects.</span></Link><Link href="/library" className="quick-card"><div className="quick-icon"><ImagePlus/></div><strong>Artwork Library</strong><span>Manage production artwork.</span></Link></section>
  </>;
}