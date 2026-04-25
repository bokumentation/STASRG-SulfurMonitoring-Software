# Diagram Blok Sistem — STASRG Sulfur Monitoring Software

## 1. Arsitektur Keseluruhan Sistem

```mermaid
graph TB
    subgraph HW["🔧 HARDWARE LAYER"]
        ESP["ESP32 Microcontroller"]
        SO2_SENS["Sensor SO₂"]
        H2S_SENS["Sensor H₂S"]
        TEMP_SENS["Sensor Suhu & Kelembapan"]
        WIND_SENS["Sensor Kecepatan Angin"]
        INA_SENS["INA219 (Tegangan & Arus)"]
        GPS_MOD["Modul GPS"]
    end

    subgraph BACKEND["⚙️ BACKEND (FastAPI - Python)"]
        SERIAL["Serial Monitor\n(serialMonitor.py)"]
        API["REST API\n(api.py)"]
        WS["WebSocket Server\n/ws/sensors"]
        ML["ML Service\n(ml_service.py)"]
        MODELS["XGBoost Models\nnode_1..6_xgb.pkl"]
    end

    subgraph FRONTEND["🖥️ FRONTEND (React + Vite)"]
        APP["App.jsx"]
        SIDEBAR["AppSidebar"]
        LAYOUT["DashboardLayout"]

        subgraph PAGES["📄 Halaman"]
            OVERVIEW["Overview\n(DashboardMainContent)"]
            SENSORS["Sensors\n(SensorsPage)"]
            LOGS["History/Logs\n(LogsPage)"]
            SETTINGS["Settings\n(SettingsPage)"]
        end

        subgraph COMPONENTS["🧩 Komponen"]
            GPS_DASH["GpsDashboard\n(OpenStreetMap + Leaflet)"]
            GAS_CARD["GasCard"]
            WIND_CARD["WindCard"]
            ENV_PANEL["EnvironmentPanel"]
            DEV_PANEL["DeviceInfoPanel"]
            ACTION["ActionCenter"]
            CHARTS["Recharts\n(Time-Series Charts)"]
        end
    end

    %% Hardware → Backend
    SO2_SENS --> ESP
    H2S_SENS --> ESP
    TEMP_SENS --> ESP
    WIND_SENS --> ESP
    INA_SENS --> ESP
    GPS_MOD --> ESP
    ESP -- "Serial USB\n(115200 baud)" --> SERIAL

    %% Backend internal
    SERIAL -- "Parse CSV\n7 fields" --> WS
    SERIAL --> API
    ML --> MODELS
    API --> ML

    %% Backend → Frontend
    WS -- "Real-time\nJSON stream" --> OVERVIEW
    WS -- "Real-time\nJSON stream" --> SENSORS
    WS -- "Live mode" --> LOGS
    API -- "REST /api/predict/{id}" --> LOGS
    API -- "REST /api/logs" --> LOGS
    API -- "REST /api/status" --> SIDEBAR

    %% Frontend internal
    APP --> LAYOUT
    LAYOUT --> SIDEBAR
    LAYOUT --> OVERVIEW
    LAYOUT --> SENSORS
    LAYOUT --> LOGS
    LAYOUT --> SETTINGS
    OVERVIEW --> GPS_DASH
    OVERVIEW --> GAS_CARD
    OVERVIEW --> WIND_CARD
    OVERVIEW --> ENV_PANEL
    OVERVIEW --> DEV_PANEL
    OVERVIEW --> ACTION
    LOGS --> CHARTS

    style HW fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style BACKEND fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px
    style FRONTEND fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style PAGES fill:#e0f2fe,stroke:#0ea5e9,stroke-width:1px
    style COMPONENTS fill:#f0fdf4,stroke:#22c55e,stroke-width:1px
```

---

## 2. Alur Data (Data Flow)

```mermaid
sequenceDiagram
    participant S as Sensor Nodes (1-6, R)
    participant E as ESP32
    participant B as Backend (FastAPI)
    participant ML as ML Service
    participant F as Frontend (React)
    participant U as User

    Note over S,E: 7 Sensor Nodes di Lapangan

    S->>E: Data analog/digital
    E->>B: Serial USB (CSV: so2,h2s,temp,hum,wind,volt,curr)
    B->>B: Parse & broadcast via WebSocket

    alt Mode Live
        B-->>F: WebSocket /ws/sensors (JSON real-time)
        F->>U: Update dashboard cards & map markers
    end

    alt Mode Dummy
        F->>F: Generate random data per node (setiap 3 detik)
        F->>U: Update dashboard cards & map markers
    end

    U->>F: Klik marker di peta / pilih node dari dropdown
    F->>F: Update side panel dengan data node yang dipilih

    U->>F: Klik "Predict" di LogsPage
    F->>B: GET /api/predict/{node_id}?h2s=...&so2=...&hum=...&temp=...
    B->>ML: build_features() → 11 input features
    ML->>ML: XGBoost model.predict()
    ML-->>B: {h2s: predicted, so2: predicted}
    B-->>F: JSON prediction result
    F->>U: Tampilkan predicted H₂S & SO₂ + horizon di chart

    U->>F: Klik "Export CSV"
    F->>F: Convert logsData → CSV blob
    F->>U: Download file .csv
```

---

## 3. Struktur File Proyek

```
STASRG-SulfurMonitoring-Software/
│
├── backend/                          # ⚙️ FastAPI Backend
│   ├── main.py                       # Entry point, lifespan, CORS
│   ├── requirements.txt              # Dependencies
│   ├── models/                       # 🤖 ML Models
│   │   ├── node_1_xgb.pkl
│   │   ├── node_2_xgb.pkl
│   │   ├── node_3_xgb.pkl
│   │   ├── node_4_xgb.pkl
│   │   ├── node_5_xgb.pkl
│   │   └── node_6_xgb.pkl
│   └── app/
│       ├── __init__.py
│       ├── api.py                    # REST + WebSocket endpoints
│       ├── ml_service.py             # Model loading & prediction
│       └── serialMonitor.py          # Serial port reader (standalone)
│
├── frontend/                         # 🖥️ React Frontend
│   └── src/
│       ├── App.jsx                   # Root component
│       ├── lib/
│       │   └── api.js                # Axios instance (base: /api)
│       └── components/
│           ├── DashboardLayout.jsx    # Layout + routing
│           ├── DashboardMainContent.jsx  # Overview page
│           ├── AppSidebar.jsx         # Navigation sidebar
│           ├── GpsDashboard.jsx       # OpenStreetMap + Leaflet
│           ├── GasCard.jsx            # SO₂/H₂S value cards
│           ├── WindCard.jsx           # Wind direction card
│           ├── EnvironmentPanel.jsx   # Temp & humidity panel
│           ├── DeviceInfoPanel.jsx    # Device info display
│           ├── ActionCenter.jsx       # Action buttons
│           └── pages/
│               ├── SensorsPage.jsx    # 7-node sensor grid
│               ├── LogsPage.jsx       # Charts + ML prediction
│               └── SettingsPage.jsx   # Settings
│
└── src/                              # 📊 ML Training (notebooks)
```

---

## 4. Detail ML Pipeline

```mermaid
graph LR
    subgraph INPUT["📥 Input Features (11)"]
        direction TB
        I1["h2s"]
        I2["so2"]
        I3["hum"]
        I4["temp"]
        I5["windspeed"]
        I6["hour ⏰"]
        I7["minute ⏰"]
        I8["minute_of_day ⏰"]
        I9["h2s_diff Δ"]
        I10["so2_diff Δ"]
        I11["gas_ratio_so2_h2s ÷"]
    end

    subgraph DERIVED["🔧 Derived (auto-computed)"]
        D1["hour = timestamp.hour"]
        D2["minute = timestamp.minute"]
        D3["minute_of_day = h*60+m"]
        D4["h2s_diff = h2s - h2s_prev"]
        D5["so2_diff = so2 - so2_prev"]
        D6["gas_ratio = so2 / h2s"]
    end

    subgraph MODEL["🤖 XGBoost Model"]
        M1["node_1_xgb.pkl"]
        M2["node_2_xgb.pkl"]
        M3["node_3_xgb.pkl"]
        M4["node_4_xgb.pkl"]
        M5["node_5_xgb.pkl"]
        M6["node_6_xgb.pkl"]
    end

    subgraph OUTPUT["📤 Output (2)"]
        O1["predicted H₂S\n(µg/m³)"]
        O2["predicted SO₂\n(µg/m³)"]
    end

    I1 & I2 & I3 & I4 & I5 --> MODEL
    DERIVED --> I6 & I7 & I8 & I9 & I10 & I11
    I6 & I7 & I8 & I9 & I10 & I11 --> MODEL
    MODEL --> O1 & O2

    style INPUT fill:#dbeafe,stroke:#3b82f6
    style DERIVED fill:#fef3c7,stroke:#f59e0b
    style MODEL fill:#ede9fe,stroke:#8b5cf6
    style OUTPUT fill:#dcfce7,stroke:#22c55e
```

---

## 5. Sensor Nodes — Lokasi Geografis

| Node | Latitude | Longitude | ML Model |
|------|----------|-----------|----------|
| Node 1 | -7.166870 | 107.401387 | ✅ `node_1_xgb.pkl` |
| Node 2 | -7.167397 | 107.401775 | ✅ `node_2_xgb.pkl` |
| Node 3 | -7.167415 | 107.402914 | ✅ `node_3_xgb.pkl` |
| Node 4 | -7.166614 | 107.403483 | ✅ `node_4_xgb.pkl` |
| Node 5 | -7.166418 | 107.404100 | ✅ `node_5_xgb.pkl` |
| Node 6 | -7.166833 | 107.404111 | ✅ `node_6_xgb.pkl` |
| Node R | -7.167099 | 107.404272 | ❌ Tidak ada model |

---

## 6. API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/status` | Cek status backend & koneksi serial |
| `WS` | `/api/ws/sensors` | WebSocket real-time sensor data stream |
| `GET` | `/api/models/status` | Cek model ML yang ter-load |
| `GET` | `/api/predict/{node_id}` | Prediksi H₂S & SO₂ untuk satu node |
| `POST` | `/api/predict/all` | Prediksi untuk semua node (1-6) |
| `POST` | `/api/predict/batch` | Prediksi per-node dengan fitur berbeda |

---

## 7. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Hardware** | ESP32, Sensor SO₂/H₂S, Anemometer, INA219, GPS |
| **Backend** | Python, FastAPI, Uvicorn, PySerial |
| **ML** | XGBoost, Scikit-learn, NumPy |
| **Frontend** | React, Vite, TailwindCSS |
| **Peta** | Leaflet, OpenStreetMap |
| **Grafik** | Recharts (AreaChart, LineChart) |
| **Komunikasi** | WebSocket (real-time), REST API (request-response) |
