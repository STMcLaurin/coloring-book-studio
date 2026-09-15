import Link from 'next/link';
import { ArrowRight, Plus, Search } from 'lucide-react';

const books = [
  {title:'Quiet Moments', meta:'Adult Relaxation · 30 pages', status:'PLANNING', cls:'cozy-cover', progress:20},
  {title:'Little Dreamers', meta:'Kids 4–7 · 30 pages', status:'ARTWORK', cls:'dreamers', progress:46},
  {title:'Affirm & Become', meta:'Teen / Adult · 30 pages', status:'IDEA', cls:'affirm', progress:8}
];

export default function BooksPage(){return <><section className="hero-row compact"><div><span className="section-kicker">PROJECT LIBRARY</span><h1>My Books</h1><p>Every coloring book you create lives here from first idea through publication.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> New Book</Link></section><div className="filter-bar card"><div className="search-box"><Search size={18}/><input aria-label="Search books" placeholder="Search your books..."/></div><div className="filter-pills"><button className="selected">All</button><button>In Progress</button><button>Ready</button><button>Published</button></div></div><section className="project-grid">{books.map(b=><article className="project-card card" key={b.title}><div className={`project-cover ${b.cls}`}><span>{b.title.split(' ')[0]}</span><strong>{b.title.split(' ').slice(1).join(' ')}</strong><div>✦</div></div><div className="project-card-body"><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span><h2>{b.title}</h2><p>{b.meta}</p><div className="progress-label"><strong>{b.progress}%</strong><span>complete</span></div><div className="progress"><span style={{width:`${b.progress}%`}}/></div><Link href="/books/demo/overview" className="outline-btn">Open Book <ArrowRight size={16}/></Link></div></article>)}</section></>}
