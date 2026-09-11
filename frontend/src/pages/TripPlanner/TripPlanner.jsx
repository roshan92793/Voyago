import { useState } from 'react';
import { destinations } from '../../data/destinations';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './TripPlanner.css';

const TripPlanner = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    destinations: [],
    startDate: '',
    endDate: '',
    budget: { total: 25000, currency: 'INR', spent: 0, breakdown: { accommodation: 0, flights: 0, food: 0, activities: 0, transport: 0 } },
    notes: '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });
  const toggleDest = (name) => {
    setForm((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(name)
        ? prev.destinations.filter((d) => d !== name)
        : [...prev.destinations, name],
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const steps = ['Details', 'Destinations', 'Budget', 'Review'];

  return (
    <div className="trip-planner section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="page-header">
          <h1>✈️ Trip <span className="text-gradient">Planner</span></h1>
          <p>Build your perfect itinerary in minutes.</p>
        </div>

        {/* Step indicators */}
        <div className="planner__steps">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`planner__step ${step === i + 1 ? 'planner__step--active' : ''} ${step > i + 1 ? 'planner__step--done' : ''}`}
              onClick={() => setStep(i + 1)}
              role="button"
              id={`step-btn-${i + 1}`}
            >
              <div className="planner__step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="planner__body">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="planner__panel animate-fade-in">
              <h2>Trip Details</h2>
              <div className="planner__form">
                <Input id="title" label="Trip Title" value={form.title} onChange={handleChange} placeholder="e.g. Kerala getaway" icon="✈️" required />
                <div className="planner__row">
                  <Input id="startDate" label="Start Date" type="date" value={form.startDate} onChange={handleChange} required />
                  <Input id="endDate" label="End Date" type="date" value={form.endDate} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    className="planner__textarea"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Pack light, book ferries in advance..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Destinations */}
          {step === 2 && (
            <div className="planner__panel animate-fade-in">
              <h2>Pick Destinations</h2>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                Selected: {form.destinations.length > 0 ? form.destinations.join(', ') : 'None'}
              </p>
              <div className="planner__dest-grid">
                {destinations.map((d) => (
                  <div
                    key={d.id}
                    id={`planner-dest-${d.id}`}
                    className={`planner__dest-card ${form.destinations.includes(d.name) ? 'planner__dest-card--selected' : ''}`}
                    onClick={() => toggleDest(d.name)}
                    role="checkbox"
                    aria-checked={form.destinations.includes(d.name)}
                  >
                    <img src={d.image} alt={d.name} loading="lazy" />
                    <div className="planner__dest-info">
                      <strong>{d.name}</strong>
                      <span>{d.country}</span>
                    </div>
                    {form.destinations.includes(d.name) && (
                      <div className="planner__dest-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="planner__panel animate-fade-in">
              <h2>Set Budget</h2>
              <div className="planner__budget-inputs">
                <div className="input-group">
                  <label className="input-label" htmlFor="budget-total">Total Budget (INR)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">💰</span>
                    <input
                      id="budget-total"
                      type="number"
                      className="input-field input-field--has-icon"
                      value={form.budget.total}
                      onChange={(e) => setForm({ ...form, budget: { ...form.budget, total: +e.target.value } })}
                      min={0}
                    />
                  </div>
                </div>
                {['accommodation', 'flights', 'food', 'activities', 'transport'].map((cat) => (
                  <div key={cat} className="input-group">
                    <label className="input-label" htmlFor={`budget-${cat}`}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} (₹)
                    </label>
                    <div className="input-wrapper">
                      <input
                        id={`budget-${cat}`}
                        type="number"
                        className="input-field"
                        value={form.budget.breakdown[cat]}
                        onChange={(e) => setForm({
                          ...form,
                          budget: { ...form.budget, breakdown: { ...form.budget.breakdown, [cat]: +e.target.value } },
                        })}
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem' }}>
                <BudgetCard budget={form.budget} />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="planner__panel animate-fade-in">
              <h2>Review Your Trip</h2>
              <div className="planner__review">
                <div className="planner__review-item"><span>📋 Title</span><strong>{form.title || '—'}</strong></div>
                <div className="planner__review-item"><span>📍 Destinations</span><strong>{form.destinations.join(', ') || '—'}</strong></div>
                <div className="planner__review-item"><span>🗓 Dates</span><strong>{form.startDate} → {form.endDate}</strong></div>
                <div className="planner__review-item"><span>💰 Budget</span><strong>₹{form.budget.total.toLocaleString('en-IN')}</strong></div>
                <div className="planner__review-item"><span>📝 Notes</span><strong>{form.notes || '—'}</strong></div>
              </div>
              {saved && <div className="planner__saved">✅ Trip saved successfully!</div>}
              <Button id="save-trip-btn" variant="primary" size="lg" onClick={handleSave}>
                💾 Save Trip
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="planner__nav">
            {step > 1 && (
              <Button id="planner-back-btn" variant="ghost" onClick={() => setStep((s) => s - 1)}>← Back</Button>
            )}
            {step < 4 && (
              <Button id="planner-next-btn" variant="primary" onClick={() => setStep((s) => s + 1)}>Next →</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
