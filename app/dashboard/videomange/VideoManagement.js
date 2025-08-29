'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { MoreHorizontal, Play, Trash2, CheckCircle, XCircle, } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { communication } from '@/services/communication';
import { FilterBar } from '@/components/common/FilterBar';

export function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const router = useRouter();

  const handlePreview = (id) => {
    setPlayingVideo(playingVideo === id ? null : id);
  };

  const handleSearch = (value) => {
    setSearchString(value);
    setPage(1);
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await communication.getVideoListForAdmin(page, searchString);

      if (res?.data?.status === 'SUCCESS') {
        toast.success(res.data.message, { position: 'top-right', autoClose: 3000 });
        setVideos(res.data.videos || []);
        setTotalPages(res.data.totalPages || 0);
      } else if (res?.data?.status === 'JWT_INVALID') {
        toast.error(res.data.message, { position: 'top-right', autoClose: 3000 });
        deleteCookie('auth');
        deleteCookie('userDetails');
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } else {
        toast.error(res?.data?.message || 'Failed to fetch videos', {
          position: 'top-right',
          autoClose: 3000,
        });
        setVideos([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching videos:', error.response?.data);

      const apiStatus = error.response?.data?.status;
      const message = error.response?.data?.message || 'Error fetching videos';

      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });

      if (apiStatus === 'JWT_INVALID') {
        deleteCookie('auth');
        deleteCookie('userDetails');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }

      setVideos([]);
      setTotalPages(0);
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

  const handleChangeStatus = async (videoId) => {
    try {
      const res = await communication.changeVideoStatus(videoId);

      if (res?.data?.status === "SUCCESS") {
        toast.success(res.data.message);

        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { ...v, isActive: !v.isActive } : v
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

  useEffect(() => {
    fetchVideos();
  }, [page, searchString]);

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold">Video Management</p>
      {/* Search Box */}
      <div className="sticky top-0 z-20 bg-white">
        <FilterBar
          showSearch
          searchPlaceholder="Search Video..."
          onSearchChange={handleSearch}
        />
      </div>

      {/* Loading State */}
      {loading && <p className="text-center">Loading videos...</p>}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <p className="text-center">No videos found.</p>
      )}

      {/* Videos Grid (scroll only inside this grid area) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100dvh-14rem)] pr-1">
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

              {/* Status Badge Left Side */}
              <div className="absolute top-2 left-2">
                <Badge
                  className={`${video.isActive ? 'bg-green-500' : 'bg-red-500'
                    } border-2 border-white shadow-lg text-white px-3 py-1 rounded-[30px]`}
                >
                  {video.isActive ? 'Enable' : 'Disable'}
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

                    {video.isActive ? (
                      <DropdownMenuItem
                        className="text-gray-600"
                        onClick={() => handleChangeStatus(video.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Disable
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-gray-600"
                        onClick={() => handleChangeStatus(video.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enable
                      </DropdownMenuItem>
                    )}

                    {/* Delete with Modal */}
                    <DropdownMenuItem
                      className="text-gray-600"
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
        <DialogContent className="p-0 overflow-hidden rounded-lg max-w-lg w-full">
          {/* Header */}
          <div
            className="text-white flex justify-between items-center px-4 py-2"
            style={{ backgroundColor: '#2ea984' }}
          >
            <h3 className="font-semibold text-lg">Confirm Delete</h3>
            <button
              className="text-white text-xl font-bold"
              onClick={() => setDeleteModalOpen(false)}
            >
            </button>
          </div>

          {/* Body */}
          <div className="p-4 text-center">
            <p className="text-gray-700">Are you sure you want to delete this video?</p>
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-center gap-4 p-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-[#565e64] text-[#565e64] hover:bg-[#565e64] hover:text-white"
            >
              Cancel
            </Button>

            <Button
              style={{ backgroundColor: '#2ea984' }}
              className="hover:opacity-90 text-white"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
