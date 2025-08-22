'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Play,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { communication } from '@/services/communication';

export function VideoManagement() {
const [videos, setVideos] = useState([]);
const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await communication.getVideoListForAdmin(page, searchString);
      if (res?.data?.status === 'SUCCESS') {
        setVideos(res.data.videos || []); // 👈 API mein `videos` array hai
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, searchString]);

  const handlePreview = (id) => {
  setPlayingVideo(playingVideo === id ? null : id);
};

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchVideos();
            }
          }}
          className="border p-2 rounded-md w-1/3"
        />
      </div>

      {/* Loading State */}
      {loading && <p className="text-center">Loading videos...</p>}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <p className="text-center">No videos found.</p>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              {playingVideo === video.id ? (
                <iframe
                  className="w-full h-full"
                  src={`${video.videoUrl}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={`https://img.youtube.com/vi/${new URL(video.videoUrl).searchParams.get("v")}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="absolute top-2 left-2">
                <Badge
                  className={
                    video.status === 'uploaded'
                      ? 'bg-yellow-500'
                      : video.status === 'approved'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }
                >
                  {video.status}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Watch Times: <span className="font-medium">{video.watchTimes}</span></span>
                  <span>Cost: <span className="text-green-600 font-medium">{video.cost}</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Play Seconds: <span className="font-medium">{video.playSeconds}</span></span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(video.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {playingVideo === video.id ? 'Stop' : 'Preview'}
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
                    {video.status === 'uploaded' && (
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
