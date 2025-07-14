import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, User, Trophy, Target, TrendingUp, Calendar, MapPin, Award } from 'lucide-react';
import { ValorantAPI } from '../../services/ValorantAPI';

const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-red);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    
    svg {
      width: 48px;
      height: 48px;
    }
  }
  
  p {
    font-size: 1.125rem;
    color: #aaa;
    margin: 0;
  }
`;

const SearchCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  
  h3 {
    color: var(--primary-red);
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-description {
    color: #aaa;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const SearchForm = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  min-width: 300px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-red);
    box-shadow: 0 0 0 3px rgba(255, 70, 85, 0.1);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const SearchButton = styled(motion.button)`
  background: var(--primary-red);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e03e4e;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled(motion.div)`
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
`;

const ProfileCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  backdrop-filter: blur(10px);
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .player-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-red), #ff6b7a);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 30px;
        height: 30px;
        color: white;
      }
    }
    
    .player-info {
      h2 {
        color: white;
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
      }
      
      .tagline {
        color: #aaa;
        font-size: 1rem;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  text-align: center;
  
  .stat-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: rgba(255, 70, 85, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 20px;
      height: 20px;
      color: var(--primary-red);
    }
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ApiLimitCard = styled.div`
  background: rgba(255, 70, 85, 0.1);
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  .warning-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    h5 {
      color: var(--primary-red);
      margin: 0;
      font-size: 1.125rem;
    }
  }
  
  .warning-message {
    color: #ccc;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .warning-suggestion {
    color: #aaa;
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const SuccessCard = styled.div`
  background: rgba(0, 212, 170, 0.1);
  border: 1px solid rgba(0, 212, 170, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  .success-message {
    color: #00d4aa;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .success-description {
    color: #aaa;
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const PlayerProfile = () => {
  const [playerSearch, setPlayerSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchPlayerData = async () => {
    if (!playerSearch.includes('#')) {
      alert('Digite no formato: NomeDoJogador#TAG');
      return;
    }

    const [gameName, tagLine] = playerSearch.split('#');
    
    setIsSearching(true);
    setSearchResults(null);

    try {
      const data = await ValorantAPI.getCompletePlayerData(gameName, tagLine);
      
      if (data) {
        setSearchResults(data);
        
        if (data.matchHistory?.error === 'API_FORBIDDEN') {
          alert(`🚨 API Key Limitada\n\n${data.matchHistory.message}\n\n💡 ${data.matchHistory.suggestion}`);
        }
      } else {
        alert('Jogador não encontrado. Verifique o nome e TAG.');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar dados. Verifique sua conexão.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <h1>
          <User />
          Perfil do Jogador
        </h1>
        <p>Busque estatísticas detalhadas de qualquer jogador do Valorant</p>
      </PageHeader>

      <SearchCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>
          <Search />
          Buscar Jogador
        </h3>
        <p className="search-description">
          Digite o RiotID completo para carregar as estatísticas do jogador. 
          Exemplo: <strong>NomeDoJogador#TAG</strong>
        </p>
        
        <SearchForm>
          <SearchInput
            type="text"
            placeholder="Digite o RiotID (ex: NomeDoJogador#TAG)"
            value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPlayerData()}
          />
          <SearchButton
            onClick={searchPlayerData}
            disabled={isSearching || !playerSearch.includes('#')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search />
            {isSearching ? 'Buscando...' : 'Buscar'}
          </SearchButton>
        </SearchForm>
      </SearchCard>

      {searchResults && (
        <ResultsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileCard>
            <div className="profile-header">
              <div className="player-avatar">
                <User />
              </div>
              <div className="player-info">
                <h2>{searchResults.profile.gameName}</h2>
                <p className="tagline">#{searchResults.profile.tagLine}</p>
              </div>
            </div>

            {searchResults.matchHistory?.error === 'API_FORBIDDEN' ? (
              <ApiLimitCard>
                <div className="warning-header">
                  <h5>🚨 API Key com Limitações</h5>
                </div>
                <p className="warning-message">
                  {searchResults.matchHistory.message}
                </p>
                <p className="warning-suggestion">
                  💡 {searchResults.matchHistory.suggestion}
                </p>
              </ApiLimitCard>
            ) : (
              <SuccessCard>
                <p className="success-message">
                  ✅ Perfil encontrado! Dados básicos disponíveis.
                </p>
                <p className="success-description">
                  Para ver estatísticas detalhadas, use sua própria conta associada à API Key.
                </p>
              </SuccessCard>
            )}

            {searchResults.stats && (
              <StatsGrid>
                <StatCard>
                  <div className="stat-icon">
                    <Trophy />
                  </div>
                  <div className="stat-value">{searchResults.stats.winRate}</div>
                  <div className="stat-label">Taxa de Vitória</div>
                </StatCard>
                
                <StatCard>
                  <div className="stat-icon">
                    <Target />
                  </div>
                  <div className="stat-value">{searchResults.stats.avgKDA}</div>
                  <div className="stat-label">KDA Médio</div>
                </StatCard>
                
                <StatCard>
                  <div className="stat-icon">
                    <TrendingUp />
                  </div>
                  <div className="stat-value">{searchResults.stats.totalMatches}</div>
                  <div className="stat-label">Partidas Analisadas</div>
                </StatCard>
                
                <StatCard>
                  <div className="stat-icon">
                    <Award />
                  </div>
                  <div className="stat-value">{searchResults.stats.favoriteAgent}</div>
                  <div className="stat-label">Agente Favorito</div>
                </StatCard>
              </StatsGrid>
            )}
          </ProfileCard>
        </ResultsContainer>
      )}
    </PageContainer>
  );
};

export default PlayerProfile; 