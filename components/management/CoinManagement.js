'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus,
  Gift,
  Settings,
  Download,
  DollarSign
} from 'lucide-react';

const coinStats = [
  {
    title: 'Total Coins in Circulation',
    value: '2.4M',
    change: '+15.3%',
    trend: 'up',
    icon: Coins,
  },
  {
    title: 'Coins Purchased Today',
    value: '12.5K',
    change: '+8.7%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Coins Spent Today',
    value: '8.2K',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    title: 'Revenue from Coins',
    value: '$24,580',
    change: '+12.4%',
    trend: 'up',
    icon: DollarSign,
  },
];

const coinPackages = [
  { id: 1, name: 'Starter Pack', coins: 100, price: '$0.99', popular: false },
  { id: 2, name: 'Popular Pack', coins: 500, price: '$4.99', popular: true },
  { id: 3, name: 'Premium Pack', coins: 1000, price: '$9.99', popular: false },
  { id: 4, name: 'Ultimate Pack', coins: 5000, price: '$39.99', popular: false },
];

const recentTransactions = [
  {
    id: 1,
    user: 'John Doe',
    type: 'Purchase',
    amount: 500,
    value: '$4.99',
    date: '2024-03-20 14:30',
    status: 'Completed'
  },
  {
    id: 2,
    user: 'Sarah Wilson',
    type: 'Spent',
    amount: -50,
    value: 'Video Tip',
    date: '2024-03-20 14:25',
    status: 'Completed'
  },
  {
    id: 3,
    user: 'Mike Johnson',
    type: 'Reward',
    amount: 100,
    value: 'Daily Bonus',
    date: '2024-03-20 14:20',
    status: 'Completed'
  },
  {
    id: 4,
    user: 'Emily Davis',
    type: 'Purchase',
    amount: 1000,
    value: '$9.99',
    date: '2024-03-20 14:15',
    status: 'Pending'
  }
];

export function CoinManagement({ currentPage, setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coin Management</h1>
          <p className="text-muted-foreground">Manage platform coins, packages, and transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Settings className="w-4 h-4 mr-2" />
            Coin Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinStats.map((stat, index) => {
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
                      <span className="text-xs text-muted-foreground">from yesterday</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coin Packages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Coin Packages</CardTitle>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coinPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-green-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Coins className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">{pkg.coins}</p>
                  <p className="text-sm text-muted-foreground mb-4">coins</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">{pkg.price}</p>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline" size="sm">
                      Edit Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Recent Coin Transactions</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Value</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 font-medium">{transaction.user}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'Purchase' && <Plus className="w-4 h-4 text-green-600" />}
                        {transaction.type === 'Spent' && <Minus className="w-4 h-4 text-red-600" />}
                        {transaction.type === 'Reward' && <Gift className="w-4 h-4 text-blue-600" />}
                        <span>{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{transaction.value}</td>
                    <td className="p-4 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="p-4">
                      <Badge className={
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }>
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coin Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Coin Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Purchased Coins</span>
              <span className="text-sm text-muted-foreground">1.8M (75%)</span>
            </div>
            <Progress value={75} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reward Coins</span>
              <span className="text-sm text-muted-foreground">480K (20%)</span>
            </div>
            <Progress value={20} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Promotional Coins</span>
              <span className="text-sm text-muted-foreground">120K (5%)</span>
            </div>
            <Progress value={5} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}