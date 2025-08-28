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
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredData = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      const res = await communication.getUserList({ id: "", page: 1, searchString: "" });

      if (res?.data?.status === 'SUCCESS') {
        const usersWithStatus = (res.data.users || []).map(user => ({
          ...user,
          status: user.status || "Active"
        }));
        setUsers(usersWithStatus);
      } else {
        toast.error(res?.data?.message || 'Failed to fetch users', {
          position: 'top-right',
          autoClose: 3000,
        });
        setUsers([]);
      }

    } catch (err) {
      console.error('Error fetching users:', err.response?.data);

      const apiStatus = err.response?.data?.status;
      const message = err.response?.data?.message || 'Error fetching users';

      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });


      if (apiStatus === 'JWT_INVALID') {
        setCookie('auth', '', { maxAge: -1, path: '/' });
        setCookie('userDetails', '', { maxAge: -1, path: '/' });

        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }

      setUsers([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const toggleStatus = async (user) => {
    try {
      const response = await communication.changeUserStatus(user.id); // use 'id' from object

      if (response?.data?.status === "SUCCESS") {
        // Update local state immediately
        setUsers(prev =>
          prev.map(u =>
            u.id === user.id
              ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
              : u
          )
        );
        toast.success(response.data.message || "User status updated successfully");
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error in toggleStatus:", error);
      toast.error("Something went wrong while updating status");
    }
  };


  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete?.id) {
      toast.error("Invalid user selected");
      return;
    }

    try {
      // Pass an array of IDs
      const res = await communication.deleteSelectedUser([userToDelete.id]);

      if (res?.data?.status === "SUCCESS") {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.warning(res.data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting user");
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
          <FilterBar
            showSearch
            searchPlaceholder="Search users..."
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="w-full border rounded">
            {/* Only table area scrolls */}
            <div className="w-full overflow-auto max-h-[calc(100dvh-16rem)]">
              <table className="min-w-[900px] w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                  <tr className="border-b">
                    <th className="text-center p-4">Sr.No.</th>
                    <th className="text-center p-4">User</th>
                    <th className="text-center p-4">Email</th>
                    <th className="text-center p-4">Google Id</th>
                    <th className="text-center p-4">Referral Id</th>
                    <th className="text-center p-4">Join Date</th>
                    <th className="text-center p-4">Videos</th>
                    <th className="text-center p-4">Coins</th>
                    <th className="text-center p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? paginatedData.map((user, index) => (
                    <tr key={user.userIds} className="border-b">
                      <td className="p-4 whitespace-normal break-all">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-4 whitespace-normal break-all">{user.name}</td>
                      <td className="p-4 whitespace-normal break-all">{user.email}</td>
                      <td className="p-4 whitespace-normal break-all">{user.googleId}</td>
                      <td className="p-4 whitespace-normal break-all">{user.referralCode}</td>
                      <td className="p-4 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">{user.totalVideos}</td>
                      <td className="p-4">{user["wallet.coins"] ?? '0'}</td>
                      <td className="p-4 flex gap-2 items-center">
                        {/* View */}
                        <button size="icon" onClick={() => openViewModal(user)} >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status toggle directly */}
                        <div className="relative group">
                          <button
                            onClick={() => toggleStatus(user)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full
                           ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white 
                             ${user.status === 'Active' ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                          </button>

                          {/* Tooltip */}
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-10">
                            {user.status === 'Active' ? 'Activate' : 'Deactivate'}
                          </span>
                        </div>


                        {/* Delete */}
                        <button
                          size="icon"
                          onClick={() => openDeleteModal(user)}
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
              <div><strong>Status:</strong> <Badge className="bg-green-600 text-white">{selectedUser.status || "Inactive"}</Badge></div>
              <div><strong>Join Date:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              <div><strong>Videos:</strong> {selectedUser.totalVideos}</div>
              <div><strong>Coins:</strong> {selectedUser["wallet.coins"]}</div>
            </div>
          )}
          <DialogFooter>
            <Button className="bg-green-600 text-white  hover:bg-green-600" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-sm w-full">
          <div className="text-white flex justify-between items-center px-4 py-2 bg-green-600">
            <h3 className="font-semibold text-lg">Delete Confirmation</h3>
            <button className=" text-white text-xl font-bold" onClick={() => setDeleteModalOpen(false)}>×</button>
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-700">Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
          </div>
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button className="bg-gray-600 text-white  hover:bg-gray-600" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 text-white  hover:bg-green-600" onClick={confirmDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
