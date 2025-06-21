import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function PostEditor({ user }) {
  const [content, setContent] = useState('');

  const handleSchedule = async () => {
    const { error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user?.id }]);

    if (error) {
      alert('Error scheduling post: ' + error.message);
    } else {
      alert('Post scheduled successfully!');
      setContent('');
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h2 className="font-semibold mb-2">Create a Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-24 border rounded p-2"
        placeholder="Write something..."
      />
      <button onClick={handleSchedule} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Schedule Post
      </button>
    </div>
  );
}