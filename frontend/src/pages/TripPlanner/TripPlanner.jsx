import { useState } from 'react';
import { destinations } from '../../data/destinations';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './TripPlanner.css';

const tripTypes = ['Solo', 'Couple', 'Family', 'Friends', 'Business'];
const travelStyles = ['Relaxed', 'Balanced', 'Adventure', 'Luxury', 'Budget'];
const interests = [
  { label: 'Beaches', icon: '🏖️' },
  { label: 'Mountains', icon: '🏔️' },
  { label: 'Nature', icon: '🌿' },
  { label: 'Adventure', icon: '🧗' },
  { label: 'Food & Cuisine', icon: '🍴' },
  { label: 'Culture & History', icon: '🏛️' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Nightlife', icon: '🌙' },
  { label: 'Wildlife', icon: '🐘' },
  { label: 'Photography', icon: '📷' },
  { label: 'Spiritual', icon: '🪷' },
];
const transportationOptions = [
  { label: 'Flight', icon: '✈️' },
  { label: 'Train', icon: '🚆' },
  { label: 'Bus', icon: '🚌' },
  { label: 'Car', icon: '🚗' },
  { label: 'Rental Car', icon: '🚙' },
  { label: 'Not decided yet', icon: '🧭' },
];
const paces = ['Slow', 'Moderate', 'Packed'];
const accommodations = ['Budget', 'Standard', 'Premium', 'Luxury'];

const getDetailsErrors = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Add a title for your trip.';
  if (!form.startDate) errors.startDate = 'Choose a start date.';
  if (!form.endDate) errors.endDate = 'Choose an end date.';
  else if (form.startDate && form.endDate < form.startDate) {
    errors.endDate = 'End date must be on or after the start date.';
  }
  if (!form.startingLocation.trim()) errors.startingLocation = 'Add your starting location.';
  if (form.travelers.adults < 1) errors.adults = 'At least one adult is required.';
  return errors;
};

const TripPlanner = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    destinations: [],
    startDate: '',
    endDate: '',
    travelers: { adults: 1, children: 0 },
    tripType: '',
    travelStyle: '',
    interests: [],
    startingLocation: '',
    transportation: '',
    pace: '',
    accommodationPreference: '',
    budget: { total: 25000, currency: 'INR', spent: 0, breakdown: { accommodation: 0, flights: 0, food: 0, activities: 0, transport: 0 } },
    notes: '',
  });
  const [saved, setSaved] = useState(false);
  const [showDetailsErrors, setShowDetailsErrors] = useState(false);
  const detailsErrors = showDetailsErrors ? getDetailsErrors(form) : {};

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const updateTravelerCount = (type, amount) => {
    setForm((prev) => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: Math.max(type === 'adults' ? 1 : 0, prev.travelers[type] + amount),
      },
    }));
  };
  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };
  const getTripDuration = () => {
    if (!form.startDate || !form.endDate || form.endDate < form.startDate) return null;
    const start = new Date(`${form.startDate}T00:00:00Z`);
    const end = new Date(`${form.endDate}T00:00:00Z`);
    const nights = Math.round((end - start) / 86400000);
    return `${nights + 1} ${nights + 1 === 1 ? 'day' : 'days'} / ${nights} ${nights === 1 ? 'night' : 'nights'}`;
  };
  const goToStep = (nextStep) => {
    if (nextStep > 1 && step === 1) {
      setShowDetailsErrors(true);
      if (Object.keys(getDetailsErrors(form)).length > 0) return;
    }
    setStep(nextStep);
  };
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
              onClick={() => goToStep(i + 1)}
              role="button"
              id={`step-btn-${i + 1}`}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') goToStep(i + 1);
              }}
            >
              <div className="planner__step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="planner__body">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="planner__panel planner__panel--details animate-fade-in">
              <div className="planner__panel-heading">
                <div>
                  <span className="planner__eyebrow">THE JOURNEY STARTS HERE</span>
                  <h2>Trip Details</h2>
                  <p>Plan the essentials of your journey.</p>
                </div>
                <span className="planner__heading-mark" aria-hidden="true">✈</span>
              </div>

              <div className="planner__form planner__details-form">
                <Input id="title" label="Trip Title" value={form.title} onChange={handleChange} placeholder="e.g. Goa Beach Adventure" icon="✈️" required error={detailsErrors.title} />

                <div className="planner__section planner__section--dates">
                  <div className="planner__section-heading">
                    <span className="planner__section-icon" aria-hidden="true">🗓️</span>
                    <div><h3>When are you going?</h3><p>Choose your travel dates</p></div>
                  </div>
                  <div className="planner__date-fields">
                    <Input id="startDate" label="Start Date" type="date" value={form.startDate} onChange={handleChange} required error={detailsErrors.startDate} />
                    <Input id="endDate" label="End Date" type="date" value={form.endDate} onChange={handleChange} min={form.startDate || undefined} required error={detailsErrors.endDate} />
                    <div className={`planner__duration ${getTripDuration() ? 'planner__duration--ready' : ''}`} aria-live="polite">
                      <span aria-hidden="true">◷</span> {getTripDuration() || 'Trip duration will appear here'}
                    </div>
                  </div>
                </div>

                <div className="planner__section">
                  <div className="planner__section-heading">
                    <span className="planner__section-icon" aria-hidden="true">👥</span>
                    <div><h3>Travelers</h3><p>Who’s joining the trip?</p></div>
                    <span className="planner__traveler-total">{form.travelers.adults + form.travelers.children} total</span>
                  </div>
                  <div className="planner__traveler-controls">
                    {[
                      { key: 'adults', label: 'Adults', detail: 'Ages 13+' },
                      { key: 'children', label: 'Children', detail: 'Ages 0–12' },
                    ].map(({ key, label, detail }) => (
                      <div className="planner__traveler" key={key}>
                        <div><strong>{label}</strong><span>{detail}</span></div>
                        <div className="planner__stepper">
                          <button type="button" onClick={() => updateTravelerCount(key, -1)} disabled={form.travelers[key] <= (key === 'adults' ? 1 : 0)} aria-label={`Remove one ${label.toLowerCase()}`}>−</button>
                          <output aria-live="polite">{form.travelers[key]}</output>
                          <button type="button" onClick={() => updateTravelerCount(key, 1)} aria-label={`Add one ${label.toLowerCase()}`}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {detailsErrors.adults && <span className="input-error">{detailsErrors.adults}</span>}
                </div>

                <div className="planner__section">
                  <ChoiceGroup label="Trip Type" hint="What brings you together?" options={tripTypes} value={form.tripType} onChange={(value) => setForm((prev) => ({ ...prev, tripType: value }))} />
                </div>

                <div className="planner__section">
                  <ChoiceGroup label="Travel Style" hint="Set the feel of your journey" options={travelStyles} value={form.travelStyle} onChange={(value) => setForm((prev) => ({ ...prev, travelStyle: value }))} />
                </div>

                <div className="planner__section planner__section--location">
                  <Input id="startingLocation" label="Starting Location" value={form.startingLocation} onChange={handleChange} placeholder="e.g. Indore, Madhya Pradesh" icon="📍" required error={detailsErrors.startingLocation} />
                </div>

                <div className="planner__section">
                  <ChoiceGroup label="Preferred Transportation" hint="How would you like to get there?" options={transportationOptions} value={form.transportation} onChange={(value) => setForm((prev) => ({ ...prev, transportation: value }))} />
                </div>

                <div className="planner__section planner__section--interests">
                  <div className="planner__section-heading">
                    <span className="planner__section-icon" aria-hidden="true">✦</span>
                    <div><h3>What are you interested in?</h3><p>Choose all that sound like you</p></div>
                  </div>
                  <div className="planner__interest-grid">
                    {interests.map(({ label, icon }) => (
                      <button key={label} type="button" className={`planner__interest ${form.interests.includes(label) ? 'planner__interest--selected' : ''}`} aria-pressed={form.interests.includes(label)} onClick={() => toggleInterest(label)}>
                        <span aria-hidden="true">{icon}</span>{label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="planner__section planner__section--preferences">
                  <div className="planner__section-heading">
                    <span className="planner__section-icon" aria-hidden="true">⚙️</span>
                    <div><h3>Trip Preferences</h3><p>Optional details for a better-matched plan</p></div>
                  </div>
                  <div className="planner__preference-fields">
                    <ChoiceGroup label="Preferred Pace" options={paces} value={form.pace} onChange={(value) => setForm((prev) => ({ ...prev, pace: value }))} compact />
                    <ChoiceGroup label="Accommodation" options={accommodations} value={form.accommodationPreference} onChange={(value) => setForm((prev) => ({ ...prev, accommodationPreference: value }))} compact />
                  </div>
                </div>

                <div className="input-group planner__notes">
                  <label className="input-label" htmlFor="notes">Notes / Special Requirements</label>
                  <textarea
                    id="notes"
                    className="planner__textarea"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add special requirements, places you want to visit, food preferences, or anything else..."
                    rows={4}
                  />
                  <span className="planner__field-hint">For example: “Want to visit beaches and forts. Prefer less crowded places.”</span>
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
                <div className="planner__review-item"><span>👥 Travelers</span><strong>{form.travelers.adults} adults, {form.travelers.children} children</strong></div>
                <div className="planner__review-item"><span>📍 Starting from</span><strong>{form.startingLocation || '—'}</strong></div>
                <div className="planner__review-item"><span>✦ Trip style</span><strong>{[form.tripType, form.travelStyle].filter(Boolean).join(' · ') || '—'}</strong></div>
                <div className="planner__review-item"><span>🚆 Transportation</span><strong>{form.transportation || '—'}</strong></div>
                <div className="planner__review-item"><span>♡ Interests</span><strong>{form.interests.join(', ') || '—'}</strong></div>
                <div className="planner__review-item"><span>⚙️ Preferences</span><strong>{[form.pace, form.accommodationPreference].filter(Boolean).join(' · ') || '—'}</strong></div>
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
              <Button id="planner-next-btn" variant="primary" onClick={() => goToStep(step + 1)}>Next →</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChoiceGroup = ({ label, hint, options, value, onChange, compact = false }) => (
  <div className={`planner__choice-group ${compact ? 'planner__choice-group--compact' : ''}`}>
    <div className="planner__section-heading planner__section-heading--choice">
      <div><h3>{label}</h3>{hint && <p>{hint}</p>}</div>
    </div>
    <div className="planner__choice-list">
      {options.map((option) => {
        const optionLabel = typeof option === 'string' ? option : option.label;
        const optionIcon = typeof option === 'string' ? null : option.icon;
        return (
          <button key={optionLabel} type="button" className={`planner__choice ${value === optionLabel ? 'planner__choice--selected' : ''}`} aria-pressed={value === optionLabel} onClick={() => onChange(optionLabel)}>
            {optionIcon && <span aria-hidden="true">{optionIcon}</span>}{optionLabel}
          </button>
        );
      })}
    </div>
  </div>
);

export default TripPlanner;
