'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Users,
  Video,
  TrendingUp,
  Eye,
  PlayCircle,
  Clock,
  AlertCircle,
  Coins,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { VideoAnalytics } from '@/components/charts/VideoAnalytics';

const statsData = [
  {
    title: 'Total Revenue',
    value: '$48,392',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Total Videos',
    value: '15,632',
    change: '+23.1%',
    trend: 'up',
    icon: Video,
    color: 'text-purple-600',
  },
  {
    title: 'Coins Distributed',
    value: '124.5K',
    change: '+15.3%',
    trend: 'up',
    icon: Coins,
    color: 'text-yellow-600',
  },
];

const recentActivities = [
  { id: 1, type: 'video', title: 'New video uploaded', user: 'TechGuru', time: '2 min ago', status: 'pending' },
  { id: 2, type: 'transaction', title: 'Coin purchase completed', user: 'GameMaster', time: '5 min ago', status: 'completed' },
  { id: 3, type: 'contact', title: 'Support ticket created', user: 'UserName', time: '10 min ago', status: 'new' },
  { id: 4, type: 'user', title: 'New user registered', user: 'NewCreator', time: '15 min ago', status: 'active' },
];

const quickStats = [
  { label: 'Pending Approvals', value: '23', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Active Transactions', value: '156', color: 'bg-green-100 text-green-800' },
  { label: 'Support Tickets', value: '8', color: 'bg-red-100 text-red-800' },
  { label: 'New Users Today', value: '42', color: 'bg-blue-100 text-blue-800' },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your platform's performance and key metrics</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Export Report</Button>
          <Button className="bg-green-500 hover:bg-green-600">View Analytics</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
              <Badge className={stat.color}>{stat.value}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <VideoAnalytics />
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {activity.type === 'video' && <Video className="w-4 h-4 text-green-600" />}
                    {activity.type === 'transaction' && <CreditCard className="w-4 h-4 text-green-600" />}
                    {activity.type === 'contact' && <MessageSquare className="w-4 h-4 text-green-600" />}
                    {activity.type === 'user' && <Users className="w-4 h-4 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                  </div>
                </div>
                <Badge 
                  className={
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'new' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}