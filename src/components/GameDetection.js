import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

const DetectionContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
`;

const DetectionCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 70, 85, 0.2);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DetectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$isRunning ? 'var(--success-green)' : 'var(--primary-red)'};
  }
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.$isRunning ? 'var(--success-green)' : 'var(--primary-red)'};
    margin: 0;
  }
`;

const DetectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$isRunning ? 'var(--success-green)' : '#888'};
    animation: ${props => props.$isRunning ? 'pulse 2s infinite' : 'none'};
  }
  
  span {
    font-size: 0.75rem;
    color: #ccc;
  }
`;

const GameInfo = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    
    .label {
      color: #888;
    }
    
    .value {
      color: #fff;
      font-weight: 500;
    }
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 70, 85, 0.1);
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.$connected ? 'var(--success-green)' : '#888'};
  }
  
  span {
    font-size: 0.75rem;
    color: ${props => props.$connected ? 'var(--success-green)' : '#888'};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 1.2rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #fff;
  }
`;

function GameDetection({ gameStatus }) {
  const [isVisible, setIsVisible] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (gameStatus?.isGameRunning && !isVisible) {
      setIsVisible(true);
    }
    
    if (gameStatus?.lastUpdate) {
      setLastUpdate(gameStatus.lastUpdate);
    }
    
    const checkApiConnection = async () => {
      try {
        const response = await fetch('https://127.0.0.1:2999/liveclientdata/activeplayer', {
          method: 'GET',
          timeout: 3000
        });
        setApiConnected(response.ok);
      } catch (error) {
        setApiConnected(false);
      }
    };
    
    if (gameStatus?.isGameRunning) {
      checkApiConnection();
    }
  }, [gameStatus, isVisible]);

  const formatLastUpdate = (date) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return 'Agora';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m atrás`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  if (!isVisible) return null;

  return (
    <DetectionContainer
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        <DetectionCard
          key="detection-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CloseButton onClick={() => setIsVisible(false)}>
            ×
          </CloseButton>
          
          <DetectionHeader $isRunning={gameStatus?.isGameRunning}>
            <Gamepad2 />
            <h4>Detecção de Jogo</h4>
          </DetectionHeader>
          
          <DetectionStatus $isRunning={gameStatus?.isGameRunning}>
            <div className="status-indicator" />
            <span>
              {gameStatus?.isGameRunning ? 'Valorant Detectado' : 'Aguardando Valorant'}
            </span>
          </DetectionStatus>
          
          {gameStatus?.isGameRunning && (
            <GameInfo>
              {gameStatus?.currentMatch && (
                <>
                  <div className="info-row">
                    <span className="label">Mapa:</span>
                    <span className="value">{gameStatus.currentMatch.map}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Modo:</span>
                    <span className="value">{gameStatus.currentMatch.mode}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Fase:</span>
                    <span className="value">{gameStatus.currentMatch.phase}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Round:</span>
                    <span className="value">
                      {gameStatus.currentMatch.round}/{gameStatus.currentMatch.maxRounds}
                    </span>
                  </div>
                  {gameStatus.currentMatch.score && (
                    <div className="info-row">
                      <span className="label">Placar:</span>
                      <span className="value">
                        {gameStatus.currentMatch.score.ally} - {gameStatus.currentMatch.score.enemy}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              {gameStatus?.playerData && (
                <>
                  <div className="info-row">
                    <span className="label">Agente:</span>
                    <span className="value">{gameStatus.playerData.agent}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">HP:</span>
                    <span className="value">
                      {gameStatus.playerData.currentHp}/{gameStatus.playerData.maxHp}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Armor:</span>
                    <span className="value">{gameStatus.playerData.armor}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Dinheiro:</span>
                    <span className="value">{gameStatus.playerData.money}</span>
                  </div>
                </>
              )}
            </GameInfo>
          )}
          
          <ConnectionStatus $connected={apiConnected}>
            {apiConnected ? <Wifi /> : <WifiOff />}
            <span>
              API {apiConnected ? 'Conectada' : 'Desconectada'}
            </span>
          </ConnectionStatus>
          
          <div style={{ 
            fontSize: '0.6rem', 
            color: '#666', 
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Última atualização: {formatLastUpdate(lastUpdate)}
          </div>
        </DetectionCard>
      </AnimatePresence>
    </DetectionContainer>
  );
}

export default GameDetection; 