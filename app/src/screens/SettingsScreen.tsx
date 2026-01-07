import { useState, useEffect } from 'react';
import type { ThemeMode, HouseholdMode, HouseholdState } from '../types';
import { SegmentedControl, type Segment } from '../components/SegmentedControl';
import { getTheme, setTheme, getHouseholdState, setHouseholdState } from '../state/store';
import './SettingsScreen.css';

const themeSegments: Segment<ThemeMode>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const householdSegments: Segment<HouseholdMode>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'away', label: 'Away' },
];

function formatDateForInput(isoDate?: string): string {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
}

function formatDateForDisplay(isoDate?: string): string {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function SettingsScreen() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getTheme);
  const [household, setHousehold] = useState<HouseholdState>(getHouseholdState);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleHouseholdModeChange = (mode: HouseholdMode) => {
    const updated: HouseholdState = {
      ...household,
      mode,
      // Clear dates when switching to normal
      ...(mode === 'normal' && {
        away_start: undefined,
        away_end: undefined,
        away_label: undefined,
      }),
    };
    setHousehold(updated);
    setHouseholdState(updated);
  };

  const handleAwayLabelChange = (label: string) => {
    const updated = { ...household, away_label: label || undefined };
    setHousehold(updated);
    setHouseholdState(updated);
  };

  const handleAwayStartChange = (date: string) => {
    const updated = { ...household, away_start: date ? `${date}T00:00:00.000Z` : undefined };
    setHousehold(updated);
    setHouseholdState(updated);
  };

  const handleAwayEndChange = (date: string) => {
    const updated = { ...household, away_end: date ? `${date}T23:59:59.999Z` : undefined };
    setHousehold(updated);
    setHouseholdState(updated);
  };

  const awayDateDisplay = household.away_start || household.away_end
    ? `${formatDateForDisplay(household.away_start) || '?'} – ${formatDateForDisplay(household.away_end) || '?'}`
    : null;

  return (
    <div className="screen settings-screen">
      <header className="screen-header">
        <h1 className="screen-title">Settings</h1>
      </header>

      <div className="settings-sections">
        {/* Theme section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Appearance</h2>
          <div className="settings-card glass-surface">
            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-row-icon">🎨</span>
                <span>Theme</span>
              </div>
              <SegmentedControl
                segments={themeSegments}
                value={currentTheme}
                onChange={setCurrentTheme}
                ariaLabel="Theme preference"
              />
            </div>
          </div>
        </section>

        {/* Household section */}
        <section className="settings-section">
          <h2 className="settings-section-title">Household</h2>
          <div className="settings-card glass-surface">
            <div className="settings-row">
              <div className="settings-row-label">
                <span className="settings-row-icon">🏠</span>
                <span>Mode</span>
              </div>
              <SegmentedControl
                segments={householdSegments}
                value={household.mode}
                onChange={handleHouseholdModeChange}
                ariaLabel="Household mode"
              />
            </div>

            {household.mode === 'away' && (
              <div className="away-options">
                <div className="away-field">
                  <label className="away-field-label" htmlFor="away-label">
                    Label (optional)
                  </label>
                  <input
                    id="away-label"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Holiday, Work trip"
                    value={household.away_label || ''}
                    onChange={(e) => handleAwayLabelChange(e.target.value)}
                  />
                </div>

                <div className="away-dates">
                  <div className="away-field">
                    <label className="away-field-label" htmlFor="away-start">
                      From
                    </label>
                    <input
                      id="away-start"
                      type="date"
                      className="form-input"
                      value={formatDateForInput(household.away_start)}
                      onChange={(e) => handleAwayStartChange(e.target.value)}
                    />
                  </div>
                  <div className="away-field">
                    <label className="away-field-label" htmlFor="away-end">
                      To
                    </label>
                    <input
                      id="away-end"
                      type="date"
                      className="form-input"
                      value={formatDateForInput(household.away_end)}
                      onChange={(e) => handleAwayEndChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="away-summary">
                  <span className="away-summary-icon">🏖️</span>
                  <span className="away-summary-text">
                    {household.away_label || 'Away'}
                    {awayDateDisplay && <span className="away-summary-dates"> · {awayDateDisplay}</span>}
                  </span>
                </div>

                <div className="settings-hint">
                  Away mode shows a banner in Recipes and skipped recipes won't count as negative outcomes.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Staples section (stub) */}
        <section className="settings-section">
          <h2 className="settings-section-title">Staples</h2>
          <div className="settings-card glass-surface">
            <div className="empty-state-inline">
              <span className="empty-state-text">
                Staples list coming soon — items you always have on hand.
              </span>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
