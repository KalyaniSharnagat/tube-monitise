'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { communication } from "@/services/communication"; // updated import

export function UserManagement({ currentPage, setCurrentPage }) {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [selectedUser, setSelectedUser] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    referralId: "",
    status: "Active",
    joinDate: new Date().toISOString().slice(0, 10),
    videos: 0,
    earnings: "$0",
    coins: 0,
    googleId: "",
  });

  const [editedUser, setEditedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      console.log("jayshree")
      let id = "";
      let page = 1;
      let searchString = "";
      const res = await communication.getUserList(id, page, searchString);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    if (type === "edit") setEditedUser({ ...user });
    setIsModalOpen(true);
  };

  // Edit handlers
  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: type === "number" ? parseInt(value) : value }));
  };

  const handleEditSelectChange = (name, value) => {
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await communication.updateUser(editedUser.id, editedUser);
      setUsers(users.map(u => (u.id === editedUser.id ? editedUser : u)));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete handler
  const handleDelete = async (userId) => {
    try {
      await communication.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="relative overflow-auto max-h-[60vh] custom-scrollbar">
            <table className="w-full min-w-[900px]">
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Sr.No.</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Google Id</th>
                  <th className="text-left p-4 font-medium">Referral Id</th>
                  <th className="text-left p-4 font-medium">Join Date</th>
                  <th className="text-left p-4 font-medium">Videos</th>
                  <th className="text-left p-4 font-medium">Coins</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4"><Badge variant="outline">{user.email}</Badge></td>
                    <td className="p-4 font-medium">{user.referralCode}</td>
                    <td className="p-4 font-medium">{user.googleId}</td>
                    
                    <td className="p-4 text-sm text-muted-foreground">{user.createdAt}</td>
                    <td className="p-4 font-medium">{user.videos}--</td>
                    <td className="p-4 font-medium">{user.coins}--</td>
                    <td className="p-4 flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openModal("view", user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openModal("edit", user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openModal("delete", user)}>
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

      {/* Modals */}
      
    </div>
  );
}
