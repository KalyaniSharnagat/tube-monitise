import Layout from "@/components/layout/Layout";
import UserManagement from "./UserManagement"; 
import { CoinManagement } from "./coin/CoinManagement";
import { VideoManagement } from "./videomange/VideoManagement";

export default function Page() {
  return (
    <Layout>
      <UserManagement />
      <CoinManagement />
      <VideoManagement/>
    </Layout>
  );
}
