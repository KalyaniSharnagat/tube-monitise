'use client';

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { communication } from "@/services/communication";
import { toast } from "react-toastify";
import { FilterBar } from "@/components/common/FilterBar";

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);  //delete
  const [userToDelete, setUserToDelete] = useState(null);

  // Filter and search 
  const filteredData = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      const res = await communication.getUserList({ id: "", page: 1, searchString: "" });
      const usersWithStatus = (res.data.users || []).map(user => ({
        ...user,
        status: user.status || "Active"
      }));
      setUsers(usersWithStatus);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // View modal
  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Status toggle modal
  const openStatusModal = (user) => {
    setUserToToggleStatus(user);
    setStatusModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;
    const newStatus = userToToggleStatus.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await communication.updateUser(userToToggleStatus.userIds, {
        ...userToToggleStatus,
        status: newStatus
      });
      if (res?.data?.status === "SUCCESS") {
        toast.success(`User status updated to "${newStatus}"!`);
        fetchUsers();
      } else {
        toast.warning(res.data.message || "Failed to update user status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating user status.");
    } finally {
      setStatusModalOpen(false);
      setUserToToggleStatus(null);
    }
  };

  // Delete modal
  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {

      const res = await communication.deleteSelectedUser([userToDelete]);
      if (res?.data?.status === "SUCCESS") {
        toast.success("User deleted successfully!");
        fetchUsers();
      }
      else {
        toast.warning(res.data.message || "Failed to delete")
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while");
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter and Pagination  */}
          <FilterBar
            showSearch
            searchPlaceholder="Search users..."
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="w-full overflow-x-auto max-h-[500px] ">
            <table className="min-w-[900px] border-collapse">
              {/* Table Head */}
              <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                <tr className="border-b">
                  <th className="p-3 text-center">Sr.No.</th>
                  <th className="p-3 text-center">User</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">Google Id</th>
                  <th className="p-3 text-center">Referral Id</th>
                  <th className="p-3 text-center">Join Date</th>
                  <th className="p-3 text-center">Videos</th>
                  <th className="p-3 text-center">Coins</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((user, index) => (
                    <tr key={user.userIds} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-3 whitespace-nowrap">{user.name}</td>
                      <td className="p-3 whitespace-nowrap">{user.email}</td>
                      <td className="p-3">{user.googleId}</td>
                      <td className="p-3">{user.referralCode}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{user.videos}--</td>
                      <td className="p-3">{user.coins}--</td>
                      <td className="p-3 flex gap-2 items-center justify-center">
                        {/* Eye button */}
                        <Button variant="ghost" size="icon" onClick={() => openViewModal(user)} className="hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </Button>

                        {/* Status toggle */}
                        <Button
                          onClick={() => openStatusModal(user)}
                          className={`relative inline-flex h-4 w-8 items-center rounded-full border transition-colors 
                ${user.status === 'Active' ? 'border-black' : 'border-gray-400'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-black transition-transform
                  ${user.status === 'Active' ? 'translate-x-5' : 'translate-x-1'}`}
                          />
                        </Button>

                        {/* Delete button */}
                        <Button variant="ghost" size="icon" onClick={() => openDeleteModal(user.id)} className="hover:bg-gray-100">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Google ID:</strong> {selectedUser.googleId}</div>
              <div><strong>Referral ID:</strong> {selectedUser.referralCode}</div>
              <div><strong>Status:</strong> <Badge>{selectedUser.status || "Inactive"}</Badge></div>
              <div><strong>Join Date:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              <div><strong>Videos:</strong> {selectedUser.videos}</div>
              <div><strong>Coins:</strong> {selectedUser.coins}</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-sm w-full">
          <div className="text-white flex justify-between items-center px-4 py-2 bg-red-600">
            <h3 className="font-semibold text-lg">Delete Confirmation</h3>
            <button
              className="text-white text-xl font-bold"
              onClick={() => setDeleteModalOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
            </p>
          </div>
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Toggle  Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-sm w-full">
          <div className={`text-white flex justify-between items-center px-4 py-2 ${userToToggleStatus?.status === 'Active' ? 'bg-red-600' : 'bg-blue-500'}`}>
            <h3 className="font-semibold text-lg">Confirm Status Change</h3>
            <button className="text-white text-xl font-bold" onClick={() => setStatusModalOpen(false)}>×</button>
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-700">
              Are you sure you want to {userToToggleStatus?.status === 'Active' ? 'disable' : 'enable'} the user {userToToggleStatus?.name}?
            </p>
          </div>
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmToggleStatus}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
