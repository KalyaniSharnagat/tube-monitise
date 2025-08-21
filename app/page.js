'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/common/FilterBar';
// import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { UserManagement } from '@/components/management/UserManagement';
import { VideoManagement } from '@/components/management/VideoManagement';
import { CoinManagement } from '@/components/management/CoinManagement';
import { TransactionManagement } from '@/components/management/TransactionManagement';
import { ContactManagement } from '@/components/management/ContactManagement';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  useEffect(() => {
    const hasAuth = document.cookie.split('; ').find((row) => row.startsWith('auth='));
    if (!hasAuth) {
      router.replace('/login');
    }
  }, [router]);

  const renderContent = () => {
    switch (activeSection) {
      // case 'users':
      //   return <DashboardOverview />;
      case 'users':
        return <UserManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'videos':
        return <VideoManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'coins':
        return <CoinManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'transactions':
        return <TransactionManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'contacts':
        return <ContactManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        <Header activeSection={activeSection} />
        <FilterBar
          showSearch={true}
          searchPlaceholder={`Search ${activeSection}...`}
          filters={[]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}