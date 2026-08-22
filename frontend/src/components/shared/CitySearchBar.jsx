import React from 'react';
import { Search, Filter, Globe } from 'lucide-react';
import { Input } from '../ui/Input';

export function CitySearchBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  maxCost,
  onMaxCostChange,
  regions = ['All', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa', 'Oceania']
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--mist)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            icon={Search}
            placeholder="Search by city name, country, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Cost Index Filter */}
        {onMaxCostChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-muted)' }}>Max Cost:</span>
            <select
              value={maxCost || ''}
              onChange={(e) => onMaxCostChange(e.target.value ? Number(e.target.value) : null)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--mist-dark)',
                fontSize: '13px',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="">Any Cost Index</option>
              <option value="3">Budget ($ 1-3)</option>
              <option value="6">Moderate ($$ 1-6)</option>
              <option value="8">Upscale ($$$ 1-8)</option>
            </select>
          </div>
        )}
      </div>

      {/* Region Pill Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        <Globe size={14} style={{ color: 'var(--ink-subtle)', flexShrink: 0, marginRight: '4px' }} />
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg;
          return (
            <button
              key={reg}
              onClick={() => onRegionChange(reg)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: isSelected ? '700' : '500',
                backgroundColor: isSelected ? 'var(--ink)' : 'var(--sand)',
                color: isSelected ? '#FFFFFF' : 'var(--ink-muted)',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {reg}
            </button>
          );
        })}
      </div>
    </div>
  );
}
