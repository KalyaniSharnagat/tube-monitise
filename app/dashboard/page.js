'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Loader from "../loader/loader"; 

import UserManagement from "./UserManagement"; 
import { CoinManagement } from "./coin/CoinManagement";
import { VideoManagement } from "./videomange/VideoManagement";
import { ContactManagement } from "./contact/ContactManagement";
import { TransactionManagement } from "./transaction/TransactionManagement";
import Notification from "./notificationmange/Notification"; 

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API/data load OR route load
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader text="Loading page..." />; 
  }

  return (
    <Layout>
      <UserManagement />
      <CoinManagement />
      <VideoManagement />
      <ContactManagement />
      <TransactionManagement />
      <Notification />
    </Layout>
  );
}
