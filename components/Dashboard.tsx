
import React from 'react';
import type { View } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { DocumentAnalysisIcon } from './icons/DocumentAnalysisIcon';
import { BiasIcon } from './icons/BiasIcon';

interface DashboardProps {
  navigateTo: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-amber-400">Justice Meets Technology</h2>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          An intelligent, transparent, and ethical digital assistant for the modern legal ecosystem.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DashboardCard
          icon={<ChatIcon />}
          title="AI Legal Assistant"
          description="Ask complex legal questions and get instant, data-backed answers from an AI trained on Indian law."
          onClick={() => navigateTo('chat')}
        />
        <DashboardCard
          icon={<DocumentAnalysisIcon />}
          title="Case Analysis & Prediction"
          description="Upload case documents to get automated summaries, relevant precedents, and outcome predictions."
          onClick={() => navigateTo('analysis')}
        />
        <DashboardCard
          icon={<BiasIcon />}
          title="Bias Detection Engine"
          description="Analyze legal texts and judgments for potential bias, promoting fairness and consistency in law."
          onClick={() => navigateTo('bias')}
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center cursor-pointer
                 hover:bg-slate-700/70 hover:border-amber-400 transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center text-amber-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-amber-400 mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
};

export default Dashboard;
