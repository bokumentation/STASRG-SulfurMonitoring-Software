import React, { useState, useEffect } from 'react';
import { Volume2, Radio, Bell, AlertTriangle } from 'lucide-react';
import BroadcastModal from './BroadcastModal';

const ActionCenter = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [logs, setLogs] = useState([
        {
            id: 1,
            message: 'Emergency broadcast initiated',
            detail: 'Operator 1 • Just now',
            time: new Date().toLocaleTimeString(),
            type: 'alert'
        },
        {
            id: 2,
            message: 'Emergency broadcast initiated',
            detail: '14:02 PM',
            time: '14:02',
            type: 'info'
        }
    ]);

    const handleConfirmBroadcast = (level) => {
        setIsModalOpen(false);
        setCountdown(3);

        // Countdown logic
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Add log after countdown
                    const newLog = {
                        id: Date.now(),
                        message: `BROADCAST: ${level.label} - Level ${level.id}`,
                        detail: `Sent to: ${level.target}`,
                        time: new Date().toLocaleTimeString(),
                        type: 'alert',
                        isNew: true
                    };
                    setLogs(prevLogs => [newLog, ...prevLogs]);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <>
            <div className="flex flex-col h-full min-h-0 relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                        ACTION CENTER
                    </h2>
                    <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Live
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-red-500 hover:bg-red-600 transition-all active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-3 mb-4 group shrink-0"
                >
                    <Radio className="w-4 h-4 animate-pulse" />
                    BROADCAST ALERT
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 mb-4 pr-1">
                    <div className="space-y-2">
                        {logs.map((log) => (
                            <div
                                key={log.id}
                                className={`
                       border-l-2 p-3 rounded-r-lg shadow-sm transition-all
                       ${log.type === 'alert' ? 'bg-white border-red-500' : 'bg-white border-gray-200 opacity-75'}
                       ${log.isNew ? 'animate-in slide-in-from-right duration-500' : ''}
                    `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-full ${log.type === 'alert' ? 'bg-red-50' : 'bg-gray-50'}`}>
                                        <Volume2 className={`w-3.5 h-3.5 ${log.type === 'alert' ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold leading-tight ${log.type === 'alert' ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {log.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                            {log.detail}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 shrink-0">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Bell className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-bold text-emerald-800 mb-0.5">Recommendation</h4>
                            <p className="text-xs text-emerald-700/80 leading-relaxed">
                                Monitor wind direction. SE winds favorable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BroadcastModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmBroadcast}
            />

            {/* Full Screen Countdown Overlay */}
            {countdown !== null && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-red-600 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 to-red-700"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-red-200 text-xl font-bold uppercase tracking-[0.5em] mb-8 animate-pulse">Broadcasting in</p>
                        <div className="text-[12rem] font-black text-white leading-none tabular-nums animate-bounce">
                            {countdown}
                        </div>
                        <div className="mt-12 flex items-center gap-4 px-6 py-3 bg-black/20 rounded-full backdrop-blur-sm">
                            <Radio className="w-6 h-6 text-white animate-ping" />
                            <span className="text-white font-mono font-medium">Transmitting Signal to Zone A...</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionCenter;
