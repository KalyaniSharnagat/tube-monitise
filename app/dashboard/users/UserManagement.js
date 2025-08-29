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
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchString, setSearchString] = useState("");
  const itemsPerPage = 5;
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSearch = (eOrValue) => {
    const value = typeof eOrValue === "string" ? eOrValue : eOrValue?.target?.value || "";
    setCurrentPage(1);
    setSearchString(value);
    clearTimeout(timeoutId);
    let _timeOutId = setTimeout(() => {
      fetchUsers("1", value);
    }, 2000);
    setTimeoutId(_timeOutId);
  };

  const fetchUsers = async (page, searchString) => {
    try {
      const res = await communication.getUserList(page, searchString?.trim());

      if (res?.data?.status === 'SUCCESS') {
        toast.success(res.data.message, { position: 'top-right', autoClose: 3000 });
        setUsers(res.data.users);
      } else if ('JWT_INVALID' === res.data.status) {
        toast.error(res.data.message, { position: 'top-right', autoClose: 3000 });
        deleteCookie('auth');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        setUsers([]);
        setTotalPages(1);
        toast.error(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err.response?.data);
      setUsers([]);
      setTotalPages(1);
    }
    finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    try {
      const response = await communication.changeUserStatus(user.id); // use 'id' from object

      if (response?.data?.status === "SUCCESS") {
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

  const confirmDeleteUser = async () => {
    if (!userToDelete?.id) {
      toast.error("Invalid user selected");
      return;
    }
    try {
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

  useEffect(() => {
    fetchUsers();
  }, []);

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
            onSearchChange={handleSearch}
          />
          <div className="w-full border rounded">
            {/* Only table area scrolls */}
            <div className="w-full overflow-auto max-h-[calc(100dvh-16rem)]">
              <table className="min-w-[900px] w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                  <tr className="border-b">
                    <th className=" p-4">Sr.No.</th>
                    <th className=" p-4">User</th>
                    <th className=" p-4">Email</th>
                    <th className=" p-4">Google Id</th>
                    <th className=" p-4">Referral Id</th>
                    <th className=" p-4">Join Date</th>
                    <th className=" p-4">Videos</th>
                    <th className=" p-4">Coins</th>
                    <th className=" p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((user, index) => (
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
                          <Eye className="w-6 h-6" />
                        </button>

                        {/* Toggle Status */}
                        <div className="flex items-center justify-center w-9 h-9">
                          <button
                            onClick={() => toggleStatus(user)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full
                            ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}
                            title={user.status === 'Active' ? 'Active' : 'Inactive'}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white 
                              ${user.status === 'Active' ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>


                        {/* Delete */}
                        <button
                          size="icon"
                          onClick={() => openDeleteModal(user)}
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
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
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
          {/* Header */}
          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: '#2ea984' }}
          >
            <h3 className="font-semibold text-lg">User Details</h3>
            <button
              className="text-white text-xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
            </button>
          </div>

          {/* Body */}
          {selectedUser && (
            <div className="p-4 space-y-4">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Google ID:</strong> {selectedUser.googleId}</div>
              <div><strong>Referral ID:</strong> {selectedUser.referralCode}</div>
              <div>
                <strong>Status:</strong>{' '}
                <Badge className="bg-green-600 text-white">
                  {selectedUser.status || "Inactive"}
                </Badge>
              </div>
              <div>
                <strong>Join Date:</strong>{' '}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </div>
              <div><strong>Videos:</strong> {selectedUser.totalVideos}</div>
              <div><strong>Coins:</strong> {selectedUser["wallet.coins"]}</div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button
              className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
          {/* Header */}
          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: '#2ea984' }}
          >
            <h3 className="font-semibold text-lg">Delete Confirmation</h3>
            <button
              className="text-white text-xl font-bold"
              onClick={() => setDeleteModalOpen(false)}
            >

            </button>
          </div>

          {/* Body */}
          <div className="p-4 text-center">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
            >
              Cancel
            </Button>

            <Button
              style={{ backgroundColor: '#2ea984' }}
              className="hover:opacity-90 text-white"
              onClick={confirmDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
