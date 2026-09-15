import Link from 'next/link';
import { BookHeart } from 'lucide-react';
import { login, signup } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const query = await searchParams;
  return <main className="wizard-shell" style={{maxWidth:560, margin:'70px auto'}}>
    <section className="wizard-card card">
      <div className="wizard-title"><BookHeart/><div><span className="section-kicker">COLORING BOOK STUDIO</span><h1>Sign in to your studio</h1><p>Your books, page plans, styles, and prompts stay attached to your account.</p></div></div>
      {query.error && <p className="muted" role="alert">{query.error}</p>}
      {query.message && <p>{query.message}</p>}
      <form className="form-grid">
        <label className="full">Email<input name="email" type="email" autoComplete="email" required/></label>
        <label className="full">Password<input name="password" type="password" autoComplete="current-password" minLength={8} required/></label>
        <div className="full wizard-actions"><button className="outline-btn" formAction={signup}>Create account</button><button className="primary-btn" formAction={login}>Sign in</button></div>
      </form>
      <p className="muted">By signing in, you can create real projects instead of sample data.</p>
      <Link className="text-link" href="/">Back to Coloring Book Studio</Link>
    </section>
  </main>;
}
