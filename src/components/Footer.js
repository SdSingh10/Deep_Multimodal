import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Content Guardian AI. Promoting safer online spaces.</p>
      <p>
        Powered by Advanced Multimodal Analysis.
        {/* Add links or disclaimers here if needed */}
      </p>
    </footer>
  );
}

export default Footer;