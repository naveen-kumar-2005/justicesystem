
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import LegalAssistantChat from './components/LegalAssistantChat';
import CaseAnalysis from './components/CaseAnalysis';
import BiasDetector from './components/BiasDetector';
import type { View } from './types';
import { HomeIcon } from './components/icons/HomeIcon';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navigateTo = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <LegalAssistantChat />;
      case 'analysis':
        return <CaseAnalysis />;
      case 'bias':
        return <BiasDetector />;
      case 'dashboard':
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView !== 'dashboard' && (
          <button
            onClick={() => navigateTo('dashboard')}
            className="mb-6 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            <HomeIcon />
            Back to Dashboard
          </button>
        )}
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
