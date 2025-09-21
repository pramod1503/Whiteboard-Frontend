import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";
import { API } from "../api";
import { 
  Palette, 
  Users, 
  Sparkles, 
  Copy, 
  Moon, 
  Sun,
  Zap,
  Heart,
  Star,
  Globe,
  Shield,
  Layers,
  PenTool,
  ArrowLeft,
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from '../lib/index.jsx';

export default function RoomPage({ theme, toggleTheme }) {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Check if current user is the creator
    const creatorId = localStorage.getItem(`creator_${id}`);
    setIsCreator(!!creatorId);
    
    (async () => {
      try {
        console.log(`Attempting to fetch room with ID: ${id}`);
        const res = await API.get(`/rooms/${id}`);
        console.log('Room data received:', res.data);
        setRoom(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        if (err.response?.status === 404) {
          alert("Room not found. The room may have been deleted or the ID is incorrect.");
        } else if (err.response?.status >= 500) {
          alert("Server error. Please try again later.");
        } else {
          alert("Failed to load room. Please check your connection and try again.");
        }
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const copyRoomId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteRoom = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      // Get creator ID from localStorage
      const creatorId = localStorage.getItem(`creator_${id}`);
      
      if (!creatorId) {
        alert('You are not the creator of this room. Only the creator can delete it.');
        setIsDeleting(false);
        return;
      }
      
      await API.delete(`/rooms/${id}`, {
        data: { creatorId: creatorId }
      });
      
      // Redirect to home page after successful deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete room:', error);
      if (error.response?.status === 403) {
        alert('Only the room creator can delete this room.');
      } else if (error.response?.status === 404) {
        // Room might have been automatically deleted, just redirect
        console.log('Room already deleted, redirecting to home');
        window.location.href = '/';
      } else {
        alert('Failed to delete room. Please try again.');
      }
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading || !room) {
    return (
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${theme === 'dark' ? 'dark' : ''}`}>
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
          {/* Dynamic Gradient Orbs */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-fast"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-float-particle ${
                  i % 3 === 0 ? 'w-1 h-1 bg-blue-400/30' :
                  i % 3 === 1 ? 'w-2 h-2 bg-purple-400/20' :
                  'w-1.5 h-1.5 bg-pink-400/25'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${8 + Math.random() * 12}s`
                }}
              ></div>
            ))}
          </div>

          {/* Interactive Mouse Glow */}
          <div
            className="absolute w-32 h-32 bg-gradient-radial from-blue-400/10 via-purple-400/5 to-transparent rounded-full pointer-events-none transition-all duration-500 ease-out"
            style={{
              left: mousePosition.x - 64,
              top: mousePosition.y - 64,
              transform: 'scale(1.2)'
            }}
          ></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center animate-hero-entrance">
            {/* Loading Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>

            {/* Loading Text */}
            <div className="space-y-4">
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-flow bg-300%">
                Loading Room
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 animate-pulse">
                Preparing your creative space...
              </p>
              
              {/* Loading Steps */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float-fast"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
        </div>
        
        {/* Subtle Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-float-particle ${
                i % 3 === 0 ? 'w-1 h-1 bg-blue-400/15' :
                i % 3 === 1 ? 'w-1.5 h-1.5 bg-purple-400/10' :
                'w-1 h-1 bg-pink-400/15'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            ></div>
          ))}
        </div>

        {/* Interactive Mouse Glow */}
        <div
          className="absolute w-24 h-24 bg-gradient-radial from-blue-400/5 via-purple-400/3 to-transparent rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x - 48,
            top: mousePosition.y - 48,
          }}
        ></div>
      </div>

      {/* Enhanced Room Header */}
      <div className={`relative z-20 transition-all duration-1000 ${isVisible ? 'animate-hero-entrance' : 'opacity-0'}`}>
        <div className="flex items-center justify-between p-2 sm:p-3 bg-white/70 dark:bg-white/5 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Back Button */}
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group touch-target"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 animate-sparkle" />
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium truncate">
                  Draw what is in your mind ✨
                </div>
                <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 animate-pulse" />
              </div>
              <div className="font-medium flex items-center gap-1 sm:gap-2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black text-sm sm:text-base truncate">
                  {room.name || "Untitled"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  - ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{id}</span>
                </span>
                <Button
                  onClick={copyRoomId}
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1 text-xs hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 group touch-target"
                >
                  {copied ? (
                    <Heart className="w-3 h-3 text-green-600 animate-pulse" />
                  ) : (
                    <Copy className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </Button>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isCreator && (
              <Button
                onClick={handleDeleteClick}
                variant="outline"
                size="sm"
                className="bg-red-500/20 dark:bg-red-500/10 backdrop-blur-md border-red-300/30 dark:border-red-500/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group hover:bg-red-500/30 dark:hover:bg-red-500/20 touch-target"
                title="Delete Room (Creator Only)"
              >
                <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            )}

            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/20 hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl touch-target"
            >
              {theme === 'dark' ? 
                <Sun className="w-4 h-4 text-yellow-500" /> : 
                <Moon className="w-4 h-4 text-slate-600" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Whiteboard Container */}
      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'animate-card-entrance' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
        <div className="h-[calc(100vh-80px)] sm:h-[calc(100vh-112px)] relative">
          {/* Whiteboard Background Enhancement */}
          <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            {/* Subtle grid pattern for whiteboard */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>
            </div>
          </div>

          {/* Whiteboard Component */}
          <div className="relative z-10 h-full">
            <Whiteboard roomId={id} theme={theme} />
          </div>
        </div>
      </div>

      {/* Floating Action Hints */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 animate-footer-fade" style={{ animationDelay: '800ms' }}>
        <div className="group p-2 sm:p-3 bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/30 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-sparkle" />
            </div>
            <div className="text-xs sm:text-sm">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Pro Tip</div>
              <div className="text-slate-500 dark:text-slate-400 hidden sm:block">Use Ctrl+Z to undo</div>
              <div className="text-slate-500 dark:text-slate-400 sm:hidden">Tap to draw</div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-card-entrance">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Delete Room
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                Are you sure you want to delete this room?
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <strong>Room:</strong> {room?.name || "Untitled"}<br />
                <strong>ID:</strong> {id}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelDelete}
                variant="outline"
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={deleteRoom}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Room
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
