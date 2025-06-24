import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
<<<<<<< HEAD
import { inject } from '@vercel/speed-insights';

inject(); // <-- Add this line at the top
=======
import "@vercel/speed-insights";
>>>>>>> 955f51d (Initial import of Socialflow1)

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {});
    return () => listener.subscription.unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;