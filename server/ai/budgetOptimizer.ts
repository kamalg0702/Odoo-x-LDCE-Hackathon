import { Trip, BudgetOptimizationResult, ExpenseCategory } from '../../src/types/index.ts';

export function optimizeTripBudget(trip: Trip): BudgetOptimizationResult {
  const originalCost = trip.estimatedCost || 42500;
  const currency = trip.currency || '₹';

  const recommendations = [
    {
      category: 'transport' as ExpenseCategory,
      title: 'Switch to Regional JR Rail Pass & Tourist Metro Card',
      description: `Replacing individual point-to-point Shinkansen and subway paper tickets with an all-inclusive 7-Day Regional Tourist Pass.`,
      savingAmount: 3800,
      actionType: 'transport_swap' as const
    },
    {
      category: 'hotels' as ExpenseCategory,
      title: 'Re-bundle Boutique Machiya Booking with Early-Bird Perks',
      description: `Switching to direct verified partner booking for Kyoto traditional townhouse with free breakfast included.`,
      savingAmount: 2600,
      actionType: 'substitute' as const
    },
    {
      category: 'activities' as ExpenseCategory,
      title: 'All-Access Digital Museum & Observatory Combo Pass',
      description: `Bundling teamLab Planets, Shibuya Sky, and Tokyo Tower admissions into a single QR pass.`,
      savingAmount: 1100,
      actionType: 'timing' as const
    },
    {
      category: 'food' as ExpenseCategory,
      title: 'Local Michelin Bib Gourmand Ramen & Izakaya Pass',
      description: `Replace tourist-heavy hotel dining on Days 2 & 4 with authentic high-rating local alley gems.`,
      savingAmount: 800,
      actionType: 'substitute' as const
    }
  ];

  const totalSavings = recommendations.reduce((acc, r) => acc + r.savingAmount, 0);
  const optimizedCost = originalCost - totalSavings;

  return {
    originalCost,
    optimizedCost,
    savings: totalSavings,
    recommendations
  };
}
