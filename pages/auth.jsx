import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (type) => {
    setLoading(true);
    const { error } = type === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) alert(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4">Welcome to Sociflow</h1>
      <input
        className="border p-2 mb-2 w-full max-w-xs"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-4 w-full max-w-xs"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="space-x-2">
        <button onClick={() => handleLogin('signin')} className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
        <button onClick={() => handleLogin('signup')} className="bg-gray-500 text-white px-4 py-2 rounded">Sign Up</button>
      </div>
    </div>
  );
}