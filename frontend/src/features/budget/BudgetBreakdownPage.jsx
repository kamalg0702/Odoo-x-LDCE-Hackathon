import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTrip } from '../../core/hooks/useTrip';
import { useStops } from '../../core/hooks/useStops';
import { useBudget } from '../../core/hooks/useBudget';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { TripHeader } from '../../components/layout/TripHeader';
import { BudgetCategoryPieChart, StopBudgetBarChart } from '../../components/shared/BudgetChart';
import { ShareModal } from '../../components/shared/ShareModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/Tabs';
import { formatCurrency } from '../../core/utils/currency';
import { formatDate } from '../../core/utils/date';
import { shareApi } from '../../core/api/share.api';

export default function BudgetBreakdownPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = parseInt(id, 10);

  const { currentTrip, fetchTripById } = useTrip();
  const { stops, fetchStops } = useStops(tripId);
  const { budgetData, fetchBudget, addExpense, deleteExpense, isLoading } = useBudget(tripId);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'stay',
    amount: '',
    label: '',
    stop_id: '',
    date: ''
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    fetchTripById(tripId);
    fetchStops();
    fetchBudget();
  }, [tripId, fetchTripById, fetchStops, fetchBudget]);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.label) return;

    await addExpense({
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      label: expenseForm.label,
      stop_id: expenseForm.stop_id ? Number(expenseForm.stop_id) : null,
      date: expenseForm.date || null
    });

    setIsAddExpenseOpen(false);
    setExpenseForm({
      category: 'stay',
      amount: '',
      label: '',
      stop_id: '',
      date: ''
    });
  };

  const handleShareClick = async () => {
    setIsShareModalOpen(true);
    try {
      const res = await shareApi.shareTrip(tripId);
      setShareData(res.data);
    } catch {
      setShareData({ slug: currentTrip?.share_slug });
    }
  };

  const totalSpent = budgetData?.total || 0;
  const totalBudget = currentTrip?.total_budget || 0;
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const isOver = totalBudget > 0 && totalSpent > totalBudget;

  return (
    <PageWrapper>
      <TripHeader
        trip={currentTrip}
        activeTab="budget"
        onTabChange={(tab) => {
          if (tab === 'build') navigate(`/trips/${tripId}/build`);
          if (tab === 'view') navigate(`/trips/${tripId}/view`);
          if (tab === 'cities') navigate(`/trips/${tripId}/cities`);
          if (tab === 'calendar') navigate(`/trips/${tripId}/calendar`);
        }}
        onBack={() => navigate('/trips')}
        onShareClick={handleShareClick}
        stopsCount={stops.length}
      />

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink)' }}>
            Financial Breakdown & Expense Tracker
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>
            Real-time automated summation from scheduled activities plus custom logged expenses.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddExpenseOpen(true)}
        >
          Log Custom Expense
        </Button>
      </div>

      {/* Financial Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Card padding="md">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Total Spent / Scheduled</div>
          <div className="font-data" style={{ fontSize: '26px', fontWeight: '800', color: isOver ? 'var(--alert)' : 'var(--ink)', marginTop: '4px' }}>
            {formatCurrency(totalSpent)}
          </div>
          {totalBudget > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
                <span>Budget: {formatCurrency(totalBudget)}</span>
                <span>{percentUsed}%</span>
              </div>
              <ProgressBar value={percentUsed} color={isOver ? 'var(--alert)' : 'var(--terrain)'} />
            </div>
          )}
        </Card>

        <Card padding="md">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Remaining Budget</div>
          <div className="font-data" style={{ fontSize: '26px', fontWeight: '800', color: isOver ? 'var(--alert)' : 'var(--terrain)', marginTop: '4px' }}>
            {totalBudget > 0 ? (
              isOver ? `-${formatCurrency(totalSpent - totalBudget)}` : formatCurrency(totalBudget - totalSpent)
            ) : (
              'Not Set'
            )}
          </div>
          <span style={{ fontSize: '12px', color: isOver ? 'var(--alert)' : 'var(--terrain)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontWeight: '600' }}>
            {isOver ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
            {isOver ? 'Exceeding target allocation' : 'Within budget boundaries'}
          </span>
        </Card>

        <Card padding="md">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Average Daily Rate</div>
          <div className="font-data" style={{ fontSize: '26px', fontWeight: '800', color: 'var(--traverse)', marginTop: '4px' }}>
            {formatCurrency(budgetData?.avg_per_day || 0)}/day
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '6px', display: 'block' }}>
            Over {budgetData?.trip_days || 1} days journey duration
          </span>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Category Breakdown Pie */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieIcon size={18} style={{ color: 'var(--traverse)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>Category Distribution</h3>
          </div>
          <BudgetCategoryPieChart byCategory={budgetData?.by_category || {}} />
        </Card>

        {/* Per-Stop Bar Chart */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart2 size={18} style={{ color: 'var(--traverse)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>Stop Spending vs Budget Allocation</h3>
          </div>
          <StopBudgetBarChart stops={budgetData?.stops || []} />
        </Card>
      </div>

      {/* Per Stop Subtotals Table */}
      <div style={{ marginBottom: '32px' }}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)', marginBottom: '14px' }}>
          Destination Subtotals
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {budgetData?.stops?.map((stop) => (
            <Card key={stop.stop_id} padding="md" style={{ border: stop.overbudget ? '1px solid var(--alert)' : '1px solid var(--mist)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>{stop.city_name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{stop.country}</span>
                </div>
                {stop.overbudget && (
                  <Badge variant="red" size="sm" icon={AlertTriangle}>
                    Over Target
                  </Badge>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px', borderTop: '1px solid var(--mist)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                  {stop.activity_count} Acts • {stop.expense_count} Exps
                </span>
                <span className="font-data" style={{ fontSize: '18px', fontWeight: '800', color: stop.overbudget ? 'var(--alert)' : 'var(--ink)' }}>
                  {formatCurrency(stop.subtotal)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Logged Expenses List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)' }}>
            Logged Custom Expenses ({budgetData?.expenses?.length || 0})
          </h3>
          <Button size="sm" variant="secondary" icon={Plus} onClick={() => setIsAddExpenseOpen(true)}>
            Add Item
          </Button>
        </div>

        {budgetData?.expenses && budgetData.expenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {budgetData.expenses.map((exp) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--mist)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Badge variant={exp.category === 'transport' ? 'blue' : exp.category === 'stay' ? 'gold' : 'green'}>
                    {exp.category.toUpperCase()}
                  </Badge>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>{exp.label}</div>
                    {exp.date && <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{formatDate(exp.date)}</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="font-data" style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ink)' }}>
                    {formatCurrency(exp.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    style={{ padding: '6px', color: 'var(--alert)', borderRadius: 'var(--radius-sm)' }}
                    title="Delete expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card padding="md" style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-muted)', fontSize: '13px' }}>
            No custom expenses logged yet. Add flights, hotel reservations, meal budgets, or train tickets.
          </Card>
        )}
      </div>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Log Trip Expense"
        subtitle="Add transport, accommodation, meal, or miscellaneous costs."
      >
        <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Expense Description / Label"
            placeholder="e.g. Flight Paris to Rome, Airbnb 4 nights"
            required
            value={expenseForm.label}
            onChange={(e) => setExpenseForm({ ...expenseForm, label: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Category"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              options={[
                { value: 'stay', label: '🏨 Accommodation / Stay' },
                { value: 'transport', label: '✈️ Transit / Transport' },
                { value: 'meals', label: '🍽️ Food & Dining' },
                { value: 'activities', label: '🎟️ Tickets & Tours' },
                { value: 'other', label: '📦 Other / Misc' }
              ]}
            />
            <Input
              label="Amount ($)"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="150.00"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Associated Stop (Optional)"
              value={expenseForm.stop_id}
              onChange={(e) => setExpenseForm({ ...expenseForm, stop_id: e.target.value })}
              options={[
                { value: '', label: 'General / Multi-Stop' },
                ...stops.map((s) => ({ value: String(s.id), label: `${s.city?.name || 'Stop'} (${s.order_index + 1})` }))
              ]}
            />
            <Input
              label="Expense Date"
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setIsAddExpenseOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Save Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          trip={currentTrip}
          shareData={shareData}
          onGenerateLink={handleShareClick}
        />
      )}
    </PageWrapper>
  );
}
