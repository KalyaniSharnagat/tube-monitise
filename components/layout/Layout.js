"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";

// Toast imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-[100dvh] overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar (fixed) */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header (fixed at top of main column) */}
          <Header
            activeSection={activeSection}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* ToastContainer - yahan globally accessible */}
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Scroll only inside this main content area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">{children}</main>
        </div>
      </div>
    </div>
  );
}
