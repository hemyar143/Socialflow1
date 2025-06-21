export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to Sociflow 👋</h1>
      <p>Click below to begin onboarding your workspace.</p>
      <a href="/onboarding/workspace" style={{ color: 'blue', textDecoration: 'underline' }}>
        Start Onboarding →
      </a>
    </div>
  );
}
