import React from 'react';
import { Routes, Route } from 'react-router';

import Dashboard from './pages/Dashboard';
import Overlay from './pages/Overlay';
import Setups from './pages/Setups';
import Crosshairs from './pages/Crosshairs';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PlayerProfile from './pages/PlayerProfile';

const AppRoutes = ({ gameStatus, systemInfo }) => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard gameStatus={gameStatus} />} />
      <Route path="/overlay" element={<Overlay gameStatus={gameStatus} />} />
      <Route path="/setups" element={<Setups />} />
      <Route path="/crosshairs" element={<Crosshairs />} />
      <Route path="/analytics" element={<Analytics gameStatus={gameStatus} />} />
      <Route path="/player-profile" element={<PlayerProfile />} />
      <Route path="/settings" element={<Settings systemInfo={systemInfo} />} />
    </Routes>
  );
};

export default AppRoutes; 