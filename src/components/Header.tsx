import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-sm border-b border-amber-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <ScaleIcon className="w-10 h-10 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold text-amber-400 tracking-wider">AI-Powered Justice System</h1>
            <p className="text-xs text-slate-400">Justice Meets Technology</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
