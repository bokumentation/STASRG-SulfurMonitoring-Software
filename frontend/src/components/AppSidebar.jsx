import { LayoutDashboard, Database, Activity, Settings, User, Circle, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

const navItems = [
  { title: "Overview", icon: LayoutDashboard, url: "/" },
  { title: "Sensors", icon: Activity, url: "/sensors" },
  { title: "History", icon: Database, url: "/history" },
  { title: "Information", icon: Info, url: "/info" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [isOnline, setIsOnline] = useState(false);
  const { open } = useSidebar();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/status");
        if (res.status === 200) {
          setIsOnline(true);
        }
      } catch (err) {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarTrigger />
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}> {/* Changed <a> to <Link> and 'href' to 'to' */}
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isOnline ? "bg-emerald-50" : "bg-red-50"
          } ${!open ? "bg-transparent px-2" : ""}`}> {/* 3. Adjust padding/bg when closed */}

          {/* 4. Only show the text if 'open' is true */}
          {open && (
            <div className="flex flex-col overflow-hidden">
              <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${isOnline ? "text-emerald-700" : "text-red-700"
                }`}>
                {isOnline ? "System Online" : "System Offline"}
              </span>
              <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">
                FastAPI
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}