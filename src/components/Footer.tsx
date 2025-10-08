import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/50 border-t border-amber-500/30 mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} HACK ELITE. Redefining justice with AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
