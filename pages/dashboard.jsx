import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import SetupChecklist from '../components/SetupChecklist';
import PostEditor from '../components/PostEditor';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth');
      else setUser(user);
    });
  }, []);

  return user ? (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Sociflow</h1>
      <SetupChecklist user={user} />
      <PostEditor user={user} />
    </div>
  ) : null;
}