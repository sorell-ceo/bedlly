import { sb } from '../lib/supabase';
import Home from '../components/Home';
export const revalidate = 15; // new listings appear within ~15s
export default async function Page() {
  const { data } = await sb.from('pgs').select('*').eq('is_published', true).order('created_at', { ascending: false });
  return <Home pgs={data || []} />;
}
