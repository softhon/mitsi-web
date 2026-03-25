import { useState, useEffect, useRef } from 'react';
import { useConnectionQuality } from '@/hooks/use-connection-quality';
import { usePeerCount } from '@/store/conf/hooks';
import { Activity, Wifi, Users, Gauge } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  bandwidth: number;
  consumers: number;
  renderTime: number;
  quality: string;
}

/**
 * Performance monitoring dashboard for debugging
 * Only shown in development or with ?debug=true query parameter
 */
const PerformanceMonitor = () => {
  const connectionStats = useConnectionQuality();
  const peerCount = usePeerCount();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    bandwidth: 0,
    consumers: 0,
    renderTime: 0,
    quality: 'good',
  });
  const [isVisible, setIsVisible] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const renderStartTime = useRef(Date.now());

  // Check if debug mode is enabled
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugEnabled =
      import.meta.env.DEV || urlParams.get('debug') === 'true';
    setIsVisible(debugEnabled);
  }, []);

  // FPS Counter
  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;

    const measureFPS = () => {
      frameCount.current++;
      const now = Date.now();
      const elapsed = now - lastTime.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);
        frameCount.current = 0;
        lastTime.current = now;

        setMetrics(prev => ({ ...prev, fps }));
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Update metrics
  useEffect(() => {
    if (!isVisible) return;

    const renderTime = Date.now() - renderStartTime.current;

    setMetrics(prev => ({
      ...prev,
      bandwidth: connectionStats.bandwidth,
      consumers: peerCount - 1, // Exclude self
      renderTime: Math.min(renderTime, 999),
      quality: connectionStats.quality,
    }));

    renderStartTime.current = Date.now();
  }, [connectionStats, peerCount, isVisible]);

  // Keyboard shortcut: Ctrl+Shift+D to toggle
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-blue-400';
      case 'fair':
        return 'text-yellow-400';
      case 'poor':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 right-4 bg-black/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl z-50 min-w-[280px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 className="text-sm font-bold text-white/90">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white/90 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-2">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/70">FPS</span>
          </div>
          <span
            className={`text-sm font-mono font-bold ${getFpsColor(metrics.fps)}`}
          >
            {metrics.fps}
          </span>
        </div>

        {/* Bandwidth */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/70">Bandwidth</span>
          </div>
          <span className="text-sm font-mono font-bold text-blue-400">
            {metrics.bandwidth.toFixed(2)} MB/s
          </span>
        </div>

        {/* Connection Quality */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/70">Quality</span>
          </div>
          <span
            className={`text-sm font-mono font-bold capitalize ${getQualityColor(metrics.quality)}`}
          >
            {metrics.quality}
          </span>
        </div>

        {/* Active Consumers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/70">Peers</span>
          </div>
          <span className="text-sm font-mono font-bold text-purple-400">
            {metrics.consumers}
          </span>
        </div>

        {/* Render Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Render</span>
          </div>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {metrics.renderTime}ms
          </span>
        </div>
      </div>

      {/* Connection Stats Details */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-white/50 space-y-1">
          <div className="flex justify-between">
            <span>Packet Loss:</span>
            <span
              className={connectionStats.packetLoss > 3 ? 'text-red-400' : ''}
            >
              {connectionStats.packetLoss.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Jitter:</span>
            <span
              className={connectionStats.jitter > 50 ? 'text-yellow-400' : ''}
            >
              {connectionStats.jitter.toFixed(1)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>RTT:</span>
            <span
              className={connectionStats.rtt > 200 ? 'text-yellow-400' : ''}
            >
              {connectionStats.rtt.toFixed(1)}ms
            </span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-3 pt-2 border-t border-white/10 text-xs text-white/30">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
