import React, { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import { io } from "socket.io-client";
import { API } from "../api";


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://whiteboard-backend-oryh.onrender.com";
const socket = io(SOCKET_URL, { autoConnect: true });

export default function Whiteboard({ roomId, theme }){
  const [lines, setLines] = useState([]); // array of strokes; each stroke is array of points {x,y}
  const [history, setHistory] = useState([[]]); // Stores past states of lines
  const [historyStep, setHistoryStep] = useState(0); // Current position in history
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [userSelectedColor, setUserSelectedColor] = useState(false);
  const [colorPickerKey, setColorPickerKey] = useState(0);
  const [isBrave, setIsBrave] = useState(false);
  const [showBraveWarning, setShowBraveWarning] = useState(true);
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const [activeUsersCount, setActiveUsersCount] = useState(0);

  // Initialize and update stroke color based on theme (only if user hasn't selected a color)
  useEffect(() => {
    if (!userSelectedColor) {
      const defaultDarkColor = "#ffffff";
      const defaultLightColor = "#000000";
      
      console.log('Theme changed to:', theme, 'Setting color to:', theme === "dark" ? defaultDarkColor : defaultLightColor);
      
      if (theme === "dark") {
        setStrokeColor(defaultDarkColor);
      } else {
        setStrokeColor(defaultLightColor);
      }
      // Force re-render of color picker
      setColorPickerKey(prev => prev + 1);
    }
  }, [theme, userSelectedColor]);

  useEffect(() => {
    const checkBrave = async () => {
      if (navigator.brave && await navigator.brave.isBrave()) {
        setIsBrave(true);
      }
    };
    checkBrave();
  }, []);


  useEffect(()=>{
    let mounted = true;
    (async()=>{
      try{
        const res = await API.get(`/rooms/${roomId}`);
        const state = res.data.whiteboardState || [];
        // convert to arrays of points (already stored as points)
        if(mounted){
          const loadedLines = state.map(line => line.points || []);
          setLines(loadedLines);
          setHistory([loadedLines]); 
          setHistoryStep(0);
        }
      }catch(err){
        console.error("Failed to fetch room state", err);
      }
    })();
    return ()=>{ mounted = false; };
  }, [roomId]);

  // socket listeners
  useEffect(()=>{
    socket.emit("join-room", { roomId });

    socket.on("receive-drawing", (lineData) => {
      setLines(prev => {
        const newLines = [...prev.slice(0, prev.length - 1), lineData];
        setHistory(oldHistory => [...oldHistory.slice(0, historyStep + 1), newLines]);
        setHistoryStep(oldHistoryStep => oldHistoryStep + 1);
        return newLines;
      });
    });

    
    socket.on("load-state", (state) => {
      const loadedLines = state.map(line => line.points || []);
      setLines(loadedLines);
      setHistory([loadedLines]);
      setHistoryStep(0);
    });

    // Listen for undo/redo events from other clients
    socket.on("undo-redo-receive", (state) => {
      const loadedLines = state.map(line => line.points || []);
      setLines(loadedLines);
      
    });

    // Listen for active users count
    socket.on("active-users", (count) => {
      setActiveUsersCount(count);
    });

    // Listen for clear board events from other clients
    socket.on("clear-board-receive", () => {
      setLines([]);
      setHistory([[]]);
      setHistoryStep(0);
    });

    return () => {
      socket.off("receive-drawing");
      socket.off("load-state");
      socket.off("undo-redo-receive");
      socket.off("active-users");
      socket.off("clear-board-receive");
      socket.emit("leave-room", { roomId });
    };
  }, [roomId]);

  // helpers
  const getPointerPos = (stage, e) => {
    // works for touch and mouse
    return stage.getPointerPosition();
  };

  const handlePointerDown = (e) => {
    const stage = stageRef.current;
    if(!stage) return;
    isDrawing.current = true;
    const pos = getPointerPos(stage, e);
    if(!pos) return;
    console.log('Starting new stroke with color:', strokeColor, 'userSelectedColor:', userSelectedColor);
    setLines(prev => [...prev, [{...pos, stroke: strokeColor, strokeWidth: strokeWidth}]]);
    // Only start a new stroke, history will be updated on pointer up
  };

  const handlePointerMove = (e) => {
    if(!isDrawing.current) return;
    const stage = stageRef.current;
    if(!stage) return;
    const pos = getPointerPos(stage, e);
    if(!pos) return;

    setLines(prev => {
      const newLines = prev.slice();
      const last = newLines[newLines.length - 1];
      // Only add position data, stroke color and width are stored in the first point
      last.push({...pos});
      // Broadcast only the incremental line data during drawing
      socket.emit("drawing-data", { roomId, line: last });
      return newLines;
    });
  };

  const handlePointerUp = async () => {
    isDrawing.current = false;
    // Save full state to history only after a stroke is completed
    setHistory(prev => [...prev.slice(0, historyStep + 1), lines]);
    setHistoryStep(prev => prev + 1);

    try {
      const payload = lines.map(stroke => ({ points: stroke }));
      // Emit the full state after a stroke is complete for other clients to sync
      socket.emit("save-state", { roomId, whiteboardState: payload });
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      const newHistoryStep = historyStep - 1;
      setHistoryStep(newHistoryStep);
      setLines(history[newHistoryStep]);
      socket.emit("undo-redo", { roomId, state: history[newHistoryStep] });
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newHistoryStep = historyStep + 1;
      setHistoryStep(newHistoryStep);
      setLines(history[newHistoryStep]);
      socket.emit("undo-redo", { roomId, state: history[newHistoryStep] });
    }
  };

  const clearBoard = () => {
    if (window.confirm("Are you sure you want to clear the entire whiteboard? This action cannot be undone.")) {
      setLines([]);
      setHistory([[]]);
      setHistoryStep(0);
      // Broadcast clear action to other clients
      socket.emit("clear-board", { roomId });
      // Save empty state to backend
      socket.emit("save-state", { roomId, whiteboardState: [] });
    }
  };

  // Get responsive dimensions
  const getStageDimensions = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    if (isMobile) {
      return {
        width: window.innerWidth - 32, // Account for padding
        height: window.innerHeight * 0.6 // Smaller height on mobile
      };
    } else if (isTablet) {
      return {
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.7
      };
    } else {
      return {
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.8
      };
    }
  };

  const [stageDimensions, setStageDimensions] = useState(getStageDimensions());

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setStageDimensions(getStageDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mobile-whiteboard">
      {/* Enhanced Whiteboard Controls */}
      <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        theme === "dark" 
          ? "bg-white/5 border-white/10 shadow-2xl" 
          : "bg-white/70 border-white/30 shadow-xl"
      }`}>
        {/* Action Buttons Row - Mobile Responsive */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4">
          {/* Undo Button */}
          <button
            onClick={undo}
            disabled={historyStep === 0}
            className={`group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 touch-target ${
              historyStep === 0
                ? theme === "dark"
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* Redo Button */}
          <button
            onClick={redo}
            disabled={historyStep === history.length - 1}
            className={`group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 touch-target ${
              historyStep === history.length - 1
                ? theme === "dark"
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <span className="hidden sm:inline">Redo</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          {/* Clear Board Button */}
          <button
            onClick={clearBoard}
            className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl touch-target"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Drawing Tools Row - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {/* Color Picker Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <label htmlFor="colorPicker" className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl ${
              theme === "dark" 
                ? "bg-slate-800/50 border border-slate-700 text-slate-300" 
                : "bg-white/50 border border-gray-200 text-slate-700"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2" />
              </svg>
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Color:</span>
            </label>
            <input
              id="colorPicker"
              type="color"
              value={strokeColor}
              onChange={(e) => {
                const newColor = e.target.value;
                console.log('Color picker changed to:', newColor);
                setStrokeColor(newColor);
                setUserSelectedColor(true);
                console.log('User selected color, strokeColor is now:', newColor);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white/30 dark:border-slate-600 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 touch-target"
              style={{ 
                background: `linear-gradient(45deg, ${strokeColor} 0%, ${strokeColor} 100%)`,
                boxShadow: `0 0 20px ${strokeColor}40`
              }}
            />
            <span className={`text-xs font-mono px-2 py-1 rounded-lg hidden sm:inline ${
              theme === "dark" 
                ? "bg-slate-800/50 text-slate-300" 
                : "bg-gray-100/50 text-slate-600"
            }`}>
              {strokeColor}
            </span>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className={`w-px h-8 hidden sm:block ${
            theme === "dark" ? "bg-slate-600" : "bg-gray-300"
          }`}></div>

          {/* Size Control Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl ${
              theme === "dark" 
                ? "bg-slate-800/50 border border-slate-700" 
                : "bg-white/50 border border-gray-200"
            }`}>
              <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className={`text-xs sm:text-sm font-medium ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              }`}>Size</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                id="strokeSize"
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className={`w-24 sm:w-32 h-2 rounded-lg appearance-none cursor-pointer touch-target ${
                  theme === "dark" 
                    ? "bg-slate-700 slider-dark" 
                    : "bg-gray-200 slider-light"
                }`}
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(strokeWidth / 20) * 100}%, ${theme === "dark" ? "#374151" : "#e5e7eb"} ${(strokeWidth / 20) * 100}%, ${theme === "dark" ? "#374151" : "#e5e7eb"} 100%)`
                }}
              />
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm ${
                theme === "dark" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              } shadow-lg`}>
                {strokeWidth}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`text-center mb-4 ${theme === "dark" ? "text-[var(--color-room-info-text-dark)]" : "text-[var(--color-room-info-text-light)]"}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base">Active Users: {activeUsersCount}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm hidden sm:inline">Drawing Color:</span>
            <div 
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 dark:border-slate-600 shadow-lg"
              style={{ 
                backgroundColor: strokeColor,
                boxShadow: `0 0 10px ${strokeColor}60`
              }}
            ></div>
            <span className="text-xs font-mono hidden sm:inline">{strokeColor}</span>
          </div>
        </div>
      </div>
      {isBrave && showBraveWarning && (
        <div
          className={`flex justify-between items-center p-2 rounded-md mb-4 ${theme === "dark" ? "bg-yellow-600 text-white" : "bg-yellow-200 text-yellow-800"}`}
        >
          <span>It looks like you're using Brave. For the best experience, please disable Brave Shields for this site.</span>
          <button
            onClick={() => setShowBraveWarning(false)}
            className={`ml-4 text-lg font-bold ${theme === "dark" ? "text-white" : "text-yellow-800"}`}
          >
            &times;
          </button>
        </div>
      )}
      <Stage
        width={stageDimensions.width}
        height={stageDimensions.height}
        onMouseDown={handlePointerDown}
        onMousemove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        ref={stageRef}
        style={{
          border: `1px solid ${theme === "dark" ? "var(--color-border-dark)" : "var(--color-border-light)"}`,
          borderRadius: "4px",
          backgroundColor: theme === "dark" ? "var(--color-input-bg-dark)" : "var(--color-input-bg-light)",
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.flatMap(p => [p.x, p.y])}
              stroke={line[0]?.stroke || strokeColor}
              strokeWidth={line[0]?.strokeWidth || 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
