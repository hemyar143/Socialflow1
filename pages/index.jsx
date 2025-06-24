import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sociflow - Smarter Social Scheduling</title>
      </Head>
      <main className="min-h-screen bg-white text-center p-10">
        <h1 className="text-4xl">🚀 Welcome to Sociflow — Now Live</h1>
        <p className="text-lg mb-8">Your AI-powered social media assistant</p>
        <Link href="/auth">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Get Started
          </button>
        </Link>
      </main>
    </>
  );
}