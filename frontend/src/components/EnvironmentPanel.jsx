import React from 'react';
import { Thermometer, Droplets, Gauge } from 'lucide-react';

const EnvironmentPanel = () => {
    return (
        <div className="h-full flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                ENVIRONMENT
            </h3>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Thermometer className="w-3 h-3 text-orange-400" /> Temp
                    </div>
                    <div className="text-xl font-bold text-gray-800">25.0°C</div>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                    </div>
                    <div className="text-xl font-bold text-gray-800">84%</div>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Gauge className="w-3 h-3 text-purple-400" /> ATM Pressure
                    </div>
                    <div className="text-xl font-bold text-gray-800">!data</div>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentPanel;
