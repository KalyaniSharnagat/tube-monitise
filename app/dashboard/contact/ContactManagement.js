'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MessageSquare,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Reply,
  Archive,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const contactStats = [
  {
    title: 'Total Contacts',
    value: '1,247',
    change: '+8.5%',
    trend: 'up',
    icon: MessageSquare,
  },
  {
    title: 'Open Tickets',
    value: '23',
    change: '-12.3%',
    trend: 'down',
    icon: AlertCircle,
  },
  {
    title: 'Resolved Today',
    value: '45',
    change: '+15.7%',
    trend: 'up',
    icon: CheckCircle,
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    change: '-8.2%',
    trend: 'down',
    icon: Clock,
  },
];

const contacts = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Video Upload Issue',
    message: 'I am having trouble uploading my video. It keeps failing at 50% progress.',
    category: 'Technical',
    priority: 'High',
    status: 'Open',
    date: '2024-03-20 14:30',
    assignedTo: 'Support Team'
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    subject: 'Payment Not Processed',
    message: 'My coin purchase payment was deducted but coins were not added to my account.',
    category: 'Billing',
    priority: 'High',
    status: 'In Progress',
    date: '2024-03-20 13:45',
    assignedTo: 'John Smith'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'Account Verification',
    message: 'I need help with verifying my creator account. Documents were submitted but no response.',
    category: 'Account',
    priority: 'Medium',
    status: 'Open',
    date: '2024-03-20 12:20',
    assignedTo: 'Support Team'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    subject: 'Feature Request',
    message: 'Can you add a dark mode option to the mobile app?',
    category: 'Feature',
    priority: 'Low',
    status: 'Resolved',
    date: '2024-03-19 16:15',
    assignedTo: 'Product Team'
  }
];

export function ContactManagement({ currentPage, setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Management</h1>
          <p className="text-muted-foreground">Manage customer support tickets and inquiries</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Badge
                        variant={stat.trend === 'up' ? 'default' : 'destructive'}
                        className={`text-xs ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground">from last week</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="ml-11">
                      <h4 className="font-medium mb-1">{contact.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{contact.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {contact.date}
                        </span>
                        <span>Assigned to: {contact.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        contact.category === 'Technical' ? 'border-blue-200 text-blue-700' :
                        contact.category === 'Billing' ? 'border-green-200 text-green-700' :
                        contact.category === 'Account' ? 'border-purple-200 text-purple-700' :
                        'border-orange-200 text-orange-700'
                      }>
                        {contact.category}
                      </Badge>
                      <Badge className={
                        contact.priority === 'High' ? 'bg-red-100 text-red-800' :
                        contact.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {contact.priority}
                      </Badge>
                    </div>
                    <Badge className={
                      contact.status === 'Open' ? 'bg-red-100 text-red-800' :
                      contact.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {contact.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Reply to {contact.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h4 className="font-medium mb-2">{contact.subject}</h4>
                              <p className="text-sm text-muted-foreground">{contact.message}</p>
                            </div>
                            <Textarea placeholder="Type your reply..." rows={6} />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Save Draft</Button>
                              <Button className="bg-green-500 hover:bg-green-600">Send Reply</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}