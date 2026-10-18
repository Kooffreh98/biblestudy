'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface FrequencyItem {
  book: string;
  count: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{payload[0].value} occurrences</p>
      </div>
    );
  }
  return null;
};

export default function ConcordanceFrequencyChart({ data, word }: { data: FrequencyItem[]; word: string }) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-card border border-border rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground capitalize">
            &ldquo;{word}&rdquo; — frequency by Bible book
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Occurrences per book across both testaments</p>
        </div>
        <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
          {data.reduce((s, d) => s + d.count, 0)} shown
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="book"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`freq-cell-${index}`}
                fill="var(--primary)"
                opacity={0.4 + (entry.count / maxCount) * 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}