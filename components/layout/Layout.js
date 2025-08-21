"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";

export default function Layout({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header activeSection={activeSection} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
