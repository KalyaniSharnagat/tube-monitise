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

  // Add User handlers
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setNewUser(prev => ({ ...prev, [name]: type === "number" ? parseInt(value) : value }));
  };

  const handleSelectChange = (name, value) => {
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      console.log("Adding user:", newUser);
      const res = await communication.createUser(newUser);
      console.log("Response:", res);
      setUsers(prev => [...prev, res.data?.user || newUser]);
      setIsAddModalOpen(false);
      // reset form
      setNewUser({
        name: "",
        email: "",
        googleId: "",
        referralId: "",
        status: "Active",
        joinDate: new Date().toISOString().slice(0, 10),
        videos: 0,
        earnings: "$0",
        coins: 0,


      });
    } catch (err) {
      console.error("Add user failed:", err);
      alert("Failed to add user. Check console for details.");
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
      {/* Add User Button */}
      <div className="flex justify-end">
        <Button className="bg-red-500 hover:bg-green-600" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

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
                  <th className="text-left p-4 font-medium">Status</th>
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
                    <td className="p-4 font-medium">{user.googleId}</td>
                    <td className="p-4 font-medium">{user.
                      referralCode
                    }</td>
                    <td className="p-4">
                      <Badge className={
                        user.status === "Active" ? "bg-green-100 text-green-800" :
                          user.status === "Suspended" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                      }>{user.status}</Badge>
                    </td>
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === "view" && "User Details"}
              {modalType === "edit" && "Edit User"}
              {modalType === "delete" && "Delete User"}
            </DialogTitle>
          </DialogHeader>

          {modalType === "view" && selectedUser && (
            <div className="space-y-2">
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p>Google Id: {selectedUser.googleId}</p>
              <p>Refferal Id: {selectedUser.referralId}</p>
              <p>Status: {selectedUser.status}</p>
              <p>Join Date: {selectedUser.joinDate}</p>
              <p>Videos: {selectedUser.videos}</p>
              <p>Coins: {selectedUser.coins}</p>
            </div>
          )}

          {modalType === "edit" && editedUser && (
            <div className="space-y-3">
              <div>
                <label>Name</label>
                <Input name="name" value={editedUser.name} onChange={handleEditChange} />
              </div>
              <div>
                <label>Email</label>
                <Input name="email" value={editedUser.email} onChange={handleEditChange} />
              </div>
              <div>
                <label>Google Id</label>
                <Input name="number" value={editdUser.googleId} onChange={handleEditChange} />
              </div>
              <div>
                <label>Referral Id</label>
                <Input name="number" value={editedUser.referralId} onChange={handleEditChange} />
              </div>
              <div>
                <label>Status</label>
                <Select value={editedUser.status} onValueChange={(v) => handleEditSelectChange("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Videos</label>
                <Input type="number" name="videos" value={editedUser.videos} onChange={handleEditChange} />
              </div>
              <div>
                <label>Coins</label>
                <Input type="number" name="coins" value={editedUser.coins} onChange={handleEditChange} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save</Button>
              </DialogFooter>
            </div>
          )}

          {modalType === "delete" && selectedUser && (
            <div className="space-y-4">
              <p>Are you sure you want to delete <strong>{selectedUser.name}</strong>?</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(selectedUser.id)}>Delete</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Fill in the details to add a new user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Name</label>
              <Input name="name" value={newUser.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Email</label>
              <Input name="email" value={newUser.email} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>GoogleId</label>
              <Input name="number" value={newUser.googleId} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Reffreral Id</label>
              <Input name="number" value={newUser.referralId} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Status</label>
              <Select value={newUser.status} onValueChange={(v) => handleSelectChange("status", v)}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Videos</label>
              <Input type="number" name="videos" value={newUser.videos} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label>Coins</label>
              <Input type="number" name="coins" value={newUser.coins} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
