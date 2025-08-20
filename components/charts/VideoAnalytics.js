'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const videoData = [
  { category: 'Tech', uploads: 847, views: 1200000, revenue: 8400 },
  { category: 'Gaming', uploads: 1232, views: 2100000, revenue: 12300 },
  { category: 'Education', uploads: 542, views: 890000, revenue: 5600 },
  { category: 'Entertainment', uploads: 967, views: 1800000, revenue: 9800 },
  { category: 'Lifestyle', uploads: 623, views: 950000, revenue: 6200 },
  { category: 'Music', uploads: 389, views: 1400000, revenue: 7800 },
];

export function VideoAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Content Categories</CardTitle>
        <p className="text-sm text-muted-foreground">Video uploads and performance by category</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={videoData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="category" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(value) => value > 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'uploads') return [value.toLocaleString(), 'Uploads'];
                if (name === 'views') return [(value / 1000000).toFixed(1) + 'M', 'Views'];
                return [`$${value.toLocaleString()}`, 'Revenue'];
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="uploads" 
              fill="#10B981" 
              radius={[2, 2, 0, 0]}
              name="uploads"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}