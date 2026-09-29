import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Download, Image as ImageIcon, LayoutTemplate, Palette, Sparkles, WandSparkles } from 'lucide-react';

const features = [
  ['AI Book Planner','Turn a book idea into an organized, editable page plan.',<WandSparkles key="a"/>],
  ['Prompt Studio','Create consistent illustration prompts from your approved plan.',<Sparkles key="b"/>],
  ['Artwork Library','Keep generated and uploaded artwork organized by book and page.',<ImageIcon key="c"/>],
  ['Page Builder','Build pages with controlled templates made for coloring books.',<LayoutTemplate key="d"/>],
  ['Cover Studio','Create a coordinated front and back cover inside the same workflow.',<Palette key="e"/>],
  ['Export Center','Validate your project and prepare PDF, PNG and ZIP deliverables.',<Download key="f"/>],
];

const workflow = ['Book Idea','Book Plan','Style Lock','AI Prompts','Artwork','Page Design','Cover','Validation','Export','Product Listing'];

export default function Home() {
  return <main style={{minHeight:'100vh',background:'#f7f6f1'}}>
    <header style={{maxWidth:1200,margin:'0 auto',padding:'22px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:11}}>
        <span className="brand-mark"><BookOpen size={21}/></span>
        <span><strong style={{display:'block',fontFamily:'Georgia,serif'}}>Coloring Book Studio</strong><small className="section-kicker">CREATE · DESIGN · PUBLISH</small></span>
      </Link>
      <nav style={{display:'flex',alignItems:'center',gap:10}}>
        <Link className="outline-btn" href="/demo">View Demo</Link>
        <Link className="primary-btn" href="/login">Open Studio <ArrowRight size={16}/></Link>
      </nav>
    </header>

    <section style={{maxWidth:1200,margin:'0 auto',padding:'76px 28px 58px',display:'grid',gridTemplateColumns:'minmax(0,1.1fr) minmax(300px,.9fr)',gap:60,alignItems:'center'}}>
      <div>
        <span className="section-kicker">A COMPLETE COLORING-BOOK CREATION WORKSPACE</span>
        <h1 style={{fontFamily:'Georgia,serif',fontWeight:500,fontSize:'clamp(44px,6vw,76px)',lineHeight:.98,letterSpacing:'-.035em',margin:'18px 0 22px'}}>From book idea to publish-ready files.</h1>
        <p style={{fontSize:18,lineHeight:1.7,color:'#706960',maxWidth:680}}>Plan pages, lock a consistent illustration style, create prompts, organize artwork, design interiors and covers, validate your book and prepare publishing assets — all from one organized studio.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:30}}>
          <Link className="primary-btn" href="/demo"><Sparkles size={17}/> Explore Interactive Demo</Link>
          <Link className="outline-btn" href="/login">Sign In</Link>
        </div>
        <div style={{display:'flex',gap:22,flexWrap:'wrap',marginTop:30,color:'#716b63',fontSize:13}}>
          <span>✓ Kids & adult books</span><span>✓ AI-assisted workflow</span><span>✓ Print-ready production</span>
        </div>
      </div>
      <div className="card" style={{padding:22,transform:'rotate(1deg)'}}>
        <div style={{background:'linear-gradient(145deg,#c9a987,#f2e3ce)',borderRadius:16,minHeight:430,display:'grid',placeItems:'center',textAlign:'center',padding:35,color:'#523f30'}}>
          <div><span style={{letterSpacing:'.22em',fontSize:12}}>COLORING BOOK</span><h2 style={{fontFamily:'Georgia,serif',fontWeight:500,fontSize:48,lineHeight:1,margin:'18px 0'}}>Quiet<br/>Moments</h2><div style={{fontSize:62}}>☕</div><p style={{letterSpacing:'.12em',fontSize:11}}>30 COZY SPACES TO COLOR</p></div>
        </div>
      </div>
    </section>

    <section style={{maxWidth:1200,margin:'0 auto',padding:'34px 28px 72px'}}>
      <div className="section-heading"><div><span className="section-kicker">ONE CONNECTED WORKFLOW</span><h2>Keep the entire book organized.</h2></div></div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{workflow.map((x,i)=><span key={x} style={{background:'#fffdfa',border:'1px solid #e8e2d9',padding:'10px 13px',borderRadius:999,fontSize:12,fontWeight:700}}>{i+1}. {x}</span>)}</div>
    </section>

    <section style={{background:'#fffdfa',borderTop:'1px solid #e8e2d9',borderBottom:'1px solid #e8e2d9'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'74px 28px'}}>
        <div style={{maxWidth:650,marginBottom:30}}><span className="section-kicker">STUDIO TOOLS</span><h2 style={{fontFamily:'Georgia,serif',fontWeight:500,fontSize:38,margin:'10px 0'}}>Built around the real production process.</h2><p className="muted">Each tool moves the same book forward instead of making you rebuild context at every stage.</p></div>
        <div className="quick-grid">{features.map(([title,text,icon])=><article className="quick-card" key={String(title)}><div className="quick-icon">{icon}</div><strong>{title}</strong><span>{text}</span></article>)}</div>
      </div>
    </section>

    <section style={{maxWidth:1000,margin:'0 auto',padding:'84px 28px',textAlign:'center'}}>
      <CheckCircle2 size={38} style={{margin:'0 auto 18px',color:'#a8543e'}}/>
      <span className="section-kicker">SEE THE WORKFLOW BEFORE YOU START</span>
      <h2 style={{fontFamily:'Georgia,serif',fontWeight:500,fontSize:42,margin:'12px 0'}}>Take Coloring Book Studio for a test drive.</h2>
      <p className="muted" style={{maxWidth:650,margin:'0 auto 26px',lineHeight:1.7}}>The interactive demo walks through a sample project without changing production data. When you're ready, open the studio and create your own book.</p>
      <Link className="primary-btn" href="/demo">Launch Interactive Demo <ArrowRight size={16}/></Link>
    </section>

    <footer style={{borderTop:'1px solid #e8e2d9',padding:'28px',textAlign:'center',color:'#817970',fontSize:12}}>Coloring Book Studio · A Kia DeV Studios product</footer>
  </main>;
}
