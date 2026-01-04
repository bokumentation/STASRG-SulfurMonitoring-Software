import React from 'react';
import { BatteryCharging, Battery, Droplets, LocateFixed, Thermometer } from 'lucide-react';

const DeviceInfoPanel = ({ position, setPosition }) => {
    // const [position, setPosition] = useState([-6.973235, 107.632604])

    return (
        <div className="h-full flex flex-col justify-center">

            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                DEVICE INFORMATION
            </h2>

            <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Battery className="w-3 h-3 text-blue-400" />Battery Voltage
                    </div>
                    <div className="text-xl font-bold text-gray-800">84%</div>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <BatteryCharging className="w-3 h-3 text-orange-400" />Current
                    </div>
                    <div className="text-xl font-bold text-gray-800">25.0°C</div>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Thermometer className="w-3 h-3 text-blue-400" /> Temp
                    </div>
                    <div className="text-xl font-bold text-gray-800">!data</div>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                    </div>
                    <div className="text-xl font-bold text-gray-800">!data</div>
                </div>


            </div>
            <div className="mt-2 flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 mb-1">
                    <LocateFixed className="w-3 h-3 text-blue-400" /> GPS LOCATION
                </div>
                <div className="font-mono text-gray-800">
                    {position[0].toFixed(4)}°{position[0] >= 0 ? "N" : "S"},{" "}
                    {position[1].toFixed(4)}°{position[1] >= 0 ? "E" : "W"} </div>
            </div>
        </div>
    );
};

export default DeviceInfoPanel;
