
import React, { useState } from 'react';
import { MatchDayState, ROSTER_PLAYERS } from '../types';
import { generateMatchDayImage } from '../services/geminiService';

// Icons
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#D4AF37]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconDownload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 9.75V15m0 0l3-3m-3 3l-3-3m-6-6h7.5" />
    </svg>
);

const IconSparkles = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const IconTshirt = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

interface Props {
  onBack: () => void;
}

export const MatchDayGenerator: React.FC<Props> = ({ onBack }) => {
  const [state, setState] = useState<MatchDayState>({
    player1Image: null,
    player1Id: '',
    player2Image: null,
    player2Id: '',
    player3Image: null,
    player3Id: '',
    kitImageBase64: null,
    opponentName: '',
    venue: '',
    time: '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    generatedImageUrl: null,
    isGenerating: false,
    error: null,
  });

  const handleImageUpload = (field: 'player1Image' | 'player2Image' | 'player3Image' | 'kitImageBase64', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerIdChange = (field: 'player1Id' | 'player2Id' | 'player3Id', value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const imageUrl = await generateMatchDayImage(state);
      setState(prev => ({ ...prev, generatedImageUrl: imageUrl }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleDownload = () => {
    if (!state.generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = state.generatedImageUrl;
    link.download = `nuke-fc-matchday-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] lg:w-[480px] bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-10 h-screen overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-950/95 z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#D4AF37] mb-4 text-xs font-oswald uppercase tracking-widest transition-colors">
            <IconArrowLeft /> Back to Menu
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-black overflow-hidden">
               <IconCalendar />
            </div>
            <div>
              <h1 className="font-teko font-bold text-3xl tracking-wide uppercase text-white">
                Match Day <span className="text-[#D4AF37]">Poster</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Gritty Collage Generator</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 space-y-8">
            
            {/* Player Images Section */}
            <div>
               <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4 block">
                 Select 3 Stars (Required)
               </label>
               <div className="grid grid-cols-3 gap-3">
                 {([1, 2, 3] as const).map((i) => {
                   const imgField = `player${i}Image` as keyof MatchDayState;
                   const idField = `player${i}Id` as keyof MatchDayState;
                   const imgVal = state[imgField] as string | null;
                   const idVal = state[idField] as string;

                   return (
                     <div key={i} className="flex flex-col gap-2">
                        <div className="aspect-[3/4] bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#D4AF37] relative group overflow-hidden">
                            <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(imgField as any, e)} 
                            className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                            />
                            {imgVal ? (
                            <img src={imgVal} alt={`Player ${i}`} className="w-full h-full object-cover" />
                            ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                <IconUser />
                                <span className="text-[10px] font-oswald uppercase">Player {i}</span>
                            </div>
                            )}
                            <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-center text-white py-1 uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity">
                            {imgVal ? 'Replace' : 'Upload'}
                            </div>
                        </div>
                        
                        <select
                            value={idVal}
                            onChange={(e) => handlePlayerIdChange(idField as any, e.target.value)}
                            className="w-full bg-slate-800 text-[10px] text-white font-oswald border border-slate-700 rounded px-1 py-1 outline-none focus:border-[#D4AF37]"
                        >
                            <option value="" disabled>Select Name</option>
                            {ROSTER_PLAYERS.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* Match Info & Kit */}
            <div className="space-y-4">
               
               {/* Opponent & Kit Row */}
               <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Opponent</label>
                        <input 
                            type="text" 
                            value={state.opponentName}
                            onChange={(e) => setState(prev => ({...prev, opponentName: e.target.value}))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none uppercase"
                            placeholder="ENTER OPPONENT NAME"
                        />
                    </div>

                    <div className="w-24">
                        <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Team Kit</label>
                        <div className="h-[46px] bg-slate-900 border border-slate-700 rounded-lg relative hover:border-[#D4AF37] overflow-hidden group">
                             <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload('kitImageBase64', e)} 
                                className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                            />
                            {state.kitImageBase64 ? (
                                <img src={state.kitImageBase64} alt="Kit" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconTshirt />
                                </div>
                            )}
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[8px] uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {state.kitImageBase64 ? 'Change' : 'Upload'}
                            </div>
                        </div>
                    </div>
               </div>


               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Venue</label>
                    <input 
                        type="text" 
                        value={state.venue}
                        onChange={(e) => setState(prev => ({...prev, venue: e.target.value}))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none uppercase"
                        placeholder="Stadium Name"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Kick-off</label>
                    <input 
                        type="text" 
                        value={state.time}
                        onChange={(e) => setState(prev => ({...prev, time: e.target.value}))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none uppercase"
                        placeholder="e.g. 8:00 PM"
                    />
                 </div>
               </div>

               <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Date Text</label>
                  <input 
                    type="text" 
                    value={state.date}
                    onChange={(e) => setState(prev => ({...prev, date: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none uppercase"
                  />
               </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 sticky bottom-0 z-20">
          {state.error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-200 text-xs rounded">
              {state.error}
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="w-full group relative overflow-hidden bg-gradient-to-br from-[#D4AF37] to-[#B4941F] hover:to-[#D4AF37] text-black font-teko font-bold text-2xl uppercase tracking-widest py-4 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {state.isGenerating ? 'Designing Poster...' : <><IconSparkles /> Generate Graphic</>}
            </span>
             <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
          </button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-black/50 flex items-center justify-center p-8 md:p-12 lg:p-16 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ 
               backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`, 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center">
          <div className={`
             relative w-full aspect-[3/4] 
             bg-slate-900/50 
             border-2 border-dashed border-slate-700 
             rounded-sm shadow-2xl 
             flex items-center justify-center 
             overflow-hidden
             transition-all duration-500
             ${state.generatedImageUrl ? 'border-solid border-[#D4AF37] shadow-[0_0_50px_rgba(4,106,56,0.3)]' : ''}
          `}>
            
            {state.isGenerating ? (
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-teko text-xl text-[#D4AF37] tracking-widest uppercase">Assembling Collage...</p>
              </div>
            ) : state.generatedImageUrl ? (
              <img 
                src={state.generatedImageUrl} 
                alt="Generated Match Day Poster" 
                className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-out]"
              />
            ) : (
              <div className="text-center opacity-30">
                <IconCalendar />
                <p className="font-teko text-2xl mt-4 uppercase tracking-widest text-slate-400">Poster Preview</p>
                <p className="font-inter text-xs text-slate-500 mt-1">Upload 3 player photos to start</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
          </div>

          {state.generatedImageUrl && !state.isGenerating && (
            <button 
              onClick={handleDownload}
              className="mt-6 flex items-center gap-2 px-8 py-3 bg-white text-black font-oswald font-bold uppercase tracking-widest text-sm rounded hover:bg-slate-200 transition-colors shadow-lg hover:shadow-white/20"
            >
              <IconDownload /> Download High-Res
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
