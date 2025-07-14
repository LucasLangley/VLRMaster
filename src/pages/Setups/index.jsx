import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Map, 
  Search, 
  Filter, 
  Star, 
  Play, 
  BookOpen,
  Target,
  Zap,
  Shield,
  Eye
} from 'lucide-react';
import { ValorantAPI } from '../../services/ValorantAPI';
import styles from './styles.module.css';

const SetupsContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-red);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #aaa;
    font-size: 1rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 8px;
    background: rgba(26, 30, 35, 0.8);
    color: white;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-red);
    }
    
    &::placeholder {
      color: #888;
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #888;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 8px;
  background: ${props => props.$active ? 'var(--primary-red)' : 'rgba(255, 70, 85, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--primary-red)'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? 'var(--primary-red)' : 'rgba(255, 70, 85, 0.2)'};
  }
`;

const MapsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MapCard = styled(motion.div)`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-red);
    transform: translateY(-2px);
  }
`;

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  h3 {
    color: var(--primary-red);
    font-size: 1.25rem;
    margin: 0;
  }
  
  .setup-count {
    background: rgba(255, 70, 85, 0.1);
    color: var(--primary-red);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

const MapImage = styled.div`
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #1a1e23 0%, #2a2e33 100%);
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
    color: #666;
  }
`;

const SetupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
`;

const SetupItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 70, 85, 0.1);
  }
  
  .setup-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .setup-icon {
      width: 16px;
      height: 16px;
      color: var(--primary-red);
    }
    
    .setup-name {
      color: #fff;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
  
  .setup-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    svg {
      width: 12px;
      height: 12px;
      color: #ffd700;
    }
    
    span {
      color: #ccc;
      font-size: 0.75rem;
    }
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(26, 30, 35, 0.95);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 70, 85, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--primary-red);
    font-size: 1.5rem;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 1.5rem;
    
    &:hover {
      color: #fff;
    }
  }
`;

function Setups() {
  const [maps, setMaps] = useState([]);
  const [filteredMaps, setFilteredMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filters = [
    { id: 'all', label: 'Todos', count: 0 },
    { id: 'smoke', label: 'Smokes', count: 0 },
    { id: 'flash', label: 'Flashes', count: 0 },
    { id: 'molly', label: 'Mollys', count: 0 },
    { id: 'dart', label: 'Darts', count: 0 }
  ];

  useEffect(() => {
    const loadMapsAndSetups = async () => {
      try {
        const valorantMaps = ValorantAPI.getMaps();
        const mapsWithSetups = valorantMaps.slice(0, 6).map(map => ({
          ...map,
          setups: ValorantAPI.getMapSetups(map.displayName)
        }));
        
        setMaps(mapsWithSetups);
        setFilteredMaps(mapsWithSetups);
      } catch (error) {
        console.error('Erro ao carregar mapas:', error);
      }
    };

    loadMapsAndSetups();
  }, []);

  useEffect(() => {
    let filtered = maps;

    if (searchQuery) {
      filtered = filtered.filter(map => 
        map.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.setups.some(setup => setup.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(map => 
        map.setups.some(setup => setup.type === activeFilter)
      );
    }

    setFilteredMaps(filtered);
  }, [searchQuery, activeFilter, maps]);

  const handleSetupClick = (setup) => {
    setSelectedSetup(setup);
    setShowModal(true);
  };

  const getSetupIcon = (type) => {
    switch (type) {
      case 'smoke': return Shield;
      case 'flash': return Zap;
      case 'molly': return Target;
      case 'dart': return Eye;
      default: return BookOpen;
    }
  };

  return (
    <SetupsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Setups e Utilitários</h1>
        <p>Domine os mapas com os melhores setups e utilitários</p>
      </Header>

      <FilterSection>
        <SearchBox>
          <Search />
          <input
            type="text"
            placeholder="Buscar mapas ou setups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>
        
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            $active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </FilterSection>

      <MapsGrid>
        {filteredMaps.map(map => (
          <MapCard
            key={map.uuid}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <MapHeader>
              <h3>{map.displayName}</h3>
              <div className="setup-count">
                {map.setups.length} setups
              </div>
            </MapHeader>
            
            <MapImage>
              <Map />
            </MapImage>
            
            <SetupsList>
              {map.setups.slice(0, 3).map((setup, index) => {
                const IconComponent = getSetupIcon(setup.type);
                return (
                  <SetupItem
                    key={index}
                    onClick={() => handleSetupClick(setup)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="setup-info">
                      <IconComponent className="setup-icon" />
                      <span className="setup-name">{setup.name}</span>
                    </div>
                    <div className="setup-rating">
                      <Star />
                      <span>{setup.rating}</span>
                    </div>
                  </SetupItem>
                );
              })}
              
              {map.setups.length > 3 && (
                <SetupItem>
                  <div className="setup-info">
                    <span className="setup-name">
                      +{map.setups.length - 3} mais setups
                    </span>
                  </div>
                </SetupItem>
              )}
            </SetupsList>
          </MapCard>
        ))}
      </MapsGrid>

      {showModal && selectedSetup && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <h3>{selectedSetup.name}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </ModalHeader>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                <strong>Tipo:</strong> {selectedSetup.type}
              </p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
                <strong>Dificuldade:</strong> {selectedSetup.difficulty}
              </p>
              <p style={{ color: '#ccc', marginBottom: '1rem' }}>
                <strong>Descrição:</strong> {selectedSetup.description}
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--primary-red)', marginBottom: '0.5rem' }}>
                Instruções:
              </h4>
              <ol style={{ color: '#ccc', paddingLeft: '1.5rem' }}>
                {selectedSetup.instructions.map((instruction, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'var(--primary-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
                onClick={() => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </SetupsContainer>
  );
}

export default Setups; 