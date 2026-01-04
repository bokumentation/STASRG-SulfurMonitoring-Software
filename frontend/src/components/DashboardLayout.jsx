import React, { useState } from "react";
import Header from "./Header";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Routes, Route } from "react-router-dom";
import DashboardMainContent from "./DashboardMainContent";

const SensorsPage = () => <div className="p-4">Sensors Monitoring Page</div>;
const LogsPage = () => <div className="p-4">System Logs Page</div>;
const SettingsPage = () => <div className="p-4">Settings Page</div>;

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 bg-background">
          <Header />

          <main className="p-6">
           {/* <DashboardMainConcent /> */}
           <Routes>
              <Route path="/" element={<DashboardMainContent />} />
              <Route path="/sensors" element={<SensorsPage />} />
              <Route path="/history" element={<LogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
