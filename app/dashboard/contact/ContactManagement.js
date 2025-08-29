'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { communication } from '@/services/communication';

export function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();


  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await communication.getQueryList(page, searchString);

      if (res?.data?.status === "SUCCESS") {
        toast.success(res.data.message, { position: 'top-right', autoClose: 3000 });
        setContacts(res.data.contacts);
        setTotalPages(res.data.totalPages || 1);
      } else if ('JWT_INVALID' === res.data.status) {
        toast.error(res.data.message, { position: 'top-right', autoClose: 3000 });
        deleteCookie('auth');
        deleteCookie('userDetails');
        setTimeout(() => {  
          router.push('/login');
        }, 1000);
      } else {
        toast.warning(res.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error fetching contacts:", err.response?.data);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, searchString]);

  const handleEdit = (contact) => {
    setSelectedContact({ ...contact, queryId: contact.id });
    setOpenEditModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await communication.updateQuery(selectedContact.queryId, {
        message: selectedContact.message,
        status: selectedContact.status,
        remarks: selectedContact.remarks,
        subject: selectedContact.subject
      });

      if (res?.data?.status === "SUCCESS") {
        // Update state locally
        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContact.queryId ? { ...c, ...selectedContact } : c
          )
        );

        setOpenEditModal(false);
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Error updating contact:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = (contact) => {
    setSelectedContact(contact);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await communication.deleteQuery({ queryIds: [selectedContact.id] });

      if (res?.data?.status === "SUCCESS") {
        setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
        setOpenDeleteModal(false);
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      
      
      <Card>
       
    <CardContent className="p-6 space-y-4">
       <p className="text-lg font-semibold">Query Management</p>

     
      <div className="flex items-center justify-between gap-2 w-full">
       
        <input
          type="text"
          placeholder="Search query..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchVideos();
            }
          }}
          className="border p-2 rounded-md w-1/3"
        />

       
        {totalPages > 0 && (
          <div className="flex items-center gap-2 text-sm pe-5">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ‹
            </Button>

            <span>
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              ›
            </Button>
          </div>
        )}
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left text-sm font-semibold">Sr. No</th>
              <th className="p-3 text-left text-sm font-semibold">Raised By</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Subject</th>
              <th className="p-3 text-left text-sm font-semibold">Message</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Raised Date</th>
              <th className="p-3 text-center text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm">{contact.name}</td>
                <td className="p-3 text-sm">{contact.email}</td>
                <td className="p-3 text-sm">{contact.subject}</td>
                <td className="p-3 text-sm max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  {expandedMessage === contact.id ? (
                    <>
                      <p className="whitespace-pre-wrap break-words">{contact.message}</p>
                      <button
                        className="text-blue-600 font-medium mt-1 hover:underline"
                        onClick={() => setExpandedMessage(null)}
                      >
                        Show Less
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="line-clamp-2 whitespace-pre-wrap break-words">
                        {contact.message}
                      </p>
                      {contact.message.length > 80 && (
                        <button
                          className="text-blue-600 font-medium mt-1 hover:underline"
                          onClick={() => setExpandedMessage(contact.id)}
                        >
                          Read More
                        </button>
                      )}
                    </>
                  )}
                </td>
                <td className="p-3 text-sm">
                  <Badge
                    className={
                      contact.status === "Pending"
                        ? "bg-red-100 text-red-800"
                        : contact.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {contact.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center flex items-center justify-center space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(contact)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(contact)}>
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>


      {/* Edit Modal */}
      {/* Edit Modal */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
  <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
    {/* Header */}
    <div
      className="text-white flex justify-between items-center px-4 py-2"
      style={{ backgroundColor: '#2ea984' }}
    >
      <h3 className="font-semibold text-lg">Edit Contact</h3>
      <button
        className="text-white text-xl font-bold"
        onClick={() => setOpenEditModal(false)}
      >
        ×
      </button>
    </div>

    {/* Body */}
    {selectedContact && (
      <div className="p-4 space-y-4">
        {/* Subject */}
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input
            type="text"
            value={selectedContact.subject}
            onChange={(e) =>
              setSelectedContact({ ...selectedContact, subject: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={selectedContact.message}
            onChange={(e) =>
              setSelectedContact({ ...selectedContact, message: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={selectedContact.status}
            onValueChange={(val) =>
              setSelectedContact({ ...selectedContact, status: val })
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Raised">Raised</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm font-medium">Remarks</label>
          <Textarea
            placeholder="Enter remarks..."
            value={selectedContact.remarks || ""}
            onChange={(e) =>
              setSelectedContact({ ...selectedContact, remarks: e.target.value })
            }
            className="mt-2"
            required
          />
        </div>
      </div>
    )}

    {/* Footer */}
    <DialogFooter className="flex justify-center gap-4 p-4">
      <Button
        variant="outline"
        onClick={() => setOpenEditModal(false)}
        className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
      >
        Cancel
      </Button>
      <Button
        style={{ backgroundColor: '#2ea984' }}
        className="hover:opacity-90 text-white"
        onClick={handleSave}
      >
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>



      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
  <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
    {/* Header */}
    <div
      className="text-white flex justify-between items-center px-4 py-2"
      style={{ backgroundColor: '#2ea984' }}
    >
      <h3 className="font-semibold text-lg">Confirm Delete</h3>
      <button
        className="text-white text-xl font-bold"
        onClick={() => setOpenDeleteModal(false)}
      >
        ×
      </button>
    </div>

    {/* Body */}
    <div className="p-4 text-center">
      <p className="text-gray-700">
        Are you sure you want to delete this contact?
      </p>
    </div>

    {/* Footer */}
    <DialogFooter className="flex justify-center gap-4 p-4">
      <Button
        variant="outline"
        onClick={() => setOpenDeleteModal(false)}
        className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
      >
        Cancel
      </Button>

      <Button
        style={{ backgroundColor: '#2ea984' }}
        className="hover:opacity-90 text-white"
        onClick={confirmDelete}
      >
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
