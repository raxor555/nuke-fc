
import React, { useState } from 'react';
import { AppView } from './types';
import { SquadBuilder } from './components/SquadBuilder';
import { ScorecardGenerator } from './components/ScorecardGenerator';
import { MatchDayGenerator } from './components/MatchDayGenerator';

// Menu Icons
const IconDragon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-[#D4AF37] mb-4">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
  </svg>
);

const IconShirt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-slate-300 group-hover:text-[#D4AF37] transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconScoreboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-slate-300 group-hover:text-[#D4AF37] transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25v2.25m0 0v2.25m0-2.25h17.25M3.375 12.75v2.25m0 0h17.25M12 12.75v2.25m0 12.75V12.75" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-slate-300 group-hover:text-[#D4AF37] transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  if (currentView === 'squad-builder') {
    return <SquadBuilder onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'scorecard') {
    return <ScorecardGenerator onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'match-day') {
    return <MatchDayGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] text-white font-inter flex items-center justify-center overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#046A38] opacity-20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl p-6 flex flex-col items-center">
        
        <div className="flex flex-col items-center mb-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37]/30 bg-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <IconDragon />
            </div>
            <h1 className="font-teko font-bold text-6xl tracking-wide uppercase text-white mb-2 text-center">
                Nuke FC <span className="text-[#D4AF37]">Media Hub</span>
            </h1>
            <p className="text-sm font-oswald tracking-[0.3em] uppercase text-slate-400">Official Graphic Generator Suite</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* Card 1: Squad Builder */}
            <button 
                onClick={() => setCurrentView('squad-builder')}
                className="group relative h-64 bg-slate-900/40 border border-slate-800 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(4,106,56,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center gap-4"
            >
                <div className="p-5 rounded-full bg-slate-800/50 group-hover:bg-[#046A38]/20 transition-colors">
                    <IconShirt />
                </div>
                <div className="text-center">
                    <h2 className="font-teko font-bold text-2xl uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">Squad Builder</h2>
                    <p className="text-[10px] font-inter text-slate-500 mt-2 px-6">Starting 5v5 / 6v6 Lineups</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Card 2: Scorecard Generator */}
            <button 
                onClick={() => setCurrentView('scorecard')}
                className="group relative h-64 bg-slate-900/40 border border-slate-800 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center gap-4"
            >
                <div className="p-5 rounded-full bg-slate-800/50 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <IconScoreboard />
                </div>
                <div className="text-center">
                    <h2 className="font-teko font-bold text-2xl uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">Scorecard</h2>
                    <p className="text-[10px] font-inter text-slate-500 mt-2 px-6">Post-Match Results</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

             {/* Card 3: Match Day */}
             <button 
                onClick={() => setCurrentView('match-day')}
                className="group relative h-64 bg-slate-900/40 border border-slate-800 hover:border-[#D4AF37] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-1 flex flex-col items-center justify-center gap-4"
            >
                <div className="p-5 rounded-full bg-slate-800/50 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <IconCalendar />
                </div>
                <div className="text-center">
                    <h2 className="font-teko font-bold text-2xl uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">Match Day</h2>
                    <p className="text-[10px] font-inter text-slate-500 mt-2 px-6">Collage & Fixture Posters</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

        </div>

        <div className="mt-16 text-center text-slate-600 text-[10px] font-mono">
            POWERED BY GOOGLE GEMINI • NUKE FC OFFICIAL TOOLS 2025
        </div>

      </div>
    </div>
  );
};

export default App;
