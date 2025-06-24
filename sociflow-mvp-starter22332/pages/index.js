import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [session, setSession] = useState(null);
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data);
  }

  async function handlePostSubmit() {
    if (!post) return;
    await supabase.from('posts').insert({ content: post });
    setPost('');
    fetchPosts();
  }

  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome to Sociflow</h2>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}>Login with GitHub</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {session.user.email}</h2>
      <textarea value={post} onChange={(e) => setPost(e.target.value)} placeholder="Write your post..." />
      <button onClick={handlePostSubmit}>Post</button>
      <div style={{ marginTop: 20 }}>
        {posts.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>{p.content}</div>
        ))}
      </div>
    </div>
  );
}