'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { communication } from '@/services/communication';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/common/FilterBar';

export function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteType, setBulkDeleteType] = useState(null);

  const router = useRouter();
  const itemsPerPage = 10;
  let searchDebounce;

  // ✅ Toggle select one
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  // ✅ Search handler with debounce
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      fetchNotifications(value, 1);
    }, 600); // 600ms debounce
  };

  // ✅ Fetch API
  const fetchNotifications = async (query = searchQuery, page = currentPage) => {
    try {
      setLoading(true);
      const res = await communication.getAllNotification(page, query);

      if (res?.data?.status === 'SUCCESS') {
        setNotifications(res.data.notifications || []);
        setTotalPages(res.data.totalPages || 1);
      } else if (res?.data?.status === 'JWT_INVALID') {
        toast.warning(res.data.message || 'Session expired');
        deleteCookie('auth');
        deleteCookie('userDetails');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        toast.warning(res.data.message || 'Failed to fetch notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete single
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  // ✅ Confirm single delete
  const confirmDelete = async () => {
    try {
      const res = await communication.deleteSelectedNotification([deleteId]);
      if (res?.data?.status === 'SUCCESS') {
        setNotifications((prev) => prev.filter((n) => n.id !== deleteId));
        toast.success('Notification deleted successfully');
      } else {
        toast.warning(res?.data?.message || 'Failed to delete notification');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Error deleting notification');
    } finally {
      setIsOpen(false);
      setDeleteId(null);
    }
  };

  // ✅ Delete Selected
  const handleDeleteSelectedClick = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await communication.deleteSelectedNotification(selectedIds);
      if (res?.data?.status === 'SUCCESS') {
        setNotifications((prev) =>
          prev.filter((n) => !selectedIds.includes(n.id))
        );
        setSelectedIds([]);
        toast.success('Selected notifications deleted successfully');
      } else {
        toast.warning(
          res?.data?.message || 'Failed to delete selected notifications'
        );
      }
    } catch (err) {
      console.error('Error deleting selected notifications:', err);
      toast.error('Error deleting selected notifications');
    } finally {
      setIsOpen(false);
      setBulkDeleteType(null);
    }
  };

  // ✅ Initial fetch + on page change
  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 pe-5">
          <CardTitle className="text-lg font-semibold">
            Notifications
          </CardTitle>

          <div className="flex gap-2">
            {/* Delete Selected Button */}
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setIsOpen(true);
                setBulkDeleteType('SELECTED');
              }}
              disabled={selectedIds.length === 0}
            >
              {`Delete (${selectedIds.length})`}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Sticky Search */}
          <div className="sticky top-0 z-20 bg-white">
            <FilterBar
              showSearch
              searchPlaceholder="Search Notification..."
              onSearchChange={handleSearch}
            />
          </div>

          {/* Loading / Empty State */}
          {loading && <p className="text-center py-4">Loading notifications...</p>}
          {!loading && notifications.length === 0 && (
            <p className="text-center py-4">No notifications found.</p>
          )}

          {/* Table */}
          {!loading && notifications.length > 0 && (
            <div className="overflow-x-auto border rounded m-1">
              <table className="min-w-[900px] w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === notifications.length &&
                          notifications.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-medium text-left">Sr. No</th>
                    <th className="p-4 font-medium text-left">Title</th>
                    <th className="p-4 font-medium text-left">Description</th>
                    <th className="p-4 font-medium text-left">Date</th>
                    <th className="p-4 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, index) => (
                    <tr key={notification.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => toggleSelect(notification.id)}
                        />
                      </td>
                      <td className="p-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-4 font-medium">{notification.title}</td>
                      <td className="p-3 text-sm max-w-md">
                        {expandedMessage === notification.id ? (
                          <>
                            <p className="whitespace-pre-wrap break-words">
                              {notification.description}
                            </p>
                            <button
                              className="font-medium mt-1 hover:underline"
                              onClick={() => setExpandedMessage(null)}
                            >
                              Show Less
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="line-clamp-2 whitespace-pre-wrap break-words">
                              {notification.description}
                            </p>
                            {notification.description.length > 50 && (
                              <button
                                className="font-medium mt-1 hover:underline"
                                onClick={() =>
                                  setExpandedMessage(notification.id)
                                }
                              >
                                .....
                              </button>
                            )}
                          </>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteClick(notification.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: '#2ea984' }}
          >
            <h3 className="font-semibold text-lg">
              {deleteId
                ? 'Delete Notification'
                : bulkDeleteType === 'SELECTED'
                ? 'Delete Selected Notifications'
                : 'Delete Notifications'}
            </h3>
          </div>

          <div className="p-4 text-center">
            <p className="text-gray-700">
              {deleteId
                ? 'Are you sure you want to delete this notification?'
                : bulkDeleteType === 'SELECTED'
                ? `Are you sure you want to delete ${selectedIds.length} selected notifications?`
                : 'Are you sure you want to delete notifications?'}
            </p>
          </div>

          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setDeleteId(null);
                setBulkDeleteType(null);
              }}
              className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#2ea984' }}
              className="hover:opacity-90 text-white"
              onClick={deleteId ? confirmDelete : handleDeleteSelectedClick}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
