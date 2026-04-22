import GasCard from "../GasCard";
import EnvironmentPanel from "../EnvironmentPanel";
import DeviceInfoPanel from "../DeviceInfoPanel";
import WindCard from "../WindCard";
import React, { useState, useEffect, useCallback } from "react";

// ─── Sensor node definitions ────────────────────────────────────────────────
const SENSOR_NODES = [
    { id: 1, label: "1", lat: -7.166870, lng: 107.401387 },
    { id: 2, label: "2", lat: -7.167397, lng: 107.401775 },
    { id: 3, label: "3", lat: -7.167415, lng: 107.402914 },
    { id: 4, label: "4", lat: -7.166614, lng: 107.403483 },
    { id: 5, label: "5", lat: -7.166418, lng: 107.404100 },
    { id: 6, label: "6", lat: -7.166833, lng: 107.404111 },
    { id: "r", label: "R", lat: -7.167099, lng: 107.404272 },
];

// ─── Dummy data generator (per node) ────────────────────────────────────────
function generateDummySensorData() {
    return {
        so2: +(Math.random() * 40 + 5).toFixed(2),
        h2s: +(Math.random() * 30 + 2).toFixed(3),
        wind_speed: +(Math.random() * 10 + 0.5).toFixed(1),
        wind_dir: +(Math.random() * 360).toFixed(0),
        bus_voltage: +(Math.random() * 1.5 + 3.0).toFixed(2),
        current_ma: +(Math.random() * 200 + 50).toFixed(1),
        temp: +(Math.random() * 8 + 22).toFixed(1),
        humidity: +(Math.random() * 30 + 50).toFixed(1),
        timestamp: new Date().toISOString(),
    };
}

function generateAllNodesDummyData() {
    const data = {};
    SENSOR_NODES.forEach((node) => {
        data[node.id] = generateDummySensorData();
    });
    return data;
}

// ─── Wind direction helper ──────────────────────────────────────────────────
const getWindDirection = (deg) => {
    const d = Number(deg);
    if (d >= 337.5 || d < 22.5) return "N";
    if (d >= 22.5 && d < 67.5) return "NE";
    if (d >= 67.5 && d < 112.5) return "E";
    if (d >= 112.5 && d < 157.5) return "SE";
    if (d >= 157.5 && d < 202.5) return "S";
    if (d >= 202.5 && d < 247.5) return "SW";
    if (d >= 247.5 && d < 292.5) return "W";
    if (d >= 292.5 && d < 337.5) return "NW";
    return d;
};

// ─── Main page ──────────────────────────────────────────────────────────────
const SensorsPage = () => {
    const [dataSource, setDataSource] = useState("dummy"); // "dummy" | "live"
    const [nodesData, setNodesData] = useState(generateAllNodesDummyData);

    // ── Dummy: refresh every 3 seconds ───────────────────────────────────
    useEffect(() => {
        if (dataSource !== "dummy") return;

        // Set initial data immediately
        setNodesData(generateAllNodesDummyData());

        const interval = setInterval(() => {
            setNodesData(generateAllNodesDummyData());
        }, 3000);

        return () => clearInterval(interval);
    }, [dataSource]);

    // ── Live: WebSocket streaming ────────────────────────────────────────
    useEffect(() => {
        if (dataSource !== "live") return;

        const ws = new WebSocket("ws://127.0.0.1:8000/api/ws/sensors");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("SensorsPage WS data:", data);

            // If backend sends per-node data with a node_id field:
            const nodeId = data.node_id || 1;
            setNodesData((prev) => ({
                ...prev,
                [nodeId]: {
                    so2: data.so2 || 0,
                    h2s: data.h2s || 0,
                    wind_speed: data.wind_speed || 0,
                    wind_dir: data.wind_dir || 0,
                    bus_voltage: data.bus_voltage || 0,
                    current_ma: data.current_ma || 0,
                    temp: data.temp || 0,
                    humidity: data.humidity || 0,
                    timestamp: data.timestamp,
                },
            }));
        };

        ws.onerror = (err) => console.error("SensorsPage WS Error:", err);
        ws.onclose = () => console.log("SensorsPage WS Closed");

        return () => ws.close();
    }, [dataSource]);

    return (
        <div className="space-y-6 pb-6">
            {/* Page header with controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sensor Nodes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time monitoring across {SENSOR_NODES.length} stations
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Data source toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">
                            Source
                        </span>
                        <button
                            onClick={() => setDataSource("dummy")}
                            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                                dataSource === "dummy"
                                    ? "bg-white shadow text-gray-800"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            Dummy
                        </button>
                        <button
                            onClick={() => setDataSource("live")}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                                dataSource === "live"
                                    ? "bg-red-500 text-white shadow"
                                    : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    dataSource === "live" ? "bg-white animate-pulse" : "bg-gray-400"
                                }`}
                            />
                            Live
                        </button>
                    </div>
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{SENSOR_NODES.length} nodes</span>
                <span>•</span>
                <span>
                    {dataSource === "live"
                        ? "Streaming live data via WebSocket"
                        : "Using generated dummy data (refreshing every 3s)"}
                </span>
            </div>

            {/* Sensor node cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {SENSOR_NODES.map((node) => {
                    const data = nodesData[node.id] || generateDummySensorData();
                    return (
                        <div
                            key={node.id}
                            className="border border-gray-300 rounded-2xl flex flex-col min-h-0"
                        >
                            <div className="p-5 flex flex-col justify-between shrink-0">
                                <h2 className="text-xl text-center font-bold text-gray-800 mb-3 items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                                    SENSOR NODE {node.label}
                                </h2>
                                <p className="text-xs text-center text-gray-500 mb-4 font-mono">
                                    {node.lat.toFixed(6)}°S, {node.lng.toFixed(6)}°E
                                </p>
                                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                                    SENSOR DATA
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <GasCard
                                        type="SO2"
                                        value={Number(data.so2).toFixed(2)}
                                        unit="µg/m³"
                                        period={dataSource === "live" ? "Live" : "Dummy"}
                                        status={data.so2 > 50 ? "Danger" : "Normal"}
                                    />
                                    <GasCard
                                        type="H2S"
                                        value={Number(data.h2s).toFixed(3)}
                                        unit="µg/m³"
                                        period={dataSource === "live" ? "Live" : "Dummy"}
                                        status={data.h2s > 50 ? "Caution" : "Normal"}
                                    />
                                    <GasCard
                                        type="WIND SPEED"
                                        value={Number(data.wind_speed).toFixed(1)}
                                        unit="m/s"
                                        period={dataSource === "live" ? "Live" : "Dummy"}
                                        status="Normal"
                                    />
                                    <WindCard
                                        type="WIND DIRECTION"
                                        value={getWindDirection(data.wind_dir)}
                                        unit="°"
                                        period={dataSource === "live" ? "Live" : "Dummy"}
                                        status="Normal"
                                    />
                                </div>
                            </div>

                            <div className="card-panel p-5 shrink-0">
                                <EnvironmentPanel sensorData={data} />
                            </div>

                            <div className="card-panel p-5 shrink-0">
                                <DeviceInfoPanel
                                    sensorData={data}
                                    position={[node.lat, node.lng]}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SensorsPage;
