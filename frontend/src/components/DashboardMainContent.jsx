import GasCard from "./GasCard";
import EnvironmentPanel from "./EnvironmentPanel";
import ActionCenter from "./ActionCenter";
import GpsDashboard from "./GpsDashboard";
import DeviceInfoPanel from "./DeviceInfoPanel";
import WindCard from "./WindCard";
import api from "../lib/api";
import React, { useState, useEffect, useCallback } from "react";

// ─── Sensor node definitions (shared with SensorsPage) ─────────────────────
const SENSOR_NODES = [
    { id: 1, label: "1", lat: -7.166870, lng: 107.401387 },
    { id: 2, label: "2", lat: -7.167397, lng: 107.401775 },
    { id: 3, label: "3", lat: -7.167415, lng: 107.402914 },
    { id: 4, label: "4", lat: -7.166614, lng: 107.403483 },
    { id: 5, label: "5", lat: -7.166418, lng: 107.404100 },
    { id: 6, label: "6", lat: -7.166833, lng: 107.404111 },
    { id: "r", label: "R", lat: -7.167099, lng: 107.404272 },
];

// ─── Dummy data generator ───────────────────────────────────────────────────
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

// ─── Main component ─────────────────────────────────────────────────────────
const DashboardMainContent = () => {
    const [selectedNode, setSelectedNode] = useState(SENSOR_NODES[0]);
    const [dataSource, setDataSource] = useState("dummy"); // "dummy" | "live"
    const [nodesData, setNodesData] = useState(generateAllNodesDummyData);

    // ── Dummy: refresh every 3 seconds ───────────────────────────────────
    useEffect(() => {
        if (dataSource !== "dummy") return;
        setNodesData(generateAllNodesDummyData());
        const interval = setInterval(() => {
            setNodesData(generateAllNodesDummyData());
        }, 3000);
        return () => clearInterval(interval);
    }, [dataSource]);

    // ── Live: WebSocket ──────────────────────────────────────────────────
    useEffect(() => {
        if (dataSource !== "live") return;
        const ws = new WebSocket("ws://127.0.0.1:8000/api/ws/sensors");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
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

        ws.onerror = (err) => console.error("WebSocket Error:", err);
        ws.onclose = () => console.log("WebSocket Connection Closed");
        return () => ws.close();
    }, [dataSource]);

    // Currently selected node's data
    const sensorData = nodesData[selectedNode.id] || {
        so2: 0, h2s: 0, wind_speed: 0, wind_dir: 0,
        bus_voltage: 0, current_ma: 0, temp: 0, humidity: 0, timestamp: null,
    };
    const position = [selectedNode.lat, selectedNode.lng];

    const handleNodeSelect = useCallback((nodeId) => {
        const node = SENSOR_NODES.find((n) => String(n.id) === String(nodeId));
        if (node) setSelectedNode(node);
    }, []);

    return (
        <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
            <div className="lg:col-span-8 flex flex-col relative card-panel overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-125 lg:min-h-0">

                <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-500 shadow-sm">
                    {selectedNode.lat.toFixed(4)}°{selectedNode.lat >= 0 ? "N" : "S"},{" "}
                    {selectedNode.lng.toFixed(4)}°{selectedNode.lng >= 0 ? "E" : "W"}
                </div>

                {/* Data source toggle */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/80 backdrop-blur rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">
                        Source
                    </span>
                    <button
                        onClick={() => setDataSource("dummy")}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded transition-all ${
                            dataSource === "dummy"
                                ? "bg-gray-800 text-white shadow"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        Dummy
                    </button>
                    <button
                        onClick={() => setDataSource("live")}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                            dataSource === "live"
                                ? "bg-red-500 text-white shadow"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {dataSource === "live" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                        Live
                    </button>
                </div>

                <GpsDashboard
                    nodesData={nodesData}
                    sensorNodes={SENSOR_NODES}
                    selectedNodeId={selectedNode.id}
                    onNodeSelect={handleNodeSelect}
                />
            </div>

            <div className="border border-gray-300 rounded-2xl lg:col-span-4 flex flex-col min-h-0">
                <div className="p-5 flex flex-col justify-between shrink-0">

                    {/* Node selector header */}
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            NODE {selectedNode.label} DATA
                        </h2>
                        <select
                            value={selectedNode.id}
                            onChange={(e) => handleNodeSelect(e.target.value)}
                            className="text-xs font-medium bg-gray-100 rounded-md px-2 py-1 border-none outline-none cursor-pointer text-gray-700"
                        >
                            {SENSOR_NODES.map((n) => (
                                <option key={n.id} value={n.id}>
                                    Node {n.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <GasCard
                            type="SO2"
                            value={Number(sensorData.so2).toFixed(2)}
                            unit="µg/m³"
                            period={dataSource === "live" ? "Live" : "Dummy"}
                            status={sensorData.so2 > 50 ? "Danger" : "Normal"}
                        />
                        <GasCard
                            type="H2S"
                            value={Number(sensorData.h2s).toFixed(3)}
                            unit="µg/m³"
                            period={dataSource === "live" ? "Live" : "Dummy"}
                            status={sensorData.h2s > 50 ? "Caution" : "Normal"}
                        />
                        <GasCard
                            type="WIND SPEED"
                            value={Number(sensorData.wind_speed).toFixed(1)}
                            unit="m/s"
                            period={dataSource === "live" ? "Live" : "Dummy"}
                            status="Normal"
                        />
                        <WindCard
                            type="WIND DIRECTION"
                            value={getWindDirection(sensorData.wind_dir)}
                            unit="°"
                            period={dataSource === "live" ? "Live" : "Dummy"}
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
