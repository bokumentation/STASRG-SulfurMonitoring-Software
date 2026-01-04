import React, { useState } from "react";
import Header from "./Header";
import GasCard from "./GasCard";
import EnvironmentPanel from "./EnvironmentPanel";
import ActionCenter from "./ActionCenter";
import GpsDashboard from "./GpsDashboard";
import DeviceInfoPanel from "./DeviceInfoPanel";
import WindCard from "./WindCard";

const DashboardLayout = () => {
    // Initial position [Latitude, Longitude]
    const [position, setPosition] = useState([-6.973235, 107.632604]); // Default: Jakarta
    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                <div className="lg:col-span-8 flex flex-col relative card-panel overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-125 lg:min-h-0">
                    <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-500 shadow-sm">
                        {position[0].toFixed(4)}°{position[0] >= 0 ? "N" : "S"},{" "}
                        {position[1].toFixed(4)}°{position[1] >= 0 ? "E" : "W"}
                    </div>

                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 min-w-40">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-100 pb-2">
                            Concentration
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                                Safe
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
                                Caution
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>{" "}
                                Danger
                            </div>
                            <div className="my-2 border-t border-dashed border-gray-200"></div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-4 h-0.5 bg-gray-400"></span>{" "}
                                Evacuation
                            </div>
                        </div>
                    </div>

                    <GpsDashboard
                        position={position}
                        setPosition={setPosition}
                    />
                </div>

                {/* Right Side Panel */}
                <div className="border border-gray-300 rounded-2xl lg:col-span-4 flex flex-col min-h-0">
                    <div className="p-5 flex flex-col justify-between shrink-0">

                        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            SENSOR DATA
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
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
                                unit="µg/m³"
                                period="30-min"
                                status="Normal"
                            />
                            <GasCard
                                type="WIND SPEED"
                                value={0.008}
                                unit="m/s"
                                period="30-min"
                                status="Normal"
                            />
                            <WindCard
                                type="WIND DIRECTION"
                                value={0.008}
                                unit="m/s"
                                period="30-min"
                                status="Normal"
                            />
                        </div>
                    </div>

                    <div className="card-panel p-5 shrink-0">
                        <EnvironmentPanel />
                    </div>

                    <div className="card-panel p-5 shrink-0">
                        <DeviceInfoPanel       position={position}
                        setPosition={setPosition}/>
                    </div>

                    <div className="card-panel p-5 shrink-0">
                        <ActionCenter />
                    </div>

                    {/* <div className="card-panel p-5 flex-1 min-h-0 overflow-hidden flex flex-col bg-red-50/50 border-red-100">
                        <ActionCenter />
                    </div> */}


                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
