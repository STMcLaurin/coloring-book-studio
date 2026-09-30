'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Download, Image as ImageIcon, Palette, RotateCcw, Sparkles, WandSparkles } from 'lucide-react';

const pages = [
  { n: 1, title: 'Cozy Reading Nook', concept: 'Armchair, blanket, books and a warm lamp' },
  { n: 2, title: 'Rainy Window Seat', concept: 'Cushions, raindrops, tea and an open book' },
  { n: 3, title: 'Plant-Filled Corner', concept: 'Houseplants, shelves and a soft floor pillow' },
  { n: 4, title: 'Sunday Morning Desk', concept: 'Journal, flowers, mug and stationery' },
];
const steps = ['Plan','Style','Prompts','Artwork','Pages','Cover','Preview','Export'];

export default function DemoPage() {
  const [stepIndex,setStepIndex]=useState(0);
  const [approved,setApproved]=useState(2);
  const active=steps[stepIndex];
  const progress=useMemo(()=>Math.round(((stepIndex+1)/steps.length)*100),[stepIndex]);
  const next=()=>setStepIndex(i=>Math.min(steps.length-1,i+1));
  const back=()=>setStepIndex(i=>Math.max(0,i-1));
  const restart=()=>{setStepIndex(0);setApproved(2);};
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">INTERACTIVE PRODUCT DEMO · STEP {stepIndex+1} OF {steps.length}</span><h1>Coloring Book Studio</h1><p>Follow the production workflow in order. Complete each demonstration step, then select Next Step to continue.</p></div><Link className="outline-btn" href="/books/new"><Sparkles size={16}/> Create a Real Book</Link></section>
    <section className="card" style={{padding:24,marginBottom:20}}>
      <div className="label-row"><span className="status planning">STEP {stepIndex+1} OF {steps.length}</span><strong>{active}</strong></div>
      <div className="progress-label"><span>Guided demo progress</span><strong>{progress}%</strong></div><div className="progress"><span style={{width:`${progress}%`}}/></div>
      <div className="filter-pills" style={{marginTop:18,flexWrap:'wrap'}}>{steps.map((s,i)=><button type="button" key={s} className={i===stepIndex?'selected':''} onClick={()=>setStepIndex(i)} aria-label={`Open step ${i+1}: ${s}`}><span style={{fontWeight:700}}>{i+1}.</span> {s}</button>)}</div>
    </section>
    {active==='Plan'&&<section className="card" style={{padding:24}}><div className="wizard-title"><BookOpen/><div><span className="section-kicker">STEP 1</span><h2>AI Book Planner</h2><p>Review the planned coloring pages and approve concepts before moving to the visual style.</p></div></div><div className="progress"><span style={{width:`${Math.round(approved/30*100)}%`}}/></div><div style={{display:'grid',gap:12,marginTop:20}}>{pages.map((page,i)=><div key={page.n} style={{border:'1px solid #e8e2d9',borderRadius:12,padding:16,display:'flex',justifyContent:'space-between',gap:16,alignItems:'center'}}><div><span className={i<approved?'status artwork':'status planning'}>PAGE {page.n}</span><strong style={{display:'block',marginTop:8}}>{page.title}</strong><span className="muted" style={{fontSize:12}}>{page.concept}</span></div>{i<approved?<CheckCircle2 size={20}/>:<button type="button" className="outline-btn" onClick={()=>setApproved(v=>Math.min(30,v+1))}>Approve</button>}</div>)}</div><div className="wizard-actions"><button type="button" className="outline-btn"><WandSparkles size={16}/> Regenerate Drafts</button><button type="button" className="primary-btn" onClick={next}>Next Step: Style <ChevronRight size={16}/></button></div></section>}
    {active==='Style'&&<DemoPanel number={2} icon={<Palette/>} title="Style Lock" text="Set the visual rules that keep every coloring page consistent." items={['Cozy hand-drawn illustration','Medium clean black line','Balanced background detail','Large open coloring spaces']} back={back} next={next} nextLabel="Next Step: Prompts"/>}
    {active==='Prompts'&&<DemoPanel number={3} icon={<Sparkles/>} title="Prompt Studio" text="Turn approved page concepts into editable illustration prompts." items={['Page context automatically included','Style rules applied to every prompt','Negative instructions included','Prompt versions remain reviewable']} back={back} next={next} nextLabel="Next Step: Artwork"/>}
    {active==='Artwork'&&<DemoPanel number={4} icon={<ImageIcon/>} title="Artwork Library" text="Review artwork and connect illustrations to the correct pages." items={['Generated and uploaded artwork','Page assignments','Source and generation metadata','Print-quality asset tracking']} back={back} next={next} nextLabel="Next Step: Pages"/>}
    {active==='Pages'&&<DemoPanel number={5} icon={<Palette/>} title="Page Designer" text="Choose controlled layouts for the interior pages." items={['Full Page Illustration','Illustration + Heading','Affirmation layouts','Framed and educational templates']} back={back} next={next} nextLabel="Next Step: Cover"/>}
    {active==='Cover'&&<DemoPanel number={6} icon={<BookOpen/>} title="Cover Studio" text="Build the book cover from its title, brand, artwork and description." items={['Title and subtitle','Author / brand','Cover artwork','Back-cover description']} back={back} next={next} nextLabel="Next Step: Preview"/>}
    {active==='Preview'&&<DemoPanel number={7} icon={<CheckCircle2/>} title="Preview & Validation" text="Check the full book for missing production requirements." items={['Missing artwork checks','Page completeness','Print-size validation','Actionable warnings']} back={back} next={next} nextLabel="Next Step: Export"/>}
    {active==='Export'&&<DemoPanel number={8} icon={<Download/>} title="Export Center" text="The final step prepares the production packages used for selling and publishing." items={['Printable PDF','Interior PDF','Individual PNG pages','ZIP package']} back={back} next={restart} nextLabel="Restart at Step 1" restart/>}
  </>;
}

function DemoPanel({number,icon,title,text,items,back,next,nextLabel,restart=false}:{number:number;icon:React.ReactNode;title:string;text:string;items:string[];back:()=>void;next:()=>void;nextLabel:string;restart?:boolean}) {
 return <section className="card" style={{padding:28}}><div className="wizard-title">{icon}<div><span className="section-kicker">STEP {number}</span><h2>{title}</h2><p>{text}</p></div></div><div className="quick-grid">{items.map((item,i)=><div className="quick-card" key={item}><div className="quick-icon">{i+1}</div><strong>{item}</strong><span>Included in the Coloring Book Studio workflow.</span></div>)}</div><div className="wizard-actions"><button type="button" className="outline-btn" onClick={back}><ArrowLeft size={16}/> Previous Step</button><button type="button" className="primary-btn" onClick={next}>{restart?<RotateCcw size={16}/>:null}{nextLabel}{!restart?<ChevronRight size={16}/>:null}</button></div></section>;
}