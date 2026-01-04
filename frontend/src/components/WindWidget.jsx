import React from 'react';
import { Navigation } from 'lucide-react';

const WindWidget = () => {
    return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-4 min-w-[180px]">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <Navigation className="text-accent-surface fill-primary rotate-45 w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-secondary-surface text-xs font-bold uppercase tracking-wider">Wind Direction</p>
                <p className="text-primary-dark font-bold text-lg">SE - 1.8 m/s</p>
            </div>
        </div>
    );
};

export default WindWidget;
