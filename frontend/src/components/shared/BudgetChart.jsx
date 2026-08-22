import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatCurrency } from '../../core/utils/currency';

const CATEGORY_COLORS = {
  transport: '#2563EB', // traverse blue
  stay: '#7C3AED',      // purple
  activities: '#059669',// terrain green
  meals: '#D97706',     // amber gold
  other: '#64748B'      // slate
};

export function BudgetCategoryPieChart({ byCategory = {} }) {
  const data = Object.entries(byCategory)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(value),
      key
    }));

  if (data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-subtle)', fontSize: '13px' }}>
        No categorized expenses logged yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key] || '#94A3B8'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [formatCurrency(value), 'Total Spent']}
            // FIXED: hardcoded ink tooltip -> var(--paper-card) with theme card-border
            contentStyle={{
              backgroundColor: 'var(--paper-card)',
              color: 'var(--ink)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: 'var(--ink)', fontSize: '12px', fontWeight: '600' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StopBudgetBarChart({ stops = [] }) {
  const data = stops.map((s) => ({
    name: s.city_name,
    Spent: s.subtotal,
    Target: s.budget_estimate || 0
  }));

  if (data.length === 0) {
    return (
      <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-subtle)', fontSize: '13px' }}>
        Add stops to compare destination spending.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mist)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} />
          {/* FIXED: hardcoded $ -> ₹ in YAxis tickFormatter */}
          <YAxis tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} tickFormatter={(val) => `₹${val}`} />
          <Tooltip
            formatter={(value) => [formatCurrency(value)]}
            // FIXED: hardcoded ink tooltip -> var(--paper-card) with theme card-border
            contentStyle={{
              backgroundColor: 'var(--paper-card)',
              color: 'var(--ink)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px'
            }}
          />
          <Legend verticalAlign="top" height={36} formatter={(val) => <span style={{ fontSize: '12px', color: 'var(--ink)', fontWeight: '600' }}>{val}</span>} />
          <Bar dataKey="Spent" fill="var(--traverse)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Target" fill="var(--sand-dark)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
