import Link from 'next/link';
import { Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { deleteBook, duplicateBook, updateBook } from './actions';

export default async function BooksPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect('/login');

  const {data:books,error}=await supabase.from('books')
    .select('id,title,subtitle,theme,status,progress,page_count,updated_at')
    .eq('user_id',userId)
    .order('updated_at',{ascending:false});
  if(error) throw new Error(`BOOKS_LOAD_FAILED: ${error.message}`);

  return <>
    <section className="hero-row compact"><div><span className="section-kicker">PROJECT LIBRARY</span><h1>My Books</h1><p>Every coloring book you create lives here from first idea through publication.</p></div><Link className="primary-btn" href="/books/new"><Plus size={18}/> New Book</Link></section>

    {!books?.length ? <section className="card" style={{padding:'40px',textAlign:'center'}}><h2>No books yet</h2><p className="muted">There is no sample data. Create your first real project to begin.</p><Link className="primary-btn" href="/books/new"><Plus size={18}/> Create Your First Book</Link></section> :
    <section style={{display:'grid',gap:'16px'}}>
      {books.map(book=><article className="card" style={{padding:'22px'}} key={book.id}>
        <div className="label-row"><span className="status planning">{String(book.status??'planning').toUpperCase()}</span><span>{book.page_count??0} pages · {book.progress??0}%</span></div>
        <form action={updateBook}>
          <input type="hidden" name="book_id" value={book.id}/>
          <div className="form-grid top-space">
            <label>Title<input name="title" required defaultValue={book.title??''}/></label>
            <label>Subtitle<input name="subtitle" defaultValue={book.subtitle??''}/></label>
            <label>Theme<input name="theme" defaultValue={book.theme??''}/></label>
            <label>Status<select name="status" defaultValue={book.status??'planning'}><option value="idea">Idea</option><option value="planning">Planning</option><option value="artwork">Artwork</option><option value="design">Design</option><option value="review">Review</option><option value="ready">Ready</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          </div>
          <div className="wizard-actions"><button className="outline-btn" type="submit">Save Changes</button><Link className="primary-btn" href={`/books/${book.id}/plan`}><ExternalLink size={16}/> Open Book</Link></div>
        </form>
        <div className="wizard-actions">
          <form action={duplicateBook}><input type="hidden" name="book_id" value={book.id}/><button className="outline-btn"><Copy size={16}/> Duplicate</button></form>
          <form action={deleteBook}><input type="hidden" name="book_id" value={book.id}/><button className="outline-btn"><Trash2 size={16}/> Delete</button></form>
        </div>
      </article>)}
    </section>}
  </>;
}
