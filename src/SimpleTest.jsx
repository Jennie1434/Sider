export default function SimpleTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0C15',
      color: 'white',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ L'application fonctionne !</h1>
      <p style={{ fontSize: '18px' }}>Si vous voyez ce message, React fonctionne correctement.</p>
      <p style={{ fontSize: '16px', color: '#94a3b8', marginTop: '20px' }}>
        Le problème vient peut-être du composant ProfilingGame ou de ses imports.
      </p>
    </div>
  );
}


