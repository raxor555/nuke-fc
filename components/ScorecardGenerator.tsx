
import React, { useState } from 'react';
import { ScorecardState, GoalDetail, ROSTER_PLAYERS } from '../types';
import { generateScorecardImage } from '../services/geminiService';

// Icons
const IconScoreboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#D4AF37]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25v2.25m0 0v2.25m0-2.25h17.25M3.375 12.75v2.25m0 0h17.25M12 12.75v2.25m0 12.75V12.75" />
  </svg>
);

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
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

const IconDragon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#D4AF37]">
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  );

const IconShield = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-400">
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.801a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 10.5a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd" />
    </svg>
);

const IconImage = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );

interface Props {
  onBack: () => void;
}

export const ScorecardGenerator: React.FC<Props> = ({ onBack }) => {
  const [state, setState] = useState<ScorecardState>({
    opponentName: '',
    nukeScore: '0',
    opponentScore: '0',
    nukeScorers: '',
    opponentScorers: '',
    nukeGoalDetails: [],
    matchType: 'League Match',
    matchPhotoBase64: null,
    nukeLogoBase64: null,
    opponentLogoBase64: null,
    referenceImageBase64: null,
    generatedImageUrl: null,
    isGenerating: false,
    error: null,
  });

  // Helper to sync nukeScorers string with details
  const updateScorersString = (details: GoalDetail[]): string => {
    return details
        .map(d => {
            const p = ROSTER_PLAYERS.find(rp => rp.id === d.playerId);
            const name = p ? p.name : '';
            if (!name) return null;
            return d.minute ? `${name} ${d.minute}'` : name;
        })
        .filter(s => s !== null)
        .join(', ');
  };

  const handleNukeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const score = parseInt(val) || 0;
    
    // Resize details array based on score
    setState(prev => {
        const currentDetails = [...prev.nukeGoalDetails];
        let newDetails = currentDetails;

        if (score > currentDetails.length) {
            // Add empty slots
            const toAdd = score - currentDetails.length;
            for (let i = 0; i < toAdd; i++) {
                newDetails.push({ playerId: '', minute: '' });
            }
        } else if (score < currentDetails.length) {
            // Remove extra slots
            newDetails = currentDetails.slice(0, score);
        }

        return {
            ...prev,
            nukeScore: val,
            nukeGoalDetails: newDetails,
            nukeScorers: updateScorersString(newDetails)
        };
    });
  };

  const handleGoalDetailChange = (index: number, field: keyof GoalDetail, value: string) => {
    setState(prev => {
        const newDetails = [...prev.nukeGoalDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        return {
            ...prev,
            nukeGoalDetails: newDetails,
            nukeScorers: updateScorersString(newDetails)
        };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, matchPhotoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (field: keyof ScorecardState, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setState(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
  }

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      if (!state.matchPhotoBase64) {
          throw new Error("Please upload a match photo.");
      }
      const imageUrl = await generateScorecardImage(state);
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
    link.download = `nuke-fc-scorecard-${Date.now()}.png`;
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
               <IconScoreboard />
            </div>
            <div>
              <h1 className="font-teko font-bold text-3xl tracking-wide uppercase text-white">
                Scorecard <span className="text-[#D4AF37]">Generator</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Post-Match Report</p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 space-y-6">
            
            {/* Match Photo Upload - Priority */}
            <div>
               <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Match Photo (Required)</label>
               <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 hover:border-[#D4AF37]/50 transition-colors group cursor-pointer relative overflow-hidden">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    {state.matchPhotoBase64 ? (
                        <div className="w-full aspect-video rounded overflow-hidden bg-black border border-slate-600">
                             <img src={state.matchPhotoBase64} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                                <IconUpload />
                            </div>
                            <span className="text-sm font-oswald text-slate-300">Click to Upload Match Photo</span>
                        </>
                    )}
                  </div>
               </div>
            </div>

            {/* Logos & Ref Image Grid */}
            <div className="grid grid-cols-3 gap-3">
                
                {/* Nuke Logo */}
                <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Nuke Emblem</label>
                    <div className="aspect-square bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#D4AF37] relative group flex items-center justify-center overflow-hidden">
                        <input type="file" accept="image/*" onChange={(e) => handleUpload('nukeLogoBase64', e)} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                        {state.nukeLogoBase64 ? (
                             <img src={state.nukeLogoBase64} className="w-full h-full object-contain p-2" alt="Nuke Logo" />
                        ) : (
                             <IconDragon />
                        )}
                        <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-center text-white py-1 uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity">Upload</div>
                    </div>
                </div>

                {/* Opponent Logo */}
                <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Opp. Emblem</label>
                    <div className="aspect-square bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#D4AF37] relative group flex items-center justify-center overflow-hidden">
                        <input type="file" accept="image/*" onChange={(e) => handleUpload('opponentLogoBase64', e)} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                        {state.opponentLogoBase64 ? (
                             <img src={state.opponentLogoBase64} className="w-full h-full object-contain p-2" alt="Opp Logo" />
                        ) : (
                             <IconShield />
                        )}
                        <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-center text-white py-1 uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity">Upload</div>
                    </div>
                </div>

                {/* Style Ref */}
                <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Style Ref</label>
                    <div className="aspect-square bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#D4AF37] relative group flex items-center justify-center overflow-hidden">
                        <input type="file" accept="image/*" onChange={(e) => handleUpload('referenceImageBase64', e)} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                        {state.referenceImageBase64 ? (
                             <img src={state.referenceImageBase64} className="w-full h-full object-cover" alt="Style Ref" />
                        ) : (
                             <IconImage />
                        )}
                        <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-center text-white py-1 uppercase font-oswald opacity-0 group-hover:opacity-100 transition-opacity">Upload</div>
                    </div>
                </div>

            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Match Type</label>
                  <input 
                    type="text" 
                    value={state.matchType}
                    onChange={(e) => setState(prev => ({...prev, matchType: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none"
                    placeholder="e.g. Friendly"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Opponent</label>
                  <input 
                    type="text" 
                    value={state.opponentName}
                    onChange={(e) => setState(prev => ({...prev, opponentName: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none uppercase"
                    placeholder="TEAM NAME"
                  />
                </div>
            </div>

            <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800">
                <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mb-4 block text-center">Final Score</label>
                <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                        <label className="text-[10px] text-slate-500 block mb-1">NUKE FC</label>
                        <input 
                            type="number"
                            min="0" 
                            value={state.nukeScore}
                            onChange={handleNukeScoreChange}
                            className="w-16 h-16 bg-slate-950 border border-slate-700 rounded text-center text-3xl font-teko text-white focus:border-[#046A38] outline-none"
                        />
                    </div>
                    <span className="text-2xl font-teko text-slate-600">-</span>
                    <div className="text-center">
                        <label className="text-[10px] text-slate-500 block mb-1">OPPONENT</label>
                        <input 
                            type="number"
                            min="0" 
                            value={state.opponentScore}
                            onChange={(e) => setState(prev => ({...prev, opponentScore: e.target.value}))}
                            className="w-16 h-16 bg-slate-950 border border-slate-700 rounded text-center text-3xl font-teko text-white focus:border-red-900 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Scorer Inputs for Nuke FC */}
            {state.nukeGoalDetails.length > 0 && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">
                        Nuke FC Goal Scorers
                    </label>
                    <div className="space-y-2">
                        {state.nukeGoalDetails.map((goal, idx) => (
                            <div key={idx} className="flex gap-2">
                                <select
                                    value={goal.playerId}
                                    onChange={(e) => handleGoalDetailChange(idx, 'playerId', e.target.value)}
                                    className="flex-1 bg-slate-800 text-white font-oswald text-sm border border-slate-700 rounded px-3 py-2 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                >
                                    <option value="" disabled>Select Scorer (Goal {idx + 1})</option>
                                    {ROSTER_PLAYERS.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} #{p.number}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Min'"
                                    value={goal.minute}
                                    onChange={(e) => handleGoalDetailChange(idx, 'minute', e.target.value)}
                                    className="w-20 bg-slate-800 text-white font-oswald text-sm border border-slate-700 rounded px-3 py-2 outline-none focus:border-[#D4AF37] text-center"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Opponent Scorers */}
            <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2 block">Opponent Scorers</label>
                <textarea 
                    value={state.opponentScorers}
                    onChange={(e) => setState(prev => ({...prev, opponentScorers: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald text-sm focus:border-[#D4AF37] outline-none h-20 placeholder-slate-600"
                    placeholder="List opponent goal scorers (separate with commas)..."
                />
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
              {state.isGenerating ? 'Generating Scorecard...' : <><IconSparkles /> Generate Graphic</>}
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
                <p className="font-teko text-xl text-[#D4AF37] tracking-widest uppercase">Processing Result...</p>
              </div>
            ) : state.generatedImageUrl ? (
              <img 
                src={state.generatedImageUrl} 
                alt="Generated Scorecard" 
                className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-out]"
              />
            ) : (
              <div className="text-center opacity-30">
                <IconScoreboard />
                <p className="font-teko text-2xl mt-4 uppercase tracking-widest text-slate-400">Scorecard Preview</p>
                <p className="font-inter text-xs text-slate-500 mt-1">Upload photo & enter scores to begin</p>
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
