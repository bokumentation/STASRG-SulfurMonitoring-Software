import React from 'react';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <div className="min-h-screen lg:h-screen w-screen bg-primary p-4 md:p-6 flex flex-col lg:overflow-hidden overflow-y-auto">
      <DashboardLayout />
    </div>
  );
}

export default App;
