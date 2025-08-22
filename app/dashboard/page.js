import Layout from "@/components/layout/Layout";
import UserManagement from "./UserManagement"; 
import { CoinManagement } from "./coin/CoinManagement";
import { VideoManagement } from "./videomange/VideoManagement";
import { ContactManagement } from "./contact/ContactManagement";
import Notification from "./notificationmange/Notification";   // ✅ fixed

export default function Page() {
  return (
    <Layout>
      <UserManagement />
      <CoinManagement />
      <VideoManagement />
      <ContactManagement />
      <Notification />
    </Layout>
  );
}
