import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  Award,
  Users,
  Clock,
  Zap
} from 'lucide-react';

const AnalyticsContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-red);
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 8px;
  background: rgba(255, 70, 85, 0.1);
  color: var(--primary-red);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 70, 85, 0.2);
  }
  
  &.primary {
    background: var(--primary-red);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  position: relative;
  
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
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.color || 'rgba(255, 70, 85, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.color || 'var(--primary-red)'};
    }
  }
  
  .stat-trend {
    font-size: 0.875rem;
    color: ${props => props.trending === 'up' ? 'var(--success-green)' : 
                      props.trending === 'down' ? 'var(--danger-red)' : '#888'};
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.color || 'var(--primary-red)'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--primary-red);
    font-size: 1.25rem;
    margin: 0;
  }
  
  .chart-filters {
    display: flex;
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 6px;
  background: ${props => props.$active ? 'var(--primary-red)' : 'rgba(255, 70, 85, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--primary-red)'};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? 'var(--primary-red)' : 'rgba(255, 70, 85, 0.2)'};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  background: rgba(15, 20, 25, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="chart-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23333" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23chart-grid)"/></svg>');
    opacity: 0.3;
  }
`;

const PerformanceTable = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--primary-red);
    font-size: 1.25rem;
    margin: 0;
  }
`;

const Table = styled.div`
  .table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    background: rgba(15, 20, 25, 0.5);
    border-radius: 8px;
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 70, 85, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 70, 85, 0.05);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .match-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    .match-map {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: rgba(255, 70, 85, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: var(--primary-red);
    }
    
    .match-details {
      .match-name {
        font-weight: 500;
        color: #fff;
        font-size: 0.875rem;
      }
      
      .match-time {
        font-size: 0.75rem;
        color: #888;
      }
    }
  }
  
  .stat-value {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #ccc;
    
    &.positive {
      color: var(--success-green);
    }
    
    &.negative {
      color: var(--danger-red);
    }
  }
`;

const GameStatusAlert = styled(motion.div)`
  background: ${props => props.$isRunning 
    ? 'rgba(0, 212, 170, 0.1)' 
    : 'rgba(136, 136, 136, 0.1)'};
  border: 1px solid ${props => props.$isRunning 
    ? 'var(--success-green)' 
    : '#888'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .status-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.$isRunning 
      ? 'var(--success-green)' 
      : '#888'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .status-text {
    flex: 1;
    
    h4 {
      color: ${props => props.$isRunning 
        ? 'var(--success-green)' 
        : '#888'};
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }
    
    p {
      color: #aaa;
      margin: 0;
      font-size: 0.875rem;
    }
  }
`;

function Analytics({ gameStatus }) {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [chartFilter, setChartFilter] = useState('kda');
  const [stats, setStats] = useState({});
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    const loadAnalytics = () => {
      setStats({
        totalMatches: 147,
        winRate: 68.5,
        avgKDA: 1.34,
        avgScore: 4847,
        headshots: 31.2,
        rank: 'Diamante 2'
      });
      
      setRecentMatches([
        {
          id: 1,
          map: 'Bind',
          mode: 'Competitivo',
          result: 'win',
          kills: 18,
          deaths: 12,
          assists: 4,
          kda: 1.83,
          score: 4250,
          agent: 'Jett',
          time: '2h atrás'
        },
        {
          id: 2,
          map: 'Ascent',
          mode: 'Competitivo',
          result: 'loss',
          kills: 15,
          deaths: 16,
          assists: 6,
          kda: 1.31,
          score: 3890,
          agent: 'Phoenix',
          time: '5h atrás'
        },
        {
          id: 3,
          map: 'Haven',
          mode: 'Competitivo',
          result: 'win',
          kills: 22,
          deaths: 10,
          assists: 3,
          kda: 2.50,
          score: 5120,
          agent: 'Reyna',
          time: '1d atrás'
        }
      ]);
    };
    
    loadAnalytics();
  }, [timeFilter]);

  const timeFilters = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: '90d', label: '3 meses' }
  ];

  const chartFilters = [
    { id: 'kda', label: 'K/D/A' },
    { id: 'score', label: 'Score' },
    { id: 'winrate', label: 'Win Rate' }
  ];

  return (
    <AnalyticsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Analytics</h1>
        <div className="header-actions">
          <ActionButton>
            <RefreshCw />
            Atualizar
          </ActionButton>
          <ActionButton>
            <Download />
            Exportar
          </ActionButton>
        </div>
      </Header>

      {gameStatus && (
        <GameStatusAlert
          $isRunning={gameStatus.isGameRunning}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="status-icon">
            {gameStatus.isGameRunning ? '🎮' : '⏸️'}
          </div>
          <div className="status-text">
            <h4>
              {gameStatus.isGameRunning ? 'Coletando dados em tempo real' : 'Aguardando jogo'}
            </h4>
            <p>
              {gameStatus.isGameRunning 
                ? 'Estatísticas da partida atual sendo registradas'
                : 'Inicie o Valorant para começar a coletar dados'
              }
            </p>
          </div>
        </GameStatusAlert>
      )}

      <StatsOverview>
        <StatCard
          color="var(--primary-red)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatHeader color="var(--primary-red)" trending="up">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              +12%
            </div>
          </StatHeader>
          <StatValue color="var(--primary-red)">{stats.totalMatches}</StatValue>
          <StatLabel>Partidas Totais</StatLabel>
        </StatCard>

        <StatCard
          color="var(--success-green)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatHeader color="var(--success-green)" trending="up">
            <div className="stat-icon">
              <Award />
            </div>
            <div className="stat-trend">
              <TrendingUp size={14} />
              +5.2%
            </div>
          </StatHeader>
          <StatValue color="var(--success-green)">{stats.winRate}%</StatValue>
          <StatLabel>Taxa de Vitória</StatLabel>
        </StatCard>

        <StatCard
          color="var(--accent-blue)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatHeader color="var(--accent-blue)" trending="stable">
            <div className="stat-icon">
              <Target />
            </div>
            <div className="stat-trend">
              <span>-</span>
              0.1%
            </div>
          </StatHeader>
          <StatValue color="var(--accent-blue)">{stats.avgKDA}</StatValue>
          <StatLabel>K/D/A Médio</StatLabel>
        </StatCard>

        <StatCard
          color="var(--warning-orange)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatHeader color="var(--warning-orange)" trending="down">
            <div className="stat-icon">
              <Zap />
            </div>
            <div className="stat-trend">
              <span>↓</span>
              -2.1%
            </div>
          </StatHeader>
          <StatValue color="var(--warning-orange)">{stats.avgScore}</StatValue>
          <StatLabel>Score Médio</StatLabel>
        </StatCard>
      </StatsOverview>

      <ChartsSection>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ChartHeader>
            <h3>Performance ao Longo do Tempo</h3>
            <div className="chart-filters">
              {chartFilters.map(filter => (
                              <FilterButton
                key={filter.id}
                $active={chartFilter === filter.id}
                onClick={() => setChartFilter(filter.id)}
              >
                {filter.label}
              </FilterButton>
              ))}
            </div>
          </ChartHeader>
          <ChartContainer>
            <div>
              📊 Gráfico de {chartFilters.find(f => f.id === chartFilter)?.label}
              <br />
              <small>Implementação do gráfico aqui</small>
            </div>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ChartHeader>
            <h3>Agentes Mais Jogados</h3>
          </ChartHeader>
          <ChartContainer>
            <div>
              🎯 Distribuição de Agentes
              <br />
              <small>Jett • Phoenix • Reyna</small>
            </div>
          </ChartContainer>
        </ChartCard>
      </ChartsSection>

      <PerformanceTable>
        <TableHeader>
          <h3>Partidas Recentes</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {timeFilters.map(filter => (
              <FilterButton
                key={filter.id}
                $active={timeFilter === filter.id}
                onClick={() => setTimeFilter(filter.id)}
              >
                {filter.label}
              </FilterButton>
            ))}
          </div>
        </TableHeader>
        
        <Table>
          <div className="table-header">
            <div>Partida</div>
            <div>Resultado</div>
            <div>K/D/A</div>
            <div>Score</div>
            <div>Agente</div>
            <div>Tempo</div>
          </div>
          
          {recentMatches.map(match => (
            <div key={match.id} className="table-row">
              <div className="match-info">
                <div className="match-map">{match.map[0]}</div>
                <div className="match-details">
                  <div className="match-name">{match.map}</div>
                  <div className="match-time">{match.mode}</div>
                </div>
              </div>
              <div className={`stat-value ${match.result === 'win' ? 'positive' : 'negative'}`}>
                {match.result === 'win' ? 'Vitória' : 'Derrota'}
              </div>
              <div className="stat-value">
                {match.kills}/{match.deaths}/{match.assists}
              </div>
              <div className="stat-value">{match.score.toLocaleString()}</div>
              <div className="stat-value">{match.agent}</div>
              <div className="stat-value">{match.time}</div>
            </div>
          ))}
        </Table>
      </PerformanceTable>
    </AnalyticsContainer>
  );
}

export default Analytics; 