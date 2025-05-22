import React from 'react';
import { ShieldCheck } from 'lucide-react'; // Example icon

function Header() {
  return (
    <header className="header">
      <ShieldCheck size={48} color="var(--primary-color)" style={{ marginBottom: '0.5rem' }} />
      <h1>Content Guardian AI</h1>
      <p>Upload a video to detect potentially harmful speech using our advanced multimodal AI.</p>
    </header>
  );
}

export default Header;