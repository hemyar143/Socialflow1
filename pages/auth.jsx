import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/dashboard');
    });
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://stunning-goggles-5g9x9p65prwj27qiw-3000.app.github.dev/dashboard',
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Sociflow</h1>
        <button
          onClick={handleSignIn}
          className="bg-blue-600 text-white px-6 py-3 rounded-md"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}