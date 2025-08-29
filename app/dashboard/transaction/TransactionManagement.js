'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const transactionStats = [
  {
    title: 'Total Transactions',
    value: '15,847',
    change: '+12.5%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    title: 'Total Revenue',
    value: '$48,392',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Successful Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle,
  },
  {
    title: 'Pending Amount',
    value: '$2,847',
    change: '-15.3%',
    trend: 'down',
    icon: Clock,
  },
];

const transactions = [
  {
    id: 'TXN001',
    user: 'John Doe',
    type: 'Coin Purchase',
    amount: '$9.99',
    coins: 1000,
    method: 'Credit Card',
    status: 'Completed',
    date: '2024-03-20 14:30:25',
    reference: 'REF123456'
  },
  {
    id: 'TXN002',
    user: 'Sarah Wilson',
    type: 'Creator Payout',
    amount: '$125.50',
    coins: 0,
    method: 'Bank Transfer',
    status: 'Pending',
    date: '2024-03-20 14:25:18',
    reference: 'REF123457'
  },
  {
    id: 'TXN003',
    user: 'Mike Johnson',
    type: 'Subscription',
    amount: '$19.99',
    coins: 0,
    method: 'PayPal',
    status: 'Completed',
    date: '2024-03-20 14:20:42',
    reference: 'REF123458'
  },
  {
    id: 'TXN004',
    user: 'Emily Davis',
    type: 'Coin Purchase',
    amount: '$4.99',
    coins: 500,
    method: 'Credit Card',
    status: 'Failed',
    date: '2024-03-20 14:15:33',
    reference: 'REF123459'
  },
  {
    id: 'TXN005',
    user: 'Alex Brown',
    type: 'Refund',
    amount: '-$9.99',
    coins: -1000,
    method: 'Credit Card',
    status: 'Processing',
    date: '2024-03-20 14:10:15',
    reference: 'REF123460'
  }
];

export function TransactionManagement({ currentPage, setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Management</h1>
          <p className="text-muted-foreground">Monitor and manage all platform transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transactionStats.map((stat, index) => {
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
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
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
              <Input placeholder="Search transactions..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Coin Purchase</SelectItem>
                <SelectItem value="payout">Creator Payout</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Transaction ID</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 font-mono text-sm">{transaction.id}</td>
                    <td className="p-4 font-medium">{transaction.user}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'Coin Purchase' && <CreditCard className="w-4 h-4 text-blue-600" />}
                        {transaction.type === 'Creator Payout' && <DollarSign className="w-4 h-4 text-green-600" />}
                        {transaction.type === 'Subscription' && <RefreshCw className="w-4 h-4 text-purple-600" />}
                        {transaction.type === 'Refund' && <XCircle className="w-4 h-4 text-red-600" />}
                        <span className="text-sm">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className={`font-medium ${transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {transaction.amount}
                        </span>
                        {transaction.coins !== 0 && (
                          <div className="text-xs text-muted-foreground">
                            {transaction.coins > 0 ? '+' : ''}{transaction.coins} coins
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{transaction.method}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            transaction.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                      }>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{transaction.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}