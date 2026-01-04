import React, { useState } from 'react';
import { AlertTriangle, X, Radio, ShieldAlert } from 'lucide-react';

const ALERT_LEVELS = [
    {
        id: 1,
        label: 'CAUTION',
        color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        indicator: 'bg-yellow-500',
        status: 'Mild Disturbance / Odor Begins to Be Smelled (H2s > 0.005 ppm)',
        target: 'Officers Only (Internal)',
        message: "Officers at Post 2, please check the location. Sensors detect a slight increase in gas levels. Monitor wind direction."
    },
    {
        id: 2,
        label: 'WARNING',
        color: 'bg-orange-100 border-orange-300 text-orange-800',
        indicator: 'bg-orange-500',
        status: 'Harmful to Health (SO2 > 200 ug/m3)',
        target: 'Field Officers & Visitors',
        message: "Restrict access to the eastern crater rim. Officers MUST wear masks. Direct visitors away from the smoke."
    },
    {
        id: 3,
        label: 'DANGER',
        color: 'bg-red-100 border-red-300 text-red-800',
        indicator: 'bg-red-600',
        status: 'Toxic & Deadly (SO2 > 500 ug/m3 or H2S > 1 ppm)',
        target: 'EVERYONE (Mass Evacuation)',
        message: "DANGER! EVACUATE IMMEDIATELY to Muster Point Selatan. Close all entrances. Wear full PPE!"
    }
];

const BroadcastModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);

    if (!isOpen) return null;

    const activeLevel = ALERT_LEVELS.find(l => l.id === selectedLevel);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start gap-4">
                    <div className="p-3 bg-red-50 rounded-full shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">Initiate Emergency Broadcast</h2>
                        <p className="text-gray-500 mt-1">
                            This action will trigger sirens in Zone A and send broadcasts to the target audience.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Level Selection */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Select Alert Level:</p>
                        <div className="space-y-3">
                            {ALERT_LEVELS.map((level) => (
                                <div
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`
                        relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedLevel === level.id
                                            ? `border-${level.indicator.split('-')[1]}-500 bg-white shadow-md`
                                            : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                        }
                      `}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                          ${selectedLevel === level.id ? 'border-current' : 'border-gray-300'}
                       `}>
                                        {selectedLevel === level.id && (
                                            <div className={`w-2.5 h-2.5 rounded-full ${level.indicator}`} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider ${level.color}`}>
                                                {level.label}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">
                                                Level {level.id}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">{level.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Preview Message</p>
                        <div className="flex gap-3">
                            <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">"{activeLevel.message}"</p>
                                <p className="text-xs text-gray-500 mt-2">Target: <span className="font-semibold">{activeLevel.target}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(activeLevel)}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 flex items-center gap-2 transition-transform active:scale-95"
                    >
                        <Radio className="w-4 h-4 animate-pulse" />
                        CONFIRM & BROADCAST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BroadcastModal;
