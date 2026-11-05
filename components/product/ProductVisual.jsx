'use client';
import { useEffect, useRef, useState } from 'react';

/** Remote product/lifestyle image. Shows a soft shimmer while loading, fades in, and falls back to a tinted panel if the link fails. */
export default function ProductVisual({ src, tone = '#EDE3D8', alt = '', className = '', priority = false }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  // An image can finish loading before React attaches onLoad, so check once on mount
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true); }, [src]);
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: `linear-gradient(160deg, #fff 0%, ${tone} 100%)` }}>
      {src && !failed && !loaded && <span className="skeleton absolute inset-0" aria-hidden="true" />}
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" referrerPolicy="no-referrer" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      )}
      {/* soft inner light so every photo shares the same premium finish */}
      <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(42,33,29,0.10)]" aria-hidden="true" />
    </div>
  );
}
