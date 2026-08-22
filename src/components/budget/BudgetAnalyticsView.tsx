import React, { useState } from 'react';
import { 
  Trip, ExpenseItem, ExpenseCategory, BudgetOptimizationResult 
} from '../../types/index.ts';
import { 
  DollarSign, TrendingDown, Sparkles, Plus, Trash2, 
  CheckCircle2, PieChart as PieIcon, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { api } from '../../services/api.ts';

interface BudgetAnalyticsViewProps {
  trip: Trip;
  onTripUpdate: (trip: Trip) => void;
}

export const BudgetAnalyticsView: React.FC<BudgetAnalyticsViewProps> = ({ trip, onTripUpdate }) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(1200);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food');
  const [expenseDay, setExpenseDay] = useState(1);
  const [optimizationResult, setOptimizationResult] = useState<BudgetOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Group items & expenses for breakdown
  const categoryTotals: { [key in ExpenseCategory]?: number } = {};
  
  // From itinerary items
  trip.items.forEach(item => {
    const cat = item.category as ExpenseCategory;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.cost || 0);
  });

  // From dedicated expenses
  trip.expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: value || 0
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#F97316', '#10B981', '#EC4899', '#6366F1'];

  // Day-wise spending chart
  const dailySpendingData = Array.from({ length: trip.totalDays }).map((_, idx) => {
    const day = idx + 1;
    const dayItemTotal = trip.items
      .filter(i => i.dayNumber === day)
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    const dayExpTotal = trip.expenses
      .filter(e => e.dayNumber === day)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      day: `Day ${day}`,
      estimated: dayItemTotal,
      actual: dayExpTotal || (day <= 2 ? dayItemTotal * 0.95 : 0)
    };
  });

  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0) || trip.actualSpent || 12400;
  const remainingBudget = Math.max(0, trip.totalBudget - totalSpent);

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await api.optimizeBudget(trip.id, trip);
      setOptimizationResult(res);
    } catch (err) {
      console.error('Budget optimize error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplySavings = async () => {
    if (!optimizationResult) return;
    const updatedCost = optimizationResult.optimizedCost;
    const updatedTrip = {
      ...trip,
      estimatedCost: updatedCost,
      health: {
        ...trip.health,
        score: Math.min(99, trip.health.score + 5),
        budgetRisk: 'Safe' as const,
        insights: [
          `AI Budget Optimization Applied: Saved ${trip.currency}${optimizationResult.savings}`,
          ...trip.health.insights
        ]
      }
    };
    onTripUpdate(updatedTrip);
    await api.updateTrip(trip.id, updatedTrip);
    setOptimizationResult(null);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;

    try {
      const updated = await api.addExpense(trip.id, {
        title: expenseTitle,
        amount: Number(expenseAmount),
        category: expenseCategory,
        dayNumber: Number(expenseDay),
        paidBy: 'user_rahul',
        currency: trip.currency,
        date: new Date().toISOString().split('T')[0]
      });
      onTripUpdate(updated);
      setIsAddExpenseOpen(false);
      setExpenseTitle('');
    } catch (err) {
      console.error('Add expense error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Total Budget</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {trip.currency}{trip.totalBudget.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Target spending cap</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Estimated Cost</p>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {trip.currency}{trip.estimatedCost.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {trip.estimatedCost <= trip.totalBudget ? 'Within Budget' : 'Over Budget Risk'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Actual Logged Spent</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {trip.currency}{totalSpent.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {trip.expenses.length} receipts</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Remaining Buffer</p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {trip.currency}{remainingBudget.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Safety margin available</p>
        </div>
      </div>

      {/* AI Budget Optimization Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border-2 border-blue-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500 text-white">
                AI Budget Optimizer
              </span>
              <h4 className="font-extrabold text-base text-white">
                Intelligent Cost & Pass Recommendations
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              AI cross-references regional rail passes, group vouchers, and combo museum tickets to reduce cost without dropping quality.
            </p>
          </div>

          <button
            id="run-budget-optimizer-btn"
            onClick={handleRunOptimizer}
            disabled={isOptimizing}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isOptimizing ? 'Analyzing Passes...' : 'Scan AI Savings'}
          </button>
        </div>

        {/* Optimization Findings Result */}
        {optimizationResult && (
          <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                Found {optimizationResult.recommendations.length} High-Impact Savings: Save {trip.currency}{optimizationResult.savings.toLocaleString()} Total!
              </span>
              <button
                onClick={handleApplySavings}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold hover:bg-emerald-400 transition-colors shadow-sm"
              >
                Apply All AI Savings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {optimizationResult.recommendations.map((rec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs shrink-0">
                    💰
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-white">{rec.title}</p>
                      <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                        -{trip.currency}{rec.savingAmount}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Category Breakdown Pie */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
            <span>Category Spending Breakdown</span>
            <span className="text-xs text-slate-400 font-normal">All Activities & Expenses</span>
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`${trip.currency}${val.toLocaleString()}`, 'Cost']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.map((d, idx) => (
              <div key={d.name} className="flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Spending Bar Chart */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3 flex items-center justify-between">
            <span>Daily Budget Pacing</span>
            <span className="text-xs text-slate-400 font-normal">Estimated vs Actual</span>
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpendingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${trip.currency}${v/1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`${trip.currency}${val.toLocaleString()}`]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="estimated" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Estimated" />
                <Bar dataKey="actual" fill="#10B981" radius={[6, 6, 0, 0]} name="Actual Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Logged Expenses Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Receipts & Expense Tracker
            </h4>
            <p className="text-xs text-slate-500">Log shared and individual receipts</p>
          </div>

          <button
            id="log-expense-btn"
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expense
          </button>
        </div>

        {trip.expenses.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No custom expenses logged yet. Tap "Add Expense" to track your real receipts!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {trip.expenses.map(exp => (
              <div key={exp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{exp.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                      {exp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Day {exp.dayNumber} • Paid by {exp.paidBy || 'Me'}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {trip.currency}{exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={async () => {
                      const updated = await api.deleteExpense(trip.id, exp.id);
                      onTripUpdate(updated);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              Log Expense Receipt
            </h4>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Station Ramen & Gyoza"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount ({trip.currency})</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transport</option>
                    <option value="hotels">Hotels / Stays</option>
                    <option value="activities">Activities</option>
                    <option value="shopping">Shopping</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Day Number</label>
                <input
                  type="number"
                  min={1}
                  max={trip.totalDays}
                  value={expenseDay}
                  onChange={(e) => setExpenseDay(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
