
import React, { useState } from 'react';
import { AppState, SelectedPlayerSlot, SquadMode, FORMATION_CONFIG, ROSTER_PLAYERS } from '../types';
import { PlayerSlotInput } from './PlayerSlotInput';
import { generateLineupImage } from '../services/geminiService';

// Icons
const IconDragon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#D4AF37]">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
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

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

interface Props {
  onBack: () => void;
}

export const SquadBuilder: React.FC<Props> = ({ onBack }) => {
  const [state, setState] = useState<AppState>({
    mode: '5v5',
    venue: 'Al Maktoum Arena',
    slots: Array(5).fill(null).map((_, i) => ({ id: `slot-${i}`, playerType: 'roster' })),
    substitutes: [],
    generatedImageUrl: null,
    isGenerating: false,
    error: null,
    logoBase64: null,
    referenceImageBase64: null,
    formation: '1-2-1'
  });

  const toggleMode = (newMode: SquadMode) => {
    const currentSlots = [...state.slots];
    let newSlots = [];
    let defaultFormation = '';

    if (newMode === '6v6') {
       defaultFormation = '2-2-1';
       if (state.mode === '5v5') {
          newSlots = [...currentSlots, { id: `slot-5`, playerType: 'roster' as const }];
       } else {
          newSlots = currentSlots;
       }
    } else {
       defaultFormation = '1-2-1';
       if (state.mode === '6v6') {
          newSlots = currentSlots.slice(0, 5);
       } else {
          newSlots = currentSlots;
       }
    }

    setState(prev => ({ 
      ...prev, 
      mode: newMode, 
      slots: newSlots, 
      formation: defaultFormation 
    }));
  };

  const updateSlot = (index: number, updatedSlot: SelectedPlayerSlot) => {
    const newSlots = [...state.slots];
    newSlots[index] = updatedSlot;
    setState(prev => ({ ...prev, slots: newSlots }));
  };

  const addSubstitute = () => {
    setState(prev => ({
      ...prev,
      substitutes: [...prev.substitutes, { id: `sub-${Date.now()}`, playerType: 'roster' }]
    }));
  };

  const removeSubstitute = (index: number) => {
    setState(prev => {
      const newSubs = [...prev.substitutes];
      newSubs.splice(index, 1);
      return { ...prev, substitutes: newSubs };
    });
  };

  const updateSubstitute = (index: number, updatedSlot: SelectedPlayerSlot) => {
    const newSubs = [...state.substitutes];
    newSubs[index] = updatedSlot;
    setState(prev => ({ ...prev, substitutes: newSubs }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, logoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, referenceImageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const imageUrl = await generateLineupImage(state);
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
    link.download = `nuke-fc-lineup-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormationOptions = () => {
    if (state.mode === '5v5') {
      return ['1-2-1', '2-2', '3-1'];
    } else {
      return ['2-2-1', '2-1-2', '3-2'];
    }
  };

  const getPlayerLabel = (index: number): string => {
    if (index === 0) return 'Goalkeeper';
    const roles = FORMATION_CONFIG[state.formation];
    const role = roles ? roles[index - 1] : `Player ${index}`;
    
    if (!roles) return role;
    
    const roleType = role;
    let count = 0;
    for (let i = 0; i < index; i++) {
        if (i === 0) continue;
        if (roles[i - 1] === roleType) count++;
    }
    
    const totalRoleCount = roles.filter(r => r === roleType).length;
    return totalRoleCount > 1 ? `${roleType} ${count + 1}` : roleType;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* --- LEFT PANEL: Controls --- */}
      <div className="w-full md:w-[400px] lg:w-[480px] bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 flex flex-col z-10 h-screen overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-950/95 z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#D4AF37] mb-4 text-xs font-oswald uppercase tracking-widest transition-colors">
            <IconArrowLeft /> Back to Menu
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-black overflow-hidden">
               {state.logoBase64 ? (
                 <img src={state.logoBase64} alt="Team Logo" className="w-full h-full object-cover" />
               ) : (
                 <IconDragon />
               )}
            </div>
            <div>
              <h1 className="font-teko font-bold text-3xl tracking-wide uppercase text-white">
                Squad <span className="text-[#D4AF37]">Builder</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Official Lineup Generator</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 flex-1 space-y-8 pb-32">
          
          {/* Section: Mode & Formation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Match Format</label>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => toggleMode('5v5')}
                  className={`flex-1 py-2 text-xs font-oswald font-medium uppercase tracking-wider rounded-md transition-all ${
                    state.mode === '5v5' 
                    ? 'bg-[#046A38] text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  5 vs 5
                </button>
                <button 
                  onClick={() => toggleMode('6v6')}
                  className={`flex-1 py-2 text-xs font-oswald font-medium uppercase tracking-wider rounded-md transition-all ${
                    state.mode === '6v6' 
                    ? 'bg-[#046A38] text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  6 vs 6
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Formation</label>
              <div className="relative">
                <select
                  value={state.formation}
                  onChange={(e) => setState(prev => ({ ...prev, formation: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-oswald text-sm tracking-wide focus:border-[#D4AF37] outline-none appearance-none"
                >
                  {getFormationOptions().map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Uploads (Logo + Ref) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Team Crest</label>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 h-full flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded bg-slate-800 border border-slate-600 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {state.logoBase64 ? (
                      <img src={state.logoBase64} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <IconDragon />
                    )}
                  </div>
                  <label className="cursor-pointer text-[10px] font-oswald uppercase tracking-wider text-slate-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                    <IconUpload /> Upload
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
               </div>
            </div>

            <div>
               <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Style Reference</label>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 h-full flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded bg-slate-800 border border-slate-600 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {state.referenceImageBase64 ? (
                      <img src={state.referenceImageBase64} alt="Ref Preview" className="w-full h-full object-cover" />
                    ) : (
                      <IconImage />
                    )}
                  </div>
                  <label className="cursor-pointer text-[10px] font-oswald uppercase tracking-wider text-slate-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                    <IconUpload /> Upload Ref
                    <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
                  </label>
               </div>
            </div>
          </div>

          {/* Section: Roster */}
          <div>
             <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Starting {state.mode === '5v5' ? 'V' : 'VI'}</label>
             <div className="space-y-1">
               {state.slots.map((slot, idx) => (
                 <PlayerSlotInput 
                   key={slot.id} 
                   index={idx} 
                   slot={slot} 
                   label={getPlayerLabel(idx)}
                   onChange={(updated) => updateSlot(idx, updated)} 
                 />
               ))}
             </div>
          </div>

          {/* Section: Substitutes */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold block">Substitutes</label>
              <button 
                onClick={addSubstitute}
                className="flex items-center gap-1 text-[10px] font-oswald uppercase bg-[#046A38] text-white px-2 py-1 rounded hover:bg-[#058444] transition-colors"
              >
                <IconPlus /> Add Sub
              </button>
            </div>
            <div className="space-y-1">
               {state.substitutes.length === 0 ? (
                 <p className="text-[10px] text-slate-600 italic text-center py-4 border border-dashed border-slate-800 rounded">No substitutes added</p>
               ) : (
                 state.substitutes.map((slot, idx) => (
                   <PlayerSlotInput 
                     key={slot.id} 
                     index={idx} 
                     slot={slot} 
                     label={`Substitute ${idx + 1}`}
                     onChange={(updated) => updateSubstitute(idx, updated)} 
                     onRemove={() => removeSubstitute(idx)}
                   />
                 ))
               )}
            </div>
          </div>

          {/* Section: Venue */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3 block">Venue Details</label>
            <input 
              type="text" 
              value={state.venue}
              onChange={(e) => setState(prev => ({ ...prev, venue: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-oswald tracking-wide focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder-slate-600 uppercase"
              placeholder="ENTER STADIUM NAME"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 sticky bottom-0 z-20 mt-auto">
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
              {state.isGenerating ? (
                <>Generating Visuals...</>
              ) : (
                <>
                  <IconSparkles /> Generate Official Graphic
                </>
              )}
            </span>
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]" />
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: Preview --- */}
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
                <p className="font-teko text-xl text-[#D4AF37] tracking-widest uppercase">Constructing Reality...</p>
              </div>
            ) : state.generatedImageUrl ? (
              <img 
                src={state.generatedImageUrl} 
                alt="Generated Squad Lineup" 
                className="w-full h-full object-cover animate-[fadeIn_0.5s_ease-out]"
              />
            ) : (
              <div className="text-center opacity-30">
                <IconDragon />
                <p className="font-teko text-2xl mt-4 uppercase tracking-widest text-slate-400">Preview Awaits</p>
                <p className="font-inter text-xs text-slate-500 mt-1">Configure lineup to initialize</p>
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
