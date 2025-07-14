import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
  import { 
    Target, 
    TrendingUp, 
    Clock, 
    Users, 
    Award, 
    Activity,
    Zap,
    Shield,
    Crosshair,
    Map,
    Monitor,
    MonitorOff,
    Trophy,
    User
  } from 'lucide-react';
import { ValorantAPI } from '../../services/ValorantAPI';
import styles from './styles.module.css';

const DashboardContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-red);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #aaa;
    font-size: 1.1rem;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'var(--primary-red)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  .stat-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || 'var(--primary-red)'};
  margin-bottom: 0.5rem;
`;

const StatSubtitle = styled.div`
  font-size: 0.875rem;
  color: #666;
`;





const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-red);
    transform: translateY(-2px);
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255, 70, 85, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    
    svg {
      width: 24px;
      height: 24px;
      color: var(--primary-red);
    }
  }
  
  .action-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
  }
  
  .action-description {
    font-size: 0.875rem;
    color: #aaa;
    line-height: 1.4;
  }
`;











function Dashboard({ gameStatus }) {
  const [stats, setStats] = useState({
    totalMatches: 0,
    winRate: 0,
    avgKDA: 0,
    playTime: 0,
    favoriteAgent: 'Unknown',
    currentRank: 'Unranked'
  });
  
  const [overlayActive, setOverlayActive] = useState(false);

  const toggleOverlay = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('toggle-overlay');
      setOverlayActive(!overlayActive);
    }
  };





  useEffect(() => {
    const loadStats = () => {
      setStats({
        totalMatches: 147,
        winRate: 68.5,
        avgKDA: 1.34,
        playTime: 253,
        favoriteAgent: 'Jett',
        currentRank: 'Diamante 2'
      });
    };
    
    loadStats();
  }, []);



  const quickActions = [
    {
      title: overlayActive ? 'Desativar Overlay' : 'Ativar Overlay',
      description: overlayActive ? 'Fechar overlay in-game' : 'Abrir overlay in-game',
      icon: overlayActive ? MonitorOff : Monitor,
      action: toggleOverlay
    },
    {
      title: 'Configurar Overlay',
      description: 'Personalizar overlay in-game',
      icon: Target,
      action: () => {}
    },
    {
      title: 'Ver Setups',
      description: 'Guias e estratégias para cada mapa',
      icon: Map,
      action: () => {}
    },
    {
      title: 'Configurar Mira',
      description: 'Personalizar crosshair',
      icon: Crosshair,
      action: () => {}
    },
    {
      title: 'Ver Analytics',
      description: 'Análise detalhada de performance',
      icon: Activity,
      action: () => {}
    }
  ];

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeSection>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao VLRMaster - Sua ferramenta definitiva para Valorant</p>
      </WelcomeSection>







      <StatsGrid>
        <StatCard 
          color="var(--primary-red)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatHeader>
            <div className="stat-title">
              <Trophy />
              <span>Total de Partidas</span>
            </div>
          </StatHeader>
          <StatValue color="var(--primary-red)">{stats.totalMatches}</StatValue>
          <StatSubtitle>Partidas jogadas</StatSubtitle>
        </StatCard>

        <StatCard 
          color="var(--success-green)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatHeader>
            <div className="stat-title">
              <Target />
              <span>Taxa de Vitória</span>
            </div>
          </StatHeader>
          <StatValue color="var(--success-green)">{stats.winRate}%</StatValue>
          <StatSubtitle>Percentual de vitórias</StatSubtitle>
        </StatCard>

        <StatCard 
          color="var(--accent-blue)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatHeader>
            <div className="stat-title">
              <Activity />
              <span>KDA Médio</span>
            </div>
          </StatHeader>
          <StatValue color="var(--accent-blue)">{stats.avgKDA}</StatValue>
          <StatSubtitle>Kills/Deaths/Assists</StatSubtitle>
        </StatCard>

        <StatCard 
          color="var(--warning-orange)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <StatHeader>
            <div className="stat-title">
              <User />
              <span>Agente Favorito</span>
            </div>
          </StatHeader>
          <StatValue color="var(--warning-orange)">{stats.favoriteAgent}</StatValue>
          <StatSubtitle>Mais jogado</StatSubtitle>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <ActionCard
              key={index}
              onClick={action.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="action-icon">
                <IconComponent />
              </div>
              <div className="action-title">{action.title}</div>
              <div className="action-description">{action.description}</div>
            </ActionCard>
          );
        })}
      </QuickActions>
    </DashboardContainer>
  );
}

export default Dashboard; 