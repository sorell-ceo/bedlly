'use client';
import { useEffect, useState } from 'react';
import { sb } from '../../lib/supabase';
const empty = { name: '', area: '', gender: 'Boys Only', sharing: 'Double Sharing', price: '', description: '', pros: '', cons: '', media: [], parent_pdf_url: '', is_published: true };

async function shrink(file) { // resize photos to max 1200px WebP so the site stays fast
  if (!file.type.startsWith('image/')) return file;
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = bmp.width * k; c.height = bmp.height * k;
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.82));
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
}
async function upload(file) {
  const f = await shrink(file);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^\w.]/g, '_')}`;
  const { error } = await sb.storage.from('pg-media').upload(path, f, { contentType: f.type, cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from('pg-media').getPublicUrl(path).data.publicUrl;
}

export default function Admin() {
  const [ok, setOk] = useState(false), [rows, setRows] = useState([]), [f, setF] = useState(empty);
  const [em, setEm] = useState(''), [pw, setPw] = useState(''), [msg, setMsg] = useState('');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const load = async () => { const { data } = await sb.from('pgs').select('*').order('created_at', { ascending: false }); setRows(data || []); };
  useEffect(() => { sb.auth.getSession().then(({ data }) => { if (data.session) { setOk(true); load(); } }); }, []);

  const login = async () => { const { error } = await sb.auth.signInWithPassword({ email: em, password: pw }); if (error) return setMsg(error.message); setOk(true); load(); };
  const addMedia = async (files) => {
    setMsg('Uploading…');
    try { const add = []; for (const file of files) add.push({ url: await upload(file), type: file.type.startsWith('video') ? 'video' : 'image' }); setF((x) => ({ ...x, media: [...x.media, ...add] })); setMsg('Uploaded'); }
    catch (e) { setMsg(e.message); }
  };
  const addPdf = async (file) => { if (!file) return; setMsg('Uploading PDF…'); try { set('parent_pdf_url', await upload(file)); setMsg('PDF uploaded'); } catch (e) { setMsg(e.message); } };
  const save = async () => {
    const { id, created_at, ...rest } = f; const body = { ...rest, price: +f.price };
    const { error } = id ? await sb.from('pgs').update(body).eq('id', id) : await sb.from('pgs').insert(body);
    if (error) return setMsg(error.message);
    setMsg('Saved. Live on the site in ~15s.'); setF(empty); load();
  };
  const del = async (id) => { if (confirm('Delete this PG?')) { await sb.from('pgs').delete().eq('id', id); load(); } };

  if (!ok) return (
    <div className="adm"><h2>bedlly. admin</h2>
      <input placeholder="Email" value={em} onChange={(e) => setEm(e.target.value)} />
      <input placeholder="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button onClick={login}>Log in</button><p>{msg}</p></div>
  );
  return (
    <div className="adm">
      <h2>{f.id ? 'Edit PG' : 'Add a PG'}</h2>
      <label>Name<input value={f.name} onChange={(e) => set('name', e.target.value)} /></label>
      <label>Location tag<input placeholder="Sec 32-C • 400m from SD Gate" value={f.area} onChange={(e) => set('area', e.target.value)} /></label>
      <div className="pills">
        <label>Gender<select value={f.gender} onChange={(e) => set('gender', e.target.value)}><option>Boys Only</option><option>Girls Only</option></select></label>
        <label>Sharing<select value={f.sharing} onChange={(e) => set('sharing', e.target.value)}><option>Single Sharing</option><option>Double Sharing</option><option>Triple Sharing</option></select></label>
        <label>Price / month<input type="number" value={f.price} onChange={(e) => set('price', e.target.value)} /></label>
      </div>
      <label>Description<textarea rows="2" value={f.description} onChange={(e) => set('description', e.target.value)} /></label>
      <label>Pros (green bar)<input value={f.pros} onChange={(e) => set('pros', e.target.value)} /></label>
      <label>Cons (red bar)<input value={f.cons} onChange={(e) => set('cons', e.target.value)} /></label>
      <label>Photos / videos<input type="file" accept="image/*,video/*" multiple onChange={(e) => addMedia([...e.target.files])} /></label>
      <div className="thumbs">{f.media.map((m, i) => (
        <div key={i} onClick={() => set('media', f.media.filter((_, j) => j !== i))} title="Click to remove">
          {m.type === 'video' ? <video src={m.url} muted /> : <img src={m.url} alt="" />}</div>))}</div>
      <label>Parent PDF<input type="file" accept="application/pdf" onChange={(e) => addPdf(e.target.files[0])} /></label>
      <label><span><input type="checkbox" style={{ width: 'auto' }} checked={f.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Published</span></label>
      <div className="pills"><button onClick={save}>{f.id ? 'Save changes' : 'Add PG'}</button>{f.id && <button onClick={() => setF(empty)}>Cancel</button>}</div>
      <p>{msg}</p>
      {rows.map((r) => (
        <div className="item" key={r.id}><span>{r.name} · ₹{r.price}{!r.is_published && ' · hidden'}</span>
          <span className="pills"><button onClick={() => { setF(r); scrollTo(0, 0); }}>Edit</button><button onClick={() => del(r.id)}>Delete</button></span></div>))}
    </div>
  );
}
