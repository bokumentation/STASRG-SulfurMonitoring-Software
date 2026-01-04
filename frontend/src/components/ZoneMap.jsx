import React from 'react';

const ZoneMap = () => {
    return (
        <div className="w-full h-full min-h-[500px] flex items-center justify-center relative p-12">
            {/* Central Crater */}
            <div className="absolute z-20 flex flex-col items-center animate-pulse">
                <div className="w-32 h-32 rounded-full bg-red-500/20 backdrop-blur-sm border-2 border-red-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                    <div className="w-24 h-24 rounded-full bg-red-500/30 border border-red-400/60"></div>
                </div>
                <div className="mt-2 text-white font-bold bg-primary-dark/80 px-3 py-1 rounded-full text-xs box-shadow border border-white/10">Kawah Putih Crater</div>
            </div>

            {/* Danger Zones (Yellow) */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-12 z-10">
                <div className="w-64 h-64 rounded-full bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-[1px] -ml-20"></div>
            </div>
            <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-12 z-10">
                <div className="w-64 h-64 rounded-full bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-[1px] ml-20"></div>
            </div>

            {/* Safe Zones (Green) */}
            <div className="absolute bottom-1/4 left-1/4 translate-y-12 z-0">
                <div className="w-72 h-72 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-[2px]"></div>
                <div className="text-accent/60 text-xs font-mono absolute bottom-12 left-12">SW Zone</div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 translate-y-12 z-0">
                <div className="w-72 h-72 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-[2px]"></div>
                <div className="text-accent/60 text-xs font-mono absolute bottom-12 right-12">SE Zone</div>
            </div>

            {/* Grid Lines / Radar Lines */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal */}
                <div className="absolute top-1/2 w-full h-px border-t border-dashed border-white/20"></div>
                {/* Diagonals */}
                <div className="absolute top-1/2 left-1/2 w-full h-px border-t border-dashed border-white/20 -translate-x-1/2 rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-px border-t border-dashed border-white/20 -translate-x-1/2 -rotate-45"></div>
            </div>

            <div className="absolute top-1/2 left-1/3 text-xs text-gray-400 font-mono -mt-6">NW Zone</div>
            <div className="absolute top-1/2 right-1/3 text-xs text-gray-400 font-mono -mt-6">NE Zone</div>
        </div>
    );
};

export default ZoneMap;
