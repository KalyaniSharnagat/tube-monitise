'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const notificationsData = [
  {
    id: '1',
    title: 'New Feature Released',
    description: 'We have released a new feature in the app.',
    date: '2025-08-22 10:15:00',
  },
  {
    id: '2',
    title: 'Maintenance Alert',
    description: 'Scheduled maintenance on 25th August from 2AM to 4AM.',
    date: '2025-08-20 09:30:00',
  },
  {
    id: '3',
    title: 'Payment Received',
    description: 'Your payment of $49 has been successfully received.',
    date: '2025-08-19 16:45:00',
  },
];

export function Notification() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [deleteId, setDeleteId] = useState(null); 
  const [isOpen, setIsOpen] = useState(false); 

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    setNotifications(notifications.filter((n) => n.id !== deleteId));
    setIsOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Sr. No</th>
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={notification.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{notification.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{notification.description}</td>
                    <td className="p-4 text-sm text-muted-foreground">{notification.date}</td>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this notification? This action cannot be undone.</p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
