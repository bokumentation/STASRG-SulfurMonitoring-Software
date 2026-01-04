import GasCard from "./GasCard";
import EnvironmentPanel from "./EnvironmentPanel";
import ActionCenter from "./ActionCenter";
import GpsDashboard from "./GpsDashboard";
import DeviceInfoPanel from "./DeviceInfoPanel";
import WindCard from "./WindCard";
import api from "@/lib/api";
import React, { useState, useEffect } from "react";

const DashboardMainContent = () => {

    const [position, setPosition] = useState([-6.973235, 107.632604])
    // 1. Centralized State
    const [sensorData, setSensorData] = useState({
        so2: 0,
        h2s: 0,
        wind_speed: 0,
        wind_dir: 0,
        bus_voltage: 0,
        current_ma: 0,
        battery_pct: 0,
        timestamp: null
    });

    const getWindDirection = (deg) => {
        if (deg >= 337.5 || deg < 22.5) return "N";
        if (deg >= 22.5 && deg < 67.5) return "NE";
        if (deg >= 67.5 && deg < 112.5) return "E";
        if (deg >= 112.5 && deg < 157.5) return "SE";
        if (deg >= 157.5 && deg < 202.5) return "S";
        if (deg >= 202.5 && deg < 247.5) return "SW";
        if (deg >= 247.5 && deg < 292.5) return "W";
        if (deg >= 292.5 && deg < 337.5) return "NW";
        return deg; // Fallback to number
    };

    // 2. Fetching Logic
    useEffect(() => {
        const fetchLiveValues = async () => {
            try {
                const res = await api.get("/sensors");
                // 1. Destructure ALL the fields you need from res.data
                const {
                    so2, h2s, wind_speed, wind_dir,
                    lat, lng, timestamp,
                    bus_voltage, current_ma,
                    temp, humidity
                } = res.data;

                // 2. Update state with the new values
                setSensorData({
                    so2, h2s, wind_speed, wind_dir, timestamp,
                    bus_voltage, current_ma,
                    temp, humidity
                });

                setPosition([lat, lng]);

            } catch (err) {
                console.error("Fetch Error:", err);
            }
        };

        fetchLiveValues(); // Initial fetch
        const interval = setInterval(fetchLiveValues, 2000); // Update every 2 seconds
        return () => clearInterval(interval);
    }, []);

    console.log("DevicePanel received:", sensorData);

    return (
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

            <div className="border border-gray-300 rounded-2xl lg:col-span-4 flex flex-col min-h-0">
                <div className="p-5 flex flex-col justify-between shrink-0">

                    <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        SENSOR DATA
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <GasCard
                            type="SO2"
                            value={sensorData.so2.toFixed(2)}
                            unit="µg/m³"
                            period="Live"
                            status={sensorData.so2 > 50 ? "Danger" : "Normal"}
                        />
                        <GasCard
                            type="H2S"
                            value={sensorData.h2s.toFixed(3)}
                            unit="µg/m³"
                            period="Live"
                            status={sensorData.h2s > 0.1 ? "Caution" : "Normal"}
                        />
                        <GasCard
                            type="WIND SPEED"
                            value={sensorData.wind_speed.toFixed(1)}
                            unit="m/s"
                            period="Live"
                            status="Normal"
                        />
                        <WindCard
                            type="WIND DIRECTION"
                            value={getWindDirection(sensorData.wind_dir)}
                            unit="°"
                            period="Live"
                            status="Normal"
                        />
                    </div>
                </div>

                <div className="card-panel p-5 shrink-0">
                    <EnvironmentPanel sensorData={sensorData} />
                </div>

                <div className="card-panel p-5 shrink-0">
                    <DeviceInfoPanel
                        sensorData={sensorData}
                        position={position}
                    />
                </div>

                <div className="card-panel p-5 shrink-0">
                    <ActionCenter />
                </div>
            </div>

        </div>
    );
};

export default DashboardMainContent;
