import React from 'react';

/**
 * Signature element: SVG "route line" connecting city dots,
 * like a miniature map path.
 */
export function RouteMapSvg({
  stops = [],
  height = 80,
  animated = true,
  className = ''
}) {
  if (!stops || stops.length === 0) {
    return (
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-subtle)', fontSize: '12px' }}>
        No route stops added yet
      </div>
    );
  }

  // Generate responsive point coordinates across the SVG width
  const totalStops = stops.length;
  const paddingX = 40;
  const points = stops.map((stop, idx) => {
    // Distribute X evenly
    const x = totalStops === 1 ? 50 : paddingX + (idx / (totalStops - 1)) * (100 - paddingX * 2);
    // Slight sinusoidal curve for cartographic feel
    const y = 50 + (idx % 2 === 0 ? -15 : 15);
    return {
      x,
      y,
      name: stop.city?.name || `Stop ${idx + 1}`,
      country: stop.city?.country || ''
    };
  });

  // Construct SVG Path (Cubic Bezier or straight)
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
  } else {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  return (
    <div style={{ width: '100%', overflow: 'hidden' }} className={className}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      >
        {/* Background contour guide lines */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="var(--mist)" strokeWidth="0.5" strokeDasharray="2 2" />
        
        {/* Connecting route path */}
        {points.length > 1 && (
          <>
            {/* Glow backing */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(37, 99, 235, 0.15)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Dashed animated line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--traverse)"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={animated ? 'route-dash-animated' : ''}
              strokeDasharray="4 2"
            />
          </>
        )}

        {/* City Point Nodes */}
        {points.map((p, idx) => (
          <g key={idx}>
            {/* Outer halo */}
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#FFFFFF"
              stroke="var(--traverse)"
              strokeWidth="1.5"
            />
            {/* Center dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="2"
              fill={idx === 0 ? 'var(--terrain)' : idx === points.length - 1 ? 'var(--alert)' : 'var(--traverse)'}
            />
            {/* City Label */}
            <text
              x={p.x}
              y={p.y > 50 ? p.y + 14 : p.y - 8}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="6"
              fontWeight="600"
              fontFamily="var(--font-body)"
            >
              {p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
