import React from 'react';
import { Compass } from 'lucide-react';

const WindCard = ({ type, value, unit, period, status }) => {
    return (
        <div className="bg-gray-50 hover:bg-white border border-transparent hover:border-emerald-100 transition-all rounded-xl p-4 relative overflow-hidden group shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 text-gray-400">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{type}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wide">
                    {status}
                </span>
            </div>

            <div className="mt-1 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
                <span className="text-xs text-gray-500 ml-1 font-medium">{unit}</span>
            </div>

            <div className="mt-1 text-[10px] text-gray-400 font-mono">
                {period} moving average
            </div>
        </div>
    );
};

export default WindCard;
