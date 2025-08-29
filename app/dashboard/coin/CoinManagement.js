'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Coins, Plus, Trash2 } from 'lucide-react';
import { communication } from '@/services/communication';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterBar } from '@/components/common/FilterBar';
import { deleteCookie, removeCookies, setCookie } from 'cookies-next';

export function CoinManagement() {
  const [coinPackages, setCoinPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoin, setNewCoin] = useState({ id: '', coins: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [coinToDelete, setCoinToDelete] = useState(null);
  const [timeoutId, setTimeoutId] = useState();
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const openCreateModal = () => {
    setNewCoin({ id: '', coins: '', price: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setNewCoin({ id: pkg.id, coins: pkg.coins, price: pkg.amount });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clearTimeout(timeoutId);
    const _timeoutId = setTimeout(() => {
      fetchCoins(value, 1);
    }, 2000);
    setTimeoutId(_timeoutId);
  };

  const openDeleteModal = (pkgId) => {
    setCoinToDelete(pkgId);
    setDeleteModalOpen(true);
  };

  const fetchCoins = async (query = searchQuery, page = currentPage) => {
    try {
      setLoading(true);
      const res = await communication.getCoinSlotList({ page, searchString: "" });

      if (res?.data?.status === 'SUCCESS') {
        let slots = res.data.slots || [];
        if (query) {
          slots = slots.filter(slot =>
            String(slot.amount).includes(query) ||
            String(slot.coins).includes(query)
          );
        }
        setCoinPackages(slots);
        setTotalPages(res.data.totalPages || 1);
      } else {
        toast.warning(res.data.message, { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoin = async () => {
    try {
      if (isEditing) {
        const res = await communication.updateCoinSlot(newCoin.id, newCoin.coins, newCoin.price);
        if (res?.data?.status === 'SUCCESS') {
          toast.success('Coin package updated successfully!', { position: 'top-right', autoClose: 3000 });
          setIsModalOpen(false);
          setIsEditing(false);
          setNewCoin({ id: '', coins: '', price: '' });
          fetchCoins();
        } else {
          toast.warning(res.data.message || 'Failed to update coin package', { position: 'top-right', autoClose: 3000 });
        }
      } else {
        const exists = coinPackages.some(pkg => pkg.coins === newCoin.coins && pkg.amount === newCoin.price);
        if (exists) {
          toast.error('A coin package with the same coins and amount already exists!', { position: 'top-right', autoClose: 3000 });
          return;
        }

        const res = await communication.createCoinSlot(newCoin.coins, newCoin.price);
        if (res?.data?.status === 'SUCCESS') {
          toast.success('Coin package created successfully!', { position: 'top-right', autoClose: 3000 });
          setIsModalOpen(false);
          setNewCoin({ id: '', coins: '', price: '' });
          fetchCoins();
        } else {
          toast.warning(res.data.message || 'Failed to create coin package', { position: 'top-right', autoClose: 3000 });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while saving coin package.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const confirmDeleteCoin = async () => {
    try {
      const res = await communication.deleteCoinSlot([coinToDelete]);
      if (res?.data?.status === "SUCCESS") {
        toast.success("Coin package deleted successfully!", { position: "top-right", autoClose: 3000 });
        fetchCoins();
      } else {
        toast.warning(res.data.message || "Failed to delete coin package", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting coin package.", { position: "top-right", autoClose: 3000 });
    } finally {
      setDeleteModalOpen(false);
      setCoinToDelete(null);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Coin Management</CardTitle>
          <Button
            size="sm"
            className="hover:opacity-90"
            style={{ backgroundColor: '#2ea984', color: '#fff' }}
            onClick={openCreateModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coin
          </Button>

        </CardHeader>

        <CardContent className="p-0">

          <div className="sticky top-0 z-20 bg-white">
            <FilterBar
              showSearch
              searchPlaceholder="Search coins or amount..."
              onSearchChange={handleSearch}
            />
          </div>
          <div className="overflow-y-auto p-4 custom-scroll max-h-[calc(100dvh-16rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {coinPackages.length > 0 ? (
                coinPackages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="relative border-2 w-full h-auto"
                    style={{ borderColor: '#2ea984' }}
                  >
                    <button
                      onClick={() => openDeleteModal(pkg.id)}
                      className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <CardContent className="p-4 md:p-5 text-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Coins className="w-6 h-6 text-yellow-600" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">{pkg.coins}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">coins</p>
                      <p className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#2ea984' }}>
                        ₹{pkg.amount}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(pkg)}
                        className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
                      >
                        Edit
                      </Button>

                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500 mt-6">No coins found.</p>
              )}
            </div>
          </div>
        </CardContent>


      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] shadow-lg">
            <div className="flex items-center justify-between bg-[#2ea984] text-white px-4 py-3 rounded-t-lg">
              <h3 className="text-lg font-semibold">
                {isEditing ? "Edit Coin Package" : "Add New Coin"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>


            <div className="p-6">
              <Input
                placeholder="Coins"
                type="number"
                value={newCoin.coins}
                onChange={(e) =>
                  setNewCoin({ ...newCoin, coins: parseInt(e.target.value) })
                }
                className="mb-3 no-spinner"
              />
              <Input
                placeholder="Amount (₹)"
                type="number"
                value={newCoin.price}
                onChange={(e) =>
                  setNewCoin({ ...newCoin, price: parseFloat(e.target.value) })
                }
                className="mb-3 no-spinner"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-[#565e64] hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSaveCoin}
                  style={{ backgroundColor: "#2ea984", color: "white" }}
                >
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">

          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: "#2ea984" }}
          >
            <h3 className="font-semibold text-lg">Delete Confirmation</h3>
            <button onClick={() => setDeleteModalOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-700">Are you sure you want to delete this coin?</p>
          </div>
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
              onClick={confirmDeleteCoin}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

    </div >
  );
}