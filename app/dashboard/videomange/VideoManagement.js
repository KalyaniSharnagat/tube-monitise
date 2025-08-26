'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Play,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { communication } from '@/services/communication';
import { toast } from 'react-hot-toast';

export function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await communication.getVideoListForAdmin(page, searchString);
      if (res?.data?.status === 'SUCCESS') {
        setVideos(res.data.videos || []);
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

  const getYoutubeEmbedUrl = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      const pathname = new URL(url).pathname;
      if (pathname) {
        return `https://www.youtube.com/embed/${pathname.replace("/", "")}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, searchString]);

  const handlePreview = (id) => {
    setPlayingVideo(playingVideo === id ? null : id);
  };

  // ✅ Change Status Handler
  // ✅ Change Status Handler
  const handleChangeStatus = async (videoId, newStatus) => {
    try {
      const res = await communication.changeVideoStatus(videoId, newStatus);

      if (res?.data?.status === "SUCCESS") {
        toast.success(`Video ${newStatus} successfully`);

        // ✅ Local update without refetch
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { ...v, status: newStatus } : v
          )
        );
      } else {
        toast.error(res?.data?.message || "Failed to change status");
      }
    } catch (err) {
      toast.error("Error changing status");
    }
  };


  const handleDeleteConfirm = async () => {
    try {
      if (!selectedVideoId) return;
      const res = await communication.deleteVideo([selectedVideoId]);
      if (res?.data?.status === 'SUCCESS') {
        toast.success('Video deleted successfully');
        fetchVideos();
      } else {
        toast.error(res?.data?.message || 'Failed to delete video');
      }
    } catch (err) {
      toast.error('Error deleting video');
    } finally {
      setDeleteModalOpen(false);
      setSelectedVideoId(null);
    }
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
                  src={`${getYoutubeEmbedUrl(video.videoUrl)}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={`https://img.youtube.com/vi/${new URL(getYoutubeEmbedUrl(video.videoUrl)).pathname.split("/").pop()}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* ✅ Status Button on Thumbnail */}
              {/* <div className="absolute top-2 ps-2">
                {video.status === "active" ? (
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleChangeStatus(video.id, "inactive")}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleChangeStatus(video.id, "active")}
                  >
                    Enable
                  </Button>
                )}
              </div> */}



              {/* Status Badge Left Side */}
              <div className="absolute top-2 left-2">
                <Badge
                  className={
                    video.status === 'active'
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
                  <span>User: <span className="font-medium">{video.userName}</span></span>
                  <span>Email: <span className="font-medium">{video.userEmail}</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Watch Times: <span className="font-medium">{video.watchTimes}</span> times</span>
                  <span>Cost: ₹<span className="text-green-600 font-medium">{video.cost}</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Play Seconds: <span className="font-medium">{video.playSeconds}</span> sec</span>
                  <span>Created Date: <span>{new Date(video.createdAt).toLocaleDateString()}</span></span>
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
                    
                      {video.status === "active" ? (
                        
                        <DropdownMenuItem
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleChangeStatus(video.id, " Disable")}
                          
                        >
                           <XCircle className="w-4 h-4 mr-2" />
                          Disable
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          size="sm"
                         className="text-red-600"
                          onClick={() => handleChangeStatus(video.id, " Enable")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enable
                        </DropdownMenuItem>
                      )}
                    
                    {/* Delete with Modal */}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedVideoId(video.id);
                        setDeleteModalOpen(true);
                      }}
                    >
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this video?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
