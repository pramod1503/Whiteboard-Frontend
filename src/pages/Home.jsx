
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Link } from '../lib/index.jsx'
import { 
  Plus, 
  ArrowRight, 
  Users, 
  Palette, 
  Zap, 
  Moon, 
  Sun, 
  Sparkles, 
  Play,
  Star,
  Globe,
  Shield,
  Rocket,
  Heart
} from 'lucide-react'
import { API } from '../api'

export default function Home({ theme, toggleTheme }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [roomIdInput, setRoomIdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [subtitleIndex, setSubtitleIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const subtitles = [
    'Draw together in real-time ✨',
    'Share ideas. Sketch. Iterate 🎨',
    'Collaborate from anywhere 🌍',
    'Create without limits 🚀'
  ]

  const features = [
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with unlimited team members',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero lag, instant sync, pure creative flow',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your creations',
      color: 'from-red-500 to-pink-500'
    }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % subtitles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [subtitles.length])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])



  const createRoom = async () => {
    if (!name.trim()) {
      alert('Please enter a room name')
      return
    }
    setLoading(true)
    try {
      const res = await API.post('/createRoom', { name })
      const id = res?.data?._id || res?.data?.id
      if (!id) throw new Error('No room id returned from server')
      navigate(`/room/${id}`)
    } catch (err) {
      console.error('createRoom error:', err)
      alert('Failed to create room. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const joinRoom = () => {
    if (!roomIdInput.trim()) {
      alert('Please enter a Room ID')
      return
    }
    navigate(`/room/${roomIdInput}`)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-fast"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-float-reverse"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
        </div>
        
        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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

      {/* Enhanced Theme Toggle */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="sm"
        className="absolute top-6 right-6 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/30 dark:border-slate-700/30 hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {theme === 'dark' ? 
          <Sun className="w-4 h-4 text-yellow-500" /> : 
          <Moon className="w-4 h-4 text-slate-600" />
        }
      </Button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-7xl">
          {/* Enhanced Hero Section */}
          <div className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${isVisible ? 'animate-hero-entrance' : 'opacity-0'}`}>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-white/30 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 mb-6 sm:mb-8 animate-badge-glow shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-sparkle" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                The future of collaborative design
              </span>
              <Star className="w-4 h-4 text-yellow-500 animate-spin-slow" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 leading-none flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-flow bg-300% animate-text-shimmer">
                Draw Freely, Collaborate Easily. 
              </span>
              <Palette className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-purple-500 animate-sparkle" />
            </h1>

            {/* Dynamic Subtitle */}
            <div className="h-8 sm:h-12 mb-8 sm:mb-12 flex items-center justify-center">
              <p className="text-lg sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-medium animate-subtitle-fade px-4">
                {subtitles[subtitleIndex]}
              </p>
            </div>

          </div>

          {/* Enhanced Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto mb-12 sm:mb-20">
            {/* Create Room Card */}
            <div className="group p-6 sm:p-10 bg-gradient-to-br from-white/70 to-white/50 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-4xl border border-white/30 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 animate-card-entrance">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    Create New Room
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Start your creative journey</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Input
                  placeholder="Enter room name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/20 backdrop-blur-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white/80 dark:focus:bg-white/15 transition-all duration-300 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-base sm:text-lg shadow-inner mobile-input"
                  maxLength={60}
                />

                <Button
                  onClick={createRoom}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group text-base sm:text-lg touch-target"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Creating Room...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="text-sm sm:text-base">Start Creating</span>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  )}
                </Button>

                {/* Features under Create Room */}
                <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10">
                  <div className="grid grid-cols-1 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Join Room Card */}
            <div className="group p-6 sm:p-10 bg-gradient-to-br from-white/70 to-white/50 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-4xl border border-white/30 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 animate-card-entrance" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl sm:rounded-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 dark:text-slate-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    Join Existing Room
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Connect with your team</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Input
                  placeholder="Paste room ID here"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="bg-white/60 dark:bg-white/10 border-white/40 dark:border-white/20 backdrop-blur-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white/80 dark:focus:bg-white/15 transition-all duration-300 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-base sm:text-lg shadow-inner mobile-input"
                />

                <Button
                  onClick={joinRoom}
                  variant="outline"
                  className="w-full bg-white/40 dark:bg-white/10 border-white/50 dark:border-white/20 text-slate-800 dark:text-slate-200 font-bold py-4 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-white/60 dark:hover:bg-white/15 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group backdrop-blur-sm text-base sm:text-lg touch-target"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-sm sm:text-base">Join Room</span>
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 text-red-500" />
                  </div>
                </Button>

                {/* Features under Join Room */}
                <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10">
                  <div className="grid grid-cols-1 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center animate-footer-fade" style={{ animationDelay: '1000ms' }}>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Collaborate instantly — no installation required
              </span>
              <Rocket className="w-5 h-5 text-blue-500 animate-bounce" />
            </div>
            
            <div className="flex items-center justify-center gap-12 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Lightning fast</span>
              </div>
              <div className="flex items-center gap-2 hover:text-green-500 transition-colors duration-300 cursor-pointer">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-500 transition-colors duration-300 cursor-pointer">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Global access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}