"use client";
import { useState } from "react";
import Layout from "../../../components/layout/Layout";
import { CoinManagement } from "./CoinManagement";

export default function Page() {
  const [activeSection, setActiveSection] = useState("coins"); // important!

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      <CoinManagement />
    </Layout>
  );
}
