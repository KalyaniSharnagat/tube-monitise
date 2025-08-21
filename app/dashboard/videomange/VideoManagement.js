'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Upload, 
  Download,
  Play,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const videos = [
  {
    id: 1,
    title: 'Complete React Tutorial for Beginners',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'TechGuru',
    duration: '45:32',
    views: 125000,
    likes: 8500,
    status: 'Published',
    uploadDate: '2024-03-15',
    revenue: '$1,250',
    category: 'Education'
  },
  {
    id: 2,
    title: 'Amazing Cooking Tips and Tricks',
    thumbnail: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'ChefMaster',
    duration: '28:15',
    views: 89000,
    likes: 6200,
    status: 'Pending',
    uploadDate: '2024-03-18',
    revenue: '$890',
    category: 'Lifestyle'
  },
  {
    id: 3,
    title: 'Travel Vlog: Exploring Japan',
    thumbnail: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'Wanderlust',
    duration: '32:18',
    views: 156000,
    likes: 12000,
    status: 'Published',
    uploadDate: '2024-03-12',
    revenue: '$1,560',
    category: 'Travel'
  },
  {
    id: 4,
    title: 'Gaming Review: Latest RPG',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'GameMaster',
    duration: '22:45',
    views: 78000,
    likes: 5400,
    status: 'Rejected',
    uploadDate: '2024-03-20',
    revenue: '$0',
    category: 'Gaming'
  },
  {
    id: 5,
    title: 'Gaming Review: Latest RPG',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'GameMaster',
    duration: '22:45',
    views: 78000,
    likes: 5400,
    status: 'Rejected',
    uploadDate: '2024-03-20',
    revenue: '$0',
    category: 'Gaming'
  },
  {
    id: 6,
    title: 'Gaming Review: Latest RPG',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'GameMaster',
    duration: '22:45',
    views: 78000,
    likes: 5400,
    status: 'Rejected',
    uploadDate: '2024-03-20',
    revenue: '$0',
    category: 'Gaming'
  },
{
    id: 6,
    title: 'Gaming Review: Latest RPG',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    creator: 'GameMaster',
    duration: '22:45',
    views: 78000,
    likes: 5400,
    status: 'Rejected',
    uploadDate: '2024-03-20',
    revenue: '$0',
    category: 'Gaming'
  },

];

export function VideoManagement({ currentPage, setCurrentPage }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Video Management</h1>
          <p className="text-muted-foreground">Manage video content, approvals, and monetization</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search videos..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={
                  video.status === 'Published' ? 'bg-green-500' :
                  video.status === 'Pending' ? 'bg-yellow-500' :
                  'bg-red-500'
                }>
                  {video.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Creator: {video.creator}</span>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>{video.likes.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Revenue: <span className="text-green-600 font-medium">{video.revenue}</span></span>
                  <span>{video.uploadDate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Video
                    </DropdownMenuItem>
                    {video.status === 'Pending' && (
                      <>
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}