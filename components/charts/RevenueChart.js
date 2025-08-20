'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 32000, creators: 28000, platform: 4000 },
  { month: 'Feb', revenue: 35500, creators: 31200, platform: 4300 },
  { month: 'Mar', revenue: 42000, creators: 37800, platform: 4200 },
  { month: 'Apr', revenue: 38700, creators: 34500, platform: 4200 },
  { month: 'May', revenue: 45200, creators: 40800, platform: 4400 },
  { month: 'Jun', revenue: 48392, creators: 43200, platform: 5192 },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Platform and creator earnings over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Total Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="creators" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              name="Creator Earnings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}