import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default function BooksPage(){
  return <>
    <section className="hero-row compact"><div><span className="section-kicker">PROJECT LIBRARY</span><h1>My Books</h1><p>Every coloring book you create lives here from first idea through publication.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> New Book</Link></section>
    <div className="filter-bar card"><div className="search-box"><Search size={18}/><input aria-label="Search books" placeholder="Search your books..." disabled/></div><div className="filter-pills"><button className="selected">All</button><button disabled>In Progress</button><button disabled>Ready</button><button disabled>Published</button></div></div>
    <section className="card" style={{padding:'40px', textAlign:'center'}}><h2>No books yet</h2><p className="muted">Sample projects have been removed. Books you create and save will appear here.</p><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create Your First Book</Link></section>
  </>;
}
