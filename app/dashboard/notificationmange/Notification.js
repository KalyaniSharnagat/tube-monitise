'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { communication } from '@/services/communication';

export function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteType, setBulkDeleteType] = useState(null);

  // 🔹 Fetch notifications list
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await communication.getAllNotification(page, searchString);
      console.log("API Response:", res?.data); // 👈 debug
      if (res?.data?.status === 'SUCCESS') {
        setNotifications(res.data.notifications || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // mount पर load
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
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
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
        }
      } else if (bulkDeleteType === "ALL") {
        res = await communication.deleteAllNotification();
        if (res?.data?.status === "SUCCESS") {
          setNotifications([]);
          setSelectedIds([]);
        }
      }
    } catch (err) {
      console.error("Error bulk deleting notifications:", err);
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
                          className="p-2"
                          onClick={() => handleDeleteClick(notification.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
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
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {deleteId
                ? "Delete Notification"
                : bulkDeleteType === "SELECTED"
                ? "Delete Selected Notifications"
                : "Delete All Notifications"}
            </DialogTitle>
          </DialogHeader>

          <p>
            {deleteId
              ? "Are you sure you want to delete this notification? This action cannot be undone."
              : bulkDeleteType === "SELECTED"
              ? `Are you sure you want to delete ${selectedIds.length} selected notifications?`
              : "Are you sure you want to delete all notifications? This action cannot be undone."}
          </p>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setDeleteId(null);
                setBulkDeleteType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
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
