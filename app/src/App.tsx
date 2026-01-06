import { useState } from 'react';
import { TabBar, type TabId } from './components/TabBar';
import { InventoryScreen } from './screens/InventoryScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inventory');

  const renderScreen = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryScreen />;
      case 'recipes':
        return <RecipesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <InventoryScreen />;
    }
  };

  return (
    <div className="app">
      <main className="app-content">
        {renderScreen()}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
