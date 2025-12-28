
import React from 'react';
import { Player, SelectedPlayerSlot, ROSTER_PLAYERS } from '../types';

interface Props {
  index: number;
  slot: SelectedPlayerSlot;
  label: string;
  onChange: (updatedSlot: SelectedPlayerSlot) => void;
  onRemove?: () => void;
}

export const PlayerSlotInput: React.FC<Props> = ({ index, slot, label, onChange, onRemove }) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as 'roster' | 'custom';
    onChange({ ...slot, playerType: newType });
  };

  const handleRosterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...slot, rosterId: e.target.value });
  };

  const handleCustomChange = (field: 'customName' | 'customNumber', value: string) => {
    onChange({ ...slot, [field]: value });
  };

  return (
    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors mb-3">
      <div className="flex justify-between items-center mb-2">
        <label className="text-emerald-500 font-teko font-semibold tracking-wider text-sm uppercase">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <select
            value={slot.playerType}
            onChange={handleTypeChange}
            className="bg-slate-950 text-xs text-slate-400 border border-slate-800 rounded px-2 py-1 outline-none focus:border-[#D4AF37]"
          >
            <option value="roster">Roster</option>
            <option value="custom">Custom</option>
          </select>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-slate-600 hover:text-red-500 transition-colors"
              title="Remove Slot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {slot.playerType === 'roster' ? (
        <select
          value={slot.rosterId || ''}
          onChange={handleRosterSelect}
          className="w-full bg-slate-800 text-white font-oswald text-sm border border-slate-700 rounded px-3 py-2 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
        >
          <option value="" disabled>Select Player</option>
          {ROSTER_PLAYERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.number} - {p.name}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="NAME"
            value={slot.customName || ''}
            onChange={(e) => handleCustomChange('customName', e.target.value)}
            className="flex-1 bg-slate-800 text-white font-oswald text-sm border border-slate-700 rounded px-3 py-2 outline-none focus:border-[#D4AF37] uppercase placeholder-slate-500"
          />
          <input
            type="text"
            placeholder="#"
            maxLength={3}
            value={slot.customNumber || ''}
            onChange={(e) => handleCustomChange('customNumber', e.target.value)}
            className="w-16 bg-slate-800 text-white font-teko text-lg border border-slate-700 rounded px-3 py-2 outline-none focus:border-[#D4AF37] text-center placeholder-slate-500"
          />
        </div>
      )}
    </div>
  );
};
