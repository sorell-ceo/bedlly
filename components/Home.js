'use client';
import { useState } from 'react';
const WA = process.env.NEXT_PUBLIC_WHATSAPP || '91XXXXXXXXXX';
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const ROOMS = ['Any', 'Single Sharing', 'Double Sharing', 'Triple Sharing'];
const BUDGETS = [[6000, 'upto 6k'], [8000, 'upto 8k'], [10000, 'upto 10k'], [12000, 'upto 12k'], [15000, 'upto 15k'], [999999, 'Any']];

export default function Home({ pgs }) {
  const [room, setRoom] = useState('Any');
  const [budget, setBudget] = useState(10000);
  const list = pgs.filter((p) => (room === 'Any' || p.sharing === room) && p.price <= budget);
  return (
    <main className="wrap">
      <header className="top">
        <span className="logo">bedlly.</span>
        <a className="wa press" href={wa('Hi bedlly, I need help finding a PG near SD College.')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.3 1.3-1.8 1.3-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.2.1.8-.1 1.6Z" /></svg>
          WhatsApp Us
        </a>
      </header>

      <h1>Find a PG that doesn&apos;t <span className="ac">suck</span></h1>
      <p className="sub">Specially made for SD College Students</p>
      <span className="badge">Personally visited · No fees till you move in</span>

      <div className="search">
        <div className="field"><label>Room Type</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>{ROOMS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div className="field"><label>Budget</label>
          <select value={budget} onChange={(e) => setBudget(+e.target.value)}>{BUDGETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <button className="go press" onClick={() => document.getElementById('pgs').scrollIntoView({ behavior: 'smooth' })}>Search →</button>
      </div>

      <h2 id="pgs">Top PGs for <span className="ac gold">SD College</span></h2>
      <div className="grid">
        {list.map((p) => (
          <article className="card" key={p.id}>
            <div className="row"><span className="pill blue">{p.area}</span><span className="pill orange">{p.gender}</span></div>
            <div className="media">
              {(p.media?.length ? p.media : [0, 0, 0]).map((m, i) =>
                !m ? <div key={i} /> : m.type === 'video'
                  ? <video key={i} src={m.url} muted playsInline loop preload="metadata" controls />
                  : <img key={i} src={m.url} alt={p.name} loading="lazy" decoding="async" />)}
            </div>
            <div className="row">
              <div className="price">{p.price.toLocaleString('en-IN')}<small>/month</small></div>
              <span className="pill lime">{p.sharing}</span>
            </div>
            <div><h3 className="name">{p.name}</h3><p className="desc">{p.description}</p></div>
            {p.pros && <div className="bar pro">{p.pros}</div>}
            {p.cons && <div className="bar con">{p.cons}</div>}
            <div className="acts">
              {p.parent_pdf_url ? <a className="b1 press" href={p.parent_pdf_url} target="_blank" rel="noopener">Parent PDF</a> : <span className="b1 off">Parent PDF</span>}
              <a className="b2 press" href={wa(`Hi bedlly, I want to book a free visit for ${p.name} (${p.area}).`)}>Book Free Visit</a>
            </div>
          </article>
        ))}
      </div>
      {!list.length && <p className="desc">No PGs match yet. Try a higher budget or WhatsApp us.</p>}
    </main>
  );
}
