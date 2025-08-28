'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteCookie, setCookie } from 'cookies-next';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { communication } from '@/services/communication';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteType, setBulkDeleteType] = useState(null);
  const router = useRouter();

  // 🔹 Fetch notifications list
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await communication.getAllNotification(page, searchString);

      console.log("API Response:", res?.data);

      if (res?.data?.status === 'SUCCESS') {
         toast.success(res.data.message, { position: 'top-right', autoClose: 3000 });
        setNotifications(res.data.notifications || []);
      }
      else if ('JWT_INVALID' === res.data.status) {
        toast.warning(res.data.message || 'Session expired', {
          position: 'top-right',
          autoClose: 3000,
        });
        deleteCookie('auth');
        deleteCookie('userDetails');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        toast.warning(res.data.message || 'Failed to fetch notifications', {
          position: 'top-right',
          autoClose: 3000,
        });
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data);



      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount or page/search change
  useEffect(() => {
    fetchNotifications();
  }, [page, searchString]);

  // Delete click (single)
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  // confirmDelete (single delete)
  const confirmDelete = async () => {
    try {
      const res = await communication.deleteSelectedNotification([deleteId]);
      if (res?.data?.status === "SUCCESS") {
        setNotifications((prev) => prev.filter((n) => n.id !== deleteId));
        toast.success("Notification deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.warning(res?.data?.message || "Failed to delete notification", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Error deleting notification", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsOpen(false);
      setDeleteId(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  // Bulk delete selected button click
  const handleDeleteSelectedClick = () => {
    if (selectedIds.length === 0) return;
    setBulkDeleteType("SELECTED");
    setIsOpen(true);
  };

  // Delete All button click
  const handleDeleteAllClick = () => {
    setBulkDeleteType("ALL");
    setIsOpen(true);
  };

  // confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      let res;
      if (bulkDeleteType === "SELECTED") {
        res = await communication.deleteSelectedNotification(selectedIds);
        if (res?.data?.status === "SUCCESS") {
          setNotifications((prev) =>
            prev.filter((n) => !selectedIds.includes(n.id))
          );
          setSelectedIds([]);
          toast.success("Selected notifications deleted successfully", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.warning(res?.data?.message || "Failed to delete selected notifications", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else if (bulkDeleteType === "ALL") {
        res = await communication.deleteAllNotification();
        if (res?.data?.status === "SUCCESS") {
          setNotifications([]);
          setSelectedIds([]);
          toast.success("All notifications deleted successfully", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.warning(res?.data?.message || "Failed to delete all notifications", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Error bulk deleting notifications:", err);
      toast.error("Error performing bulk delete", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsOpen(false);
      setBulkDeleteType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="flex items-center gap-5">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchNotifications();
          }}
          className="border p-2 rounded-md w-1/3"
        />
      </div>

      {loading && <p className="text-center">Loading notifications...</p>}
      {!loading && notifications.length === 0 && (
        <p className="text-center">No notifications found.</p>
      )}

      {!loading && notifications.length > 0 && (
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
                onClick={handleDeleteSelectedClick}
                disabled={selectedIds.length === 0}
              >
                {`Delete (${selectedIds.length})`}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === notifications.length &&
                          notifications.length > 0
                        }
                        onChange={toggleSelectAll}

                      />
                    </th>
                    <th className="text-left p-4 font-medium">Sr. No</th>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, index) => (
                    <tr
                      key={notification.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => toggleSelect(notification.id)}
                        />
                      </td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium">{notification.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {notification.description}
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
                          <Trash2 className="w-4 h-4" />
                        </Button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal (single + bulk) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
          {/* Header */}
          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: '#2ea984' }}
          >
            <h3 className="font-semibold text-lg">
              {deleteId
                ? "Delete Notification"
                : bulkDeleteType === "SELECTED"
                  ? "Delete Selected Notifications"
                  : "Delete All Notifications"}
            </h3>
            <button
              className="text-white text-xl font-bold"
              onClick={() => {
                setIsOpen(false);
                setDeleteId(null);
                setBulkDeleteType(null);
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4 text-center">
            <p className="text-gray-700">
              {deleteId
                ? "Are you sure you want to delete this notification? This action cannot be undone."
                : bulkDeleteType === "SELECTED"
                  ? `Are you sure you want to delete ${selectedIds.length} selected notifications?`
                  : "Are you sure you want to delete all notifications? This action cannot be undone."}
            </p>
          </div>

          {/* Footer */}
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
              onClick={deleteId ? confirmDelete : confirmBulkDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
