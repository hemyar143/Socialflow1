import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { inject } from '@vercel/speed-insights';

inject(); // Add this line at the top

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {});
    return () => listener.subscription.unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;