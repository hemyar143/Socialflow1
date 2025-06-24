import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [session, setSession] = useState(null);
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchPosts();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchPosts();
    });
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPosts(data);
  }

  async function handlePostSubmit() {
    if (!post) return;
    await supabase.from('posts').insert({ content: post });
    setPost('');
    fetchPosts();
  }

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Welcome to Sociflow</h2>
        <button onClick={handleSignIn}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome, {session.user.email}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div style={{ marginTop: 20 }}>
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write something..."
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>
      <ul style={{ marginTop: 20 }}>
        {posts.map((p) => (
          <li key={p.id} style={{ borderBottom: '1px solid #ccc' }}>
            {p.content}
          </li>
        ))}
      </ul>
    </div>
  );
}