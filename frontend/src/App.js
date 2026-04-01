import React, { useState, useEffect } from 'react';

// URL du backend Flask - à remplacer par l'URL Render de votre Web Service Flask
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const styles = {
  container: { fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  title: { color: '#2d3748', borderBottom: '2px solid #4a90e2', paddingBottom: '10px' },
  section: { background: '#f7fafc', borderRadius: '8px', padding: '20px', marginBottom: '20px' },
  input: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e0', marginRight: '10px', width: '200px' },
  button: { padding: '8px 16px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '4px 10px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { background: '#4a90e2', color: 'white', padding: '8px', textAlign: 'left' },
  td: { padding: '8px', borderBottom: '1px solid #e2e8f0' },
  badge: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#c6f6d5', color: '#276749' },
  error: { color: '#e53e3e', padding: '10px', background: '#fff5f5', borderRadius: '4px' },
};

function App() {
  const [users, setUsers]     = useState([]);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [health, setHealth]   = useState(null);
  const [error, setError]     = useState('');

  // Vérification de la santé de l'API
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => setHealth(d))
      .catch(() => setError('Impossible de contacter le backend Flask.'));
  }, []);

  // Chargement de la liste des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${API_URL}/users`)
      .then(r => r.json())
      .then(d => setUsers(d))
      .catch(() => setError('Erreur lors du chargement des utilisateurs.'));
  };

  const addUser = () => {
    if (!name || !email) return;
    fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
      .then(r => r.json())
      .then(() => { setName(''); setEmail(''); fetchUsers(); })
      .catch(() => setError('Erreur lors de la création de l\'utilisateur.'));
  };

  const deleteUser = (id) => {
    fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(() => setError('Erreur lors de la suppression.'));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Atelier Render — Séquence 5</h1>
      <p>Stack : <strong>React</strong> → <strong>Flask</strong> → <strong>PostgreSQL</strong></p>

      {/* Statut Backend */}
      <div style={styles.section}>
        <h2>🔌 Statut Backend</h2>
        {health
          ? <span style={styles.badge}>✅ {health.status} — env: {health.env}</span>
          : <span style={{ color: '#718096' }}>Chargement…</span>}
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Formulaire ajout utilisateur */}
      <div style={styles.section}>
        <h2>➕ Ajouter un utilisateur</h2>
        <input
          style={styles.input}
          placeholder="Nom"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button style={styles.button} onClick={addUser}>Ajouter</button>
      </div>

      {/* Liste des utilisateurs */}
      <div style={styles.section}>
        <h2>👥 Utilisateurs en base</h2>
        {users.length === 0
          ? <p style={{ color: '#718096' }}>Aucun utilisateur pour l'instant.</p>
          : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => deleteUser(u.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}

export default App;
