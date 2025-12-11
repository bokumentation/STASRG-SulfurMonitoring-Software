import React from 'react';
import Header from './Header';
import ZoneMap from './ZoneMap';
import GasCard from './GasCard';
import EnvironmentPanel from './EnvironmentPanel';
import ActionCenter from './ActionCenter';
import WindWidget from './WindWidget';

const DashboardLayout = () => {
    return (
        <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
            <Header />

            <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                {/* Main Visualization Area */}
                <div className="lg:col-span-8 flex flex-col relative card-panel overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[500px] lg:min-h-0">
                    <div className="absolute inset-0 bg-surface"></div>
                    {/* Map Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(#0F392B 1px, transparent 1px), linear-gradient(90deg, #0F392B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                    </div>

                    <ZoneMap />

                    <div className="absolute bottom-4 left-4 z-10 scale-90 origin-bottom-left">
                        <WindWidget />
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-500 shadow-sm">
                        7.1661°S, 107.4026°E
                    </div>

                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 min-w-[160px]">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-100 pb-2">Concentration</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Caution
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Danger
                            </div>
                            <div className="my-2 border-t border-dashed border-gray-200"></div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-4 h-0.5 bg-gray-400"></span> Evacuation
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
                    <div className="card-panel p-5 flex flex-col justify-between shrink-0">
                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            LIVE DATA
                        </h2>
                        <div className="space-y-3">
                            <GasCard
                                type="SO2"
                                value={27.2}
                                unit="µg/m³"
                                period="10-min"
                                status="Normal"
                            />
                            <GasCard
                                type="H2S"
                                value={0.008}
                                unit="ppm"
                                period="30-min"
                                status="Normal"
                            />
                        </div>
                    </div>

                    <div className="card-panel p-5 shrink-0">
                        <EnvironmentPanel />
                    </div>

                    <div className="card-panel p-5 flex-1 min-h-0 overflow-hidden flex flex-col bg-red-50/50 border-red-100">
                        <ActionCenter />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
