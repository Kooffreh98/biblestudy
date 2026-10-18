'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Download, CheckCircle, Wifi, WifiOff, RefreshCw, Trash2, BookOpen } from 'lucide-react';
import { getCacheStatus, cacheAllBooks, clearBibleCache, type CacheStatus } from '@/lib/bibleOfflineCache';

export default function OfflineCacheManager() {
  const [status, setStatus] = useState<CacheStatus | null>(null);
  const [caching, setCaching] = useState(false);
  const [progress, setProgress] = useState({ bookIndex: 0, bookName: '' });
  const [isOnline, setIsOnline] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setStatus(getCacheStatus());
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCacheAll = useCallback(async () => {
    setCaching(true);
    setProgress({ bookIndex: 0, bookName: 'Starting…' });
    await cacheAllBooks((bookIndex, bookName) => {
      setProgress({ bookIndex, bookName });
    });
    setStatus(getCacheStatus());
    setCaching(false);
  }, []);

  const handleClear = useCallback(() => {
    clearBibleCache();
    setStatus(getCacheStatus());
  }, []);

  if (!status) return null;

  const pct = status.totalBooks > 0 ? Math.round((status.cachedBooks / status.totalBooks) * 100) : 0;
  const lastCachedDate = status.lastCached ? new Date(status.lastCached).toLocaleDateString() : null;

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.cached ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {status.cached ? <CheckCircle size={16} /> : <Download size={16} />}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              {status.cached ? 'All 66 Books Cached' : `${status.cachedBooks} / 66 Books Cached`}
            </p>
            <p className="text-xs text-muted-foreground">
              {status.cached
                ? `Offline reading available · Last updated ${lastCachedDate}`
                : 'Cache all books for offline reading'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <RefreshCw size={14} className={`text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{status.cachedBooks} books cached</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Live progress during caching */}
          {caching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              <BookOpen size={14} className="animate-pulse text-primary" />
              <span>Caching <strong className="text-foreground">{progress.bookName}</strong>…</span>
              <span className="ml-auto text-xs font-mono">{progress.bookIndex + 1} / 66</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {!status.cached && !caching && (
              <button
                onClick={handleCacheAll}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download size={14} />
                Cache All 66 Books
              </button>
            )}
            {status.cached && !caching && (
              <button
                onClick={handleCacheAll}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-lg hover:bg-muted/70 transition-colors"
              >
                <RefreshCw size={14} />
                Refresh Cache
              </button>
            )}
            {caching && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg">
                <RefreshCw size={14} className="animate-spin" />
                Caching in progress…
              </div>
            )}
            {status.cachedBooks > 0 && !caching && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Trash2 size={14} />
                Clear Cache
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Cached data is stored in your browser's local storage. Clearing browser data will remove the cache.
          </p>
        </div>
      )}
    </div>
  );
}
