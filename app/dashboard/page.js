import Layout from "@/components/layout/Layout";
import UserManagement from "./UserManagement"; 
import { CoinManagement } from "./coin/CoinManagement";

export default function Page() {
  return (
    <Layout>
      <UserManagement />
      <CoinManagement />
    </Layout>
  );
}
