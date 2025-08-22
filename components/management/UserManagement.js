'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Active',
    joinDate: '2024-01-15',
    videos: 23,
    earnings: '$2,847',
    coins: 1250
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Viewer',
    status: 'Active',
    joinDate: '2024-02-20',
    videos: 0,
    earnings: '$0',
    coins: 500
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Pending',
    joinDate: '2024-03-01',
    videos: 12,
    earnings: '$1,456',
    coins: 800
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
    {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
    role: 'Creator',
    status: 'Suspended',
    joinDate: '2024-01-08',
    videos: 45,
    earnings: '$5,234',
    coins: 2100
  },
 
];

export function UserManagement({ currentPage, setCurrentPage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view'); // view,edit,delete
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6" style={{ overflow: "hidden" }} >
      {/* <div className="flex items-center justify-between"> */}
        {/* <div className="flex space-x-3"> */}
          {/* <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button> */}
            <Button className="bg-red-500 hover:bg-green-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        {/* </div> */}
      {/* </div> */}

   
  
      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="relative max-h-[60vh] "  style={{ msOverflowStyle: "none", scrollbarWidth: "none"}}>
            <table className="w-full min-w-[900px] ">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Sr.No.</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  {/* <th className="text-left p-4 font-medium">Role</th> */}
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Join Date</th>
                  <th className="text-left p-4 font-medium">Videos</th>
                  <th className="text-left p-4 font-medium">Coins</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={`${user.id}-${index}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {/* <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar> */}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
                        </div>
                      </div>
                    </td>
                  
                    <td className="p-4">
                      <Badge variant="outline" className={
                        user.email 
                      }>
                        {user.email}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.joinDate}</td>
                    <td className="p-4 font-medium">{user.videos}</td>
                    <td className="p-4 font-medium">{user.coins}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button aria-label="View" variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={() => openModal('view', user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button aria-label="Edit" variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={() => openModal('edit', user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button aria-label="Delete" variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={() => openModal('delete', user)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'view' && 'User Details'}
              {modalType === 'edit' && 'Edit User'}
              {modalType === 'delete' && 'Delete User'}
            </DialogTitle>
            {modalType === 'view' && (
              <DialogDescription>Basic information about the user.</DialogDescription>
            )}
          </DialogHeader>

          {selectedUser && modalType === 'view' && (
            <div className="space-y-2">
              <div className="font-medium">{selectedUser.name}</div>
              <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              <div className="text-sm">Status: {selectedUser.status}</div>
              <div className="text-sm">Join Date: {selectedUser.joinDate}</div>
              <div className="text-sm">Videos: {selectedUser.videos}</div>
              <div className="text-sm">Coins: {selectedUser.coins}</div>
            </div>
          )}

          {selectedUser && modalType === 'edit' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <Input defaultValue={selectedUser.email} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(false)}>Save</Button>
              </div>
            </div>
          )}

          {selectedUser && modalType === 'delete' && (
            <div className="space-y-4">
              <p>Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>?</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={() => setIsModalOpen(false)}>Delete</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}