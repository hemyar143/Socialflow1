import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animatePostId, setAnimatePostId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [hashtagFilter, setHashtagFilter] = useState(null);
  const [trendingTags, setTrendingTags] = useState([]);
  const router = useRouter();

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((t) => (t.visible ? { ...t, visible: false } : t));
    }, 3000);
  };

  const extractHashtags = (text) => {
    return (text.match(/#\w+/g) || []).map((tag) => tag.toLowerCase());
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/');
      else setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/');
      else setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      const allPosts = hashtagFilter
        ? data.filter((p) => p.content.toLowerCase().includes(hashtagFilter.toLowerCase()))
        : data;

      setPosts(allPosts);

      // 🔥 Trending Hashtags (24hr)
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const todayPosts = data.filter((p) => new Date(p.created_at) > oneDayAgo);

      let allTags = [];
      todayPosts.forEach((p) => {
        allTags = allTags.concat(extractHashtags(p.content));
      });

      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      setTrendingTags(sortedTags);

      // ✅ Store today's snapshot in hashtag_trends
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('hashtag_trends').delete().eq('trend_date', today);
      await supabase.from('hashtag_trends').insert(
        sortedTags.map(({ tag, count }) => ({
          tag,
          count,
          trend_date: today,
        }))
      );
    }
  };

  useEffect(() => {
    if (session) fetchPosts();
  }, [session, hashtagFilter]);

  const handlePostSubmit = async () => {
    if (!post.trim()) return;
    setLoading(true);

    const { error } = await supabase.from('posts').insert({ content: post });

    if (error) {
      showToast('Failed to post', 'error');
    } else {
      setPost('');
      setAnimatePostId(null);
      await fetchPosts();
      setIsModalOpen(false);
      showToast('✅ Post added!', 'success');
      setAnimatePostId(new Date().getTime());
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    showToast('👋 Signed out', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto glass p-6 rounded-xl shadow-lg backdrop-blur-md bg-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome, {session?.user?.email}</h2>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 text-sm"
          >
            Sign Out
          </button>
        </div>

        {trendingTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">🔥 Trending Today</h3>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setHashtagFilter(tag)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20"
                >
                  {tag} <span className="text-gray-400">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {hashtagFilter && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-cyan-300">
              Filtering by <strong>{hashtagFilter}</strong>
            </span>
            <button
              onClick={() => setHashtagFilter(null)}
              className="text-sm text-red-300 hover:text-red-400 underline"
            >
              Clear Filter
            </button>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
        <ul className="space-y-4">
          {posts.map((p, index) => (
            <li
              key={p.id}
              className={`bg-white/5 border border-white/10 p-4 rounded-lg transition-all duration-500 ease-out transform ${
                index === 0 && animatePostId ? 'scale-105 opacity-100' : 'opacity-90'
              }`}
            >
              <p className="text-lg">
                {p.content.split(/(\s+)/).map((word, i) =>
                  word.startsWith('#') ? (
                    <button
                      key={i}
                      onClick={() => setHashtagFilter(word)}
                      className="text-cyan-400 font-medium hover:underline cursor-pointer"
                    >
                      {word}
                    </button>
                  ) : (
                    word
                  )
                )}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(p.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-xl transition duration-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl max-w-md w-full text-white shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-red-400"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">New Post</h3>
            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              rows={4}
              className="w-full bg-white/10 border border-white/20 p-3 rounded-md mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="What's on your mind?"
            />
            <button
              onClick={handlePostSubmit}
              disabled={loading}
              className={`bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md w-full ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50
            backdrop-blur-md transition-all duration-300 flex items-center justify-between gap-4 max-w-md w-fit
            ${
              toast.type === 'success'
                ? 'bg-green-500/20 text-green-200'
                : toast.type === 'error'
                ? 'bg-red-500/20 text-red-200'
                : 'bg-white/10 text-white'
            }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="text-xl font-bold leading-none hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}