import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Settings,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

const HeaderContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(26, 30, 35, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 70, 85, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    background: ${props => props.$isRunning 
      ? 'rgba(0, 212, 170, 0.1)' 
      : 'rgba(136, 136, 136, 0.1)'};
    color: ${props => props.$isRunning 
      ? 'var(--success-green)' 
      : '#888'};
    border: 1px solid ${props => props.$isRunning 
      ? 'var(--success-green)' 
      : '#888'};
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$isRunning 
      ? 'var(--success-green)' 
      : '#888'};
    animation: ${props => props.$isRunning 
      ? 'pulse 2s infinite' 
      : 'none'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #aaa;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: var(--border-radius-md);
  background: rgba(255, 70, 85, 0.1);
  color: var(--primary-red);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 70, 85, 0.2);
    border-color: var(--primary-red);
  }
  
  &.active {
    background: var(--primary-red);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const WindowControls = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const WindowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.close:hover {
    background: var(--primary-red);
    color: white;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

function Header({ gameStatus, systemInfo, onToggleOverlay, overlayVisible }) {
  const formatMemoryUsage = (bytes) => {
    if (!bytes) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.invoke('minimize-window');
    }
  };

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.invoke('maximize-window');
    }
  };

  const handleClose = () => {
    if (window.electron) {
      window.electron.invoke('close-window');
    }
  };

  return (
    <HeaderContainer
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LeftSection>
        <GameInfo $isRunning={gameStatus?.isGameRunning}>
          <div className="status-badge">
            <div className="status-dot" />
            <span>
              {gameStatus?.isGameRunning ? 'Valorant Ativo' : 'Aguardando Jogo'}
            </span>
          </div>
          {gameStatus?.isGameRunning && gameStatus?.currentMatch && (
            <span style={{ color: '#aaa', fontSize: '0.875rem' }}>
              {gameStatus.currentMatch.map} • {gameStatus.playerData?.agent}
            </span>
          )}
        </GameInfo>
      </LeftSection>

      <RightSection>
        <SystemInfo>
          <InfoItem>
            <Cpu />
            <span>{systemInfo?.cpu || 'Carregando...'}</span>
          </InfoItem>
          <InfoItem>
            <HardDrive />
            <span>{formatMemoryUsage(systemInfo?.memory)}</span>
          </InfoItem>
          <InfoItem>
            <Wifi />
            <span>Online</span>
          </InfoItem>
        </SystemInfo>

        <ButtonGroup>
          <ActionButton
            onClick={onToggleOverlay}
            className={overlayVisible ? 'active' : ''}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Monitor />
            <span>{overlayVisible ? 'Overlay Ativo' : 'Ativar Overlay'}</span>
          </ActionButton>
        </ButtonGroup>

        <WindowControls>
          <WindowButton onClick={handleMinimize}>
            <Minimize2 />
          </WindowButton>
          <WindowButton onClick={handleMaximize}>
            <Maximize2 />
          </WindowButton>
          <WindowButton className="close" onClick={handleClose}>
            <X />
          </WindowButton>
        </WindowControls>
      </RightSection>
    </HeaderContainer>
  );
}

export default Header; 