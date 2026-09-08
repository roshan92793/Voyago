import { formatCurrency, budgetProgress } from '../../utils';
import './BudgetCard.css';

const CATEGORY_ICONS = {
  accommodation: '🏨',
  flights:       '✈️',
  food:          '🍽️',
  activities:    '🎭',
  transport:     '🚌',
  other:         '💳',
};

const BudgetCard = ({ budget }) => {
  const progress = budgetProgress(budget.spent, budget.total);
  const remaining = budget.total - budget.spent;

  return (
    <div className="budget-card" id="budget-card">
      <div className="budget-card__header">
        <h3>💰 Budget Overview</h3>
        <span className={`budget-card__pct ${progress > 85 ? 'budget-card__pct--danger' : ''}`}>
          {progress}% used
        </span>
      </div>

      {/* Total bar */}
      <div className="budget-card__total">
        <div className="budget-card__amounts">
          <div>
            <span className="budget-card__label">Spent</span>
            <span className="budget-card__amount budget-card__amount--spent">
              {formatCurrency(budget.spent, budget.currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="budget-card__label">Total</span>
            <span className="budget-card__amount">
              {formatCurrency(budget.total, budget.currency)}
            </span>
          </div>
        </div>
        <div className="budget-card__bar">
          <div
            className={`budget-card__fill ${progress > 85 ? 'budget-card__fill--danger' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="budget-card__remaining">
          Remaining: <strong>{formatCurrency(remaining, budget.currency)}</strong>
        </div>
      </div>

      {/* Breakdown */}
      {budget.breakdown && (
        <div className="budget-card__breakdown">
          <h4 className="budget-card__breakdown-title">Breakdown</h4>
          {Object.entries(budget.breakdown).map(([cat, amt]) => {
            const pct = Math.round((amt / budget.total) * 100);
            return (
              <div key={cat} className="budget-card__item">
                <div className="budget-card__item-info">
                  <span>{CATEGORY_ICONS[cat] || '💳'}</span>
                  <span className="budget-card__item-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                </div>
                <div className="budget-card__item-right">
                  <div className="budget-card__item-bar">
                    <div className="budget-card__item-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="budget-card__item-amt">{formatCurrency(amt, budget.currency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
