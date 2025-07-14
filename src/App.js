import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import AppRoutes from './routes';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import { ValorantAPI } from './services/ValorantAPI';
import { GameDetectionService } from './services/GameDetectionService';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1e23 100%);
  color: #fff;
`;

const MainContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  const [gameStatus, setGameStatus] = useState({
    isGameRunning: false,
    currentMatch: null,
    playerData: null
  });
  
  const [systemInfo, setSystemInfo] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isElectronApp, setIsElectronApp] = useState(false);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Detectar se está rodando no Electron
        const electronDetected = !!(window.electron || window.navigator.userAgent.includes('Electron'));
        setIsElectronApp(electronDetected);
        
        if (electronDetected && window.electron) {
          const info = await window.electron.invoke('get-system-info');
          setSystemInfo(info);
        } else {
          // Dados mock para ambiente web
          setSystemInfo({
            platform: 'web',
            arch: 'web',
            memory: 'N/A',
            cpu: 'N/A'
          });
        }
        
        GameDetectionService.startDetection((status) => {
          setGameStatus(status);
        });
        
        ValorantAPI.initialize();
        
      } catch (error) {
        console.error('Erro ao inicializar serviços:', error);
      }
    };
    
    initializeServices();
    
    return () => {
      GameDetectionService.stopDetection();
    };
  }, []);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
    if (isElectronApp && window.electron) {
      window.electron.invoke('toggle-overlay');
    }
  };

  return (
    <Router>
      <AppContainer>
        <Sidebar gameStatus={gameStatus} />
        
        <MainContent
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header 
            gameStatus={gameStatus}
            systemInfo={systemInfo}
            onToggleOverlay={toggleOverlay}
            overlayVisible={overlayVisible}
          />
          
          {!isElectronApp && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(90deg, #ff4655, #ff6b47)',
                padding: '10px 20px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ⚠️ Versão Web: Algumas funcionalidades (overlay, detecção de processos) são limitadas. 
              <a href="#" style={{ color: '#fff', textDecoration: 'underline', marginLeft: '10px' }}>
                Baixe o app desktop para experiência completa
              </a>
            </motion.div>
          )}
          
          <ContentArea>
            <AppRoutes gameStatus={gameStatus} systemInfo={systemInfo} />
          </ContentArea>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 