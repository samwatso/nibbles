import { useState, useEffect } from 'react';
import { SegmentedControl, type Segment } from '../components/SegmentedControl';
import { getTheme, setTheme, type ThemeMode, getHouseholdState, setHouseholdState } from '../state/store';
import './SettingsScreen.css';

type HouseholdMode = 'normal' | 'away';

const themeSegments: Segment<ThemeMode>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const householdSegments: Segment<HouseholdMode>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'away', label: 'Away' },
];

export function SettingsScreen() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getTheme);
  const [householdMode, setHouseholdMode] = useState<HouseholdMode>(() => getHouseholdState().mode);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleHouseholdChange = (mode: HouseholdMode) => {
    setHouseholdMode(mode);
    setHouseholdState({ ...getHouseholdState(), mode });
  };

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
                value={householdMode}
                onChange={handleHouseholdChange}
                ariaLabel="Household mode"
              />
            </div>
            {householdMode === 'away' && (
              <div className="settings-hint">
                Away mode pauses meal logging and treats skipped recipes as neutral.
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
