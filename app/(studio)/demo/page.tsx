'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Download, Image as ImageIcon, Palette, Sparkles, WandSparkles } from 'lucide-react';

const pages = [
  { n: 1, title: 'Cozy Reading Nook', concept: 'Armchair, blanket, books and a warm lamp', status: 'Ready' },
  { n: 2, title: 'Rainy Window Seat', concept: 'Cushions, raindrops, tea and an open book', status: 'Ready' },
  { n: 3, title: 'Plant-Filled Corner', concept: 'Houseplants, shelves and a soft floor pillow', status: 'Draft' },
  { n: 4, title: 'Sunday Morning Desk', concept: 'Journal, flowers, mug and stationery', status: 'Draft' },
];

const steps = ['Plan', 'Style', 'Prompts', 'Artwork', 'Pages', 'Cover', 'Preview', 'Export'];

export default function DemoPage() {
  const [active, setActive] = useState('Plan');
  const [approved, setApproved] = useState(2);
  const progress = useMemo(() => Math.round(((steps.indexOf(active) + 1) / steps.length) * 100), [active]);

  return (
    <>
      <section className="hero-row compact">
        <div>
          <span className="section-kicker">INTERACTIVE PRODUCT DEMO</span>
          <h1>Coloring Book Studio</h1>
          <p>Walk through a realistic coloring-book production workflow. This demo uses local sample content only and does not write to your Supabase production data.</p>
        </div>
        <Link className="outline-btn" href="/books/new"><Sparkles size={16}/> Create a Real Book</Link>
      </section>

      <section className="card" style={{padding:24, marginBottom:20}}>
        <div className="label-row"><span className="status planning">DEMO PROJECT</span><span>Adult Relaxation · 30 pages · 8.5 × 11 in</span></div>
        <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:24,marginTop:18}}>
          <div className="book-cover cozy-cover" style={{minHeight:205}}>
            <span>COLORING BOOK</span><strong>Quiet<br/>Moments</strong><div className="cover-doodle">☕</div><small>30 COZY SPACES TO COLOR</small>
          </div>
          <div>
            <h2 style={{fontFamily:'Georgia,serif',fontSize:30,fontWeight:500,margin:'0 0 8px'}}>Build a publish-ready book from one workspace.</h2>
            <p className="muted">The production checklist keeps planning, prompts, artwork, page design, cover creation and export connected instead of scattered across separate tools.</p>
            <div className="progress-label"><span>Demo workflow</span><strong>{progress}%</strong></div>
            <div className="progress"><span style={{width:`${progress}%`}}/></div>
            <div className="filter-pills" style={{marginTop:18,flexWrap:'wrap'}}>
              {steps.map(step => <button key={step} className={active===step?'selected':''} onClick={()=>setActive(step)}>{step}</button>)}
            </div>
          </div>
        </div>
      </section>

      {active === 'Plan' && <section className="card" style={{padding:24}}>
        <div className="wizard-title"><BookOpen/><div><h2>AI Book Planner</h2><p>{approved} of 30 page concepts approved. Approved pages stay protected during regeneration.</p></div></div>
        <div className="progress"><span style={{width:`${Math.round(approved/30*100)}%`}}/></div>
        <div style={{display:'grid',gap:12,marginTop:20}}>
          {pages.map((page,i)=><div key={page.n} style={{border:'1px solid #e8e2d9',borderRadius:12,padding:16,display:'flex',justifyContent:'space-between',gap:16,alignItems:'center'}}>
            <div><span className={i<approved?'status artwork':'status planning'}>PAGE {page.n}</span><strong style={{display:'block',marginTop:8}}>{page.title}</strong><span className="muted" style={{fontSize:12}}>{page.concept}</span></div>
            {i<approved?<CheckCircle2 size={20}/>:<button className="outline-btn" onClick={()=>setApproved(v=>Math.min(30,v+1))}>Approve</button>}
          </div>)}
        </div>
        <div className="wizard-actions"><button className="outline-btn"><WandSparkles size={16}/> Regenerate Drafts</button><button className="primary-btn" onClick={()=>setActive('Style')}>Continue to Style <ChevronRight size={16}/></button></div>
      </section>}

      {active === 'Style' && <DemoPanel icon={<Palette/>} title="Style Lock" text="Keep every page visually consistent with a reusable production style." items={['Cozy hand-drawn illustration','Medium clean black line','Balanced background detail','Large open coloring spaces']} next={()=>setActive('Prompts')}/>}
      {active === 'Prompts' && <DemoPanel icon={<Sparkles/>} title="Prompt Studio" text="Generate editable, page-specific illustration prompts from the approved plan and locked style." items={['Page context automatically included','Style rules applied to every prompt','Negative instructions included','Prompt versions remain reviewable']} next={()=>setActive('Artwork')}/>}
      {active === 'Artwork' && <DemoPanel icon={<ImageIcon/>} title="Artwork Library" text="Upload or generate illustrations, assign them to pages and retain commercial asset records." items={['Generated and uploaded artwork','Page assignments','Source and generation metadata','Print-quality asset tracking']} next={()=>setActive('Pages')}/>}
      {active === 'Pages' && <DemoPanel icon={<Palette/>} title="Page Builder" text="Use controlled coloring-book templates instead of a complicated free-form design tool." items={['Full Page Illustration','Illustration + Heading','Affirmation layouts','Framed and educational templates']} next={()=>setActive('Cover')}/>}
      {active === 'Cover' && <DemoPanel icon={<BookOpen/>} title="Cover Studio" text="Build the front and back cover using book metadata, artwork and reusable templates." items={['Title and subtitle','Author / brand','Cover artwork','Back-cover description']} next={()=>setActive('Preview')}/>}
      {active === 'Preview' && <DemoPanel icon={<CheckCircle2/>} title="Preview & Validation" text="Review the full book and resolve production issues before generating files." items={['Missing artwork checks','Page completeness','Print-size validation','Actionable warnings']} next={()=>setActive('Export')}/>}
      {active === 'Export' && <DemoPanel icon={<Download/>} title="Export Center" text="Create the production files needed for selling and publishing." items={['Printable PDF','Interior PDF','Individual PNG pages','ZIP package']} next={()=>setActive('Plan')} button="Restart Demo"/>}
    </>
  );
}

function DemoPanel({icon,title,text,items,next,button='Continue'}:{icon:React.ReactNode;title:string;text:string;items:string[];next:()=>void;button?:string}) {
  return <section className="card" style={{padding:28}}>
    <div className="wizard-title">{icon}<div><h2>{title}</h2><p>{text}</p></div></div>
    <div className="quick-grid">{items.map((item,i)=><div className="quick-card" key={item}><div className="quick-icon">{i+1}</div><strong>{item}</strong><span>Included in the approved Coloring Book Studio workflow.</span></div>)}</div>
    <div className="wizard-actions"><span className="muted" style={{fontSize:12}}>Interactive demo · no production changes</span><button className="primary-btn" onClick={next}>{button} <ChevronRight size={16}/></button></div>
  </section>;
}
