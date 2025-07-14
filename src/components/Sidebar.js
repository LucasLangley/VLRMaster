import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Home, 
  Settings, 
  BarChart3, 
  Crosshair, 
  Map, 
  Target,
  Monitor,
  User,
  Zap,
  TrendingUp
} from 'lucide-react';

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: rgba(15, 20, 25, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 70, 85, 0.1);
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 70, 85, 0.1);
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-red);
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    color: #888;
    margin: 0.5rem 0 0 0;
  }
`;

const Nav = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? '#ff4655' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#a0a0a0'};
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#ff4655' : '#2a2a2a'};
    color: white;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const GameStatus = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: rgba(26, 30, 35, 0.9);
  border-top: 1px solid rgba(255, 70, 85, 0.1);
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: ${props => props.$isRunning ? 'var(--success-green)' : '#888'};
    animation: ${props => props.$isRunning ? 'pulse 2s infinite' : 'none'};
  }
  
  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.$isRunning ? 'var(--success-green)' : '#888'};
  }
`;

const StatusDetails = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const Sidebar = ({ gameStatus }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/overlay', icon: Monitor, label: 'Overlay' },
    { path: '/setups', icon: Map, label: 'Setups' },
    { path: '/crosshairs', icon: Crosshair, label: 'Miras' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/player-profile', icon: User, label: 'Perfil de Jogador' },
    { path: '/settings', icon: Settings, label: 'Configurações' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <SidebarContainer
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Logo>
        <Target />
        <h1>VLRMaster</h1>
        <p>Versão 0.1</p>
      </Logo>
      
      <Nav>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              $active={isActive}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavItem>
          );
        })}
      </Nav>
      
      <GameStatus>
        <StatusHeader $isRunning={gameStatus?.isGameRunning}>
          <div className="status-indicator" />
          <span>
            {gameStatus?.isGameRunning ? 'Valorant Detectado' : 'Valorant Offline'}
          </span>
        </StatusHeader>
        
        <StatusDetails>
          {gameStatus?.isGameRunning ? (
            <>
              <div>🎯 Status: Em Jogo</div>
              <div>🗺️ Mapa: {gameStatus?.currentMatch?.map || 'Carregando...'}</div>
              <div>👤 Agente: {gameStatus?.playerData?.agent || 'Carregando...'}</div>
            </>
          ) : (
            <div>Aguardando Valorant iniciar...</div>
          )}
        </StatusDetails>
      </GameStatus>
    </SidebarContainer>
  );
};

export default Sidebar; 