import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] =useState('checking...');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    axios.get(`${apiUrl}/ping`)
      .then(res => setStatus(res.data.message))
      .catch(() => setStatus('backend not reachable'));
  }, []);

  return <div style = {{ padding: '2rem' }}>{status} </div>
}

export default App;