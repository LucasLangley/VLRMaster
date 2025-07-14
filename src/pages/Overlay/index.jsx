import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Eye, 
  EyeOff, 
  Settings, 
  Palette, 
  Move, 
  RotateCcw,
  Save,
  Play,
  Square,
  X,
  Minimize2
} from 'lucide-react';
import styles from './styles.module.css';

const RealOverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  pointer-events: none;
  z-index: 10000;
`;

const OverlayWidget = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--primary-red);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  pointer-events: auto;
  backdrop-filter: blur(10px);
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    color: var(--primary-red);
    margin: 0;
    font-size: 1.1rem;
    flex: 1;
  }
`;

const OverlayControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const OverlayButton = styled.button`
  background: none;
  border: 1px solid var(--primary-red);
  color: var(--primary-red);
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-red);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const OverlayStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid rgba(255, 70, 85, 0.2);
    
    .label {
      color: #ccc;
    }
    
    .value {
      color: var(--primary-red);
      font-weight: bold;
    }
  }
`;

const OverlayContainer = styled(motion.div)`
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

const OverlayGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PreviewArea = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  position: relative;
  min-height: 500px;
`;

const PreviewHeader = styled.div`
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

const PreviewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
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
  
  &.active {
    background: var(--primary-red);
    color: white;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const OverlayPreview = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: 
    linear-gradient(45deg, transparent 49%, rgba(255, 70, 85, 0.1) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(255, 70, 85, 0.1) 50%, transparent 51%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000"/><text x="50%" y="50%" text-anchor="middle" fill="%23333" font-size="20">Game Preview</text></svg>') center/cover;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 70, 85, 0.2);
`;

const OverlayElement = styled(motion.div)`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  cursor: ${props => props.draggable ? 'move' : 'default'};
  
  &.stats {
    top: 20px;
    right: 20px;
    min-width: 200px;
  }
  
  &.crosshair {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: transparent;
    border: 2px solid var(--primary-red);
  }
  
  &.minimap {
    bottom: 20px;
    right: 20px;
    width: 150px;
    height: 150px;
    background: rgba(0, 0, 0, 0.9);
  }
  
  &.abilities {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
  }
`;

const ConfigPanel = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  height: fit-content;
`;

const ConfigHeader = styled.div`
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

const ConfigSection = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
`;

const ConfigItem = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    color: #ccc;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-red);
  }
`;

const Slider = styled.input`
  width: 100px;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--primary-red);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  
  .color-option {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid ${props => props.selected ? 'var(--primary-red)' : 'transparent'};
    transition: all 0.3s ease;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 8px;
  background: rgba(255, 70, 85, 0.1);
  color: var(--primary-red);
  font-size: 0.875rem;
  font-weight: 500;
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
    margin-right: 0.5rem;
  }
`;

const isRealOverlay = () => {
  return window.location.pathname === '/overlay' && window.location.search.includes('real=true');
};

function Overlay({ gameStatus }) {
  const [overlayConfig, setOverlayConfig] = useState({
    stats: {
      enabled: true,
      opacity: 0.9,
      position: 'top-right'
    },
    crosshair: {
      enabled: true,
      color: '#ff4655',
      size: 2,
      opacity: 0.8
    },
    minimap: {
      enabled: true,
      opacity: 0.7,
      size: 'medium'
    },
    abilities: {
      enabled: true,
      opacity: 0.8,
      showCooldowns: true
    }
  });
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('vlrmaster_overlay_config');
    if (savedConfig) {
      setOverlayConfig(JSON.parse(savedConfig));
    }

    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      ipcRenderer.on('toggle-overlay', () => {
        setMinimized(!minimized);
      });
      
      ipcRenderer.on('toggle-crosshair', () => {
        toggleOverlayElement('crosshair');
      });
    }
  }, [minimized]);

  const closeOverlay = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('close-overlay');
    }
  };

  const toggleOverlayElement = (element) => {
    setOverlayConfig(prev => ({
      ...prev,
      [element]: {
        ...prev[element],
        enabled: !prev[element].enabled
      }
    }));
  };

  const updateOverlayConfig = (element, property, value) => {
    setOverlayConfig(prev => ({
      ...prev,
      [element]: {
        ...prev[element],
        [property]: value
      }
    }));
  };

  const saveConfiguration = () => {
    localStorage.setItem('vlrmaster_overlay_config', JSON.stringify(overlayConfig));

  };

  const resetConfiguration = () => {
    setOverlayConfig({
      stats: {
        enabled: true,
        opacity: 0.9,
        position: 'top-right'
      },
      crosshair: {
        enabled: true,
        color: '#ff4655',
        size: 2,
        opacity: 0.8
      },
      minimap: {
        enabled: true,
        opacity: 0.7,
        size: 'medium'
      },
      abilities: {
        enabled: true,
        opacity: 0.8,
        showCooldowns: true
      }
    });
  };

  const colors = ['#ff4655', '#00d4aa', '#53ddf1', '#ff9500', '#ffffff'];

  if (isRealOverlay() || window.location.pathname === '/overlay') {
    return (
      <RealOverlayContainer>
        {!minimized && (
          <OverlayWidget
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OverlayHeader>
              <h3>VLRMaster</h3>
              <OverlayControls>
                <OverlayButton onClick={() => setMinimized(true)}>
                  <Minimize2 />
                </OverlayButton>
                <OverlayButton onClick={closeOverlay}>
                  <X />
                </OverlayButton>
              </OverlayControls>
            </OverlayHeader>
            
            <OverlayStats>
              {gameStatus?.isGameRunning && gameStatus?.currentMatch && (
                <>
                  <div className="stat-item">
                    <span className="label">Mapa</span>
                    <span className="value">{gameStatus.currentMatch.map}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Round</span>
                    <span className="value">{gameStatus.currentMatch.round}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Modo</span>
                    <span className="value">{gameStatus.currentMatch.mode}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">Fase</span>
                    <span className="value">{gameStatus.currentMatch.phase}</span>
                  </div>
                </>
              )}
              
              {gameStatus?.playerData && (
                <>
                  <div className="stat-item">
                    <span className="label">Agente</span>
                    <span className="value">{gameStatus.playerData.agent}</span>
                  </div>
                  <div className="stat-item">
                    <span className="label">K/D</span>
                    <span className="value">{gameStatus.playerData.kills}/{gameStatus.playerData.deaths}</span>
                  </div>
                </>
              )}
            </OverlayStats>
          </OverlayWidget>
        )}
      </RealOverlayContainer>
    );
  }

  return (
    <OverlayContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Configuração do Overlay</h1>
        <p>Personalize seu overlay in-game para uma experiência otimizada</p>
      </Header>

      <OverlayGrid>
        <PreviewArea>
          <PreviewHeader>
            <h3>Preview do Overlay</h3>
            <PreviewControls>
              <ControlButton
                className={isPreviewMode ? 'active' : ''}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <Square /> : <Play />}
                {isPreviewMode ? 'Parar' : 'Visualizar'}
              </ControlButton>
            </PreviewControls>
          </PreviewHeader>

          <OverlayPreview>
            {overlayConfig.stats.enabled && (
              <OverlayElement
                className="stats"
                style={{ opacity: overlayConfig.stats.opacity }}
                draggable={isPreviewMode}
              >
                <div style={{ marginBottom: '0.5rem', color: 'var(--primary-red)', fontWeight: 'bold' }}>
                  STATS
                </div>
                <div>K/D: 12/8</div>
                <div>Score: 4,520</div>
                <div>Round: 7/13</div>
              </OverlayElement>
            )}

            {overlayConfig.crosshair.enabled && (
              <OverlayElement
                className="crosshair"
                style={{ 
                  opacity: overlayConfig.crosshair.opacity,
                  borderColor: overlayConfig.crosshair.color,
                  borderWidth: overlayConfig.crosshair.size
                }}
              />
            )}

            {overlayConfig.minimap.enabled && (
              <OverlayElement
                className="minimap"
                style={{ opacity: overlayConfig.minimap.opacity }}
              >
                <div style={{ textAlign: 'center', color: 'var(--primary-red)', fontWeight: 'bold' }}>
                  MAPA
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.5rem', color: '#ccc' }}>
                  Minimapa
                </div>
              </OverlayElement>
            )}

            {overlayConfig.abilities.enabled && (
              <OverlayElement
                className="abilities"
                style={{ opacity: overlayConfig.abilities.opacity }}
              >
                <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Q
                </div>
                <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  E
                </div>
                <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  C
                </div>
                <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  X
                </div>
              </OverlayElement>
            )}
          </OverlayPreview>
        </PreviewArea>

        <ConfigPanel>
          <ConfigHeader>
            <h3>Configurações</h3>
            <Settings size={20} />
          </ConfigHeader>

          <ConfigSection>
            <h4>Estatísticas</h4>
            <ConfigItem>
              <Toggle>
                <input
                  type="checkbox"
                  checked={overlayConfig.stats.enabled}
                  onChange={(e) => updateOverlayConfig('stats', 'enabled', e.target.checked)}
                />
                <label>Mostrar estatísticas</label>
              </Toggle>
            </ConfigItem>
            <ConfigItem>
              <label>Opacidade</label>
              <Slider
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={overlayConfig.stats.opacity}
                onChange={(e) => updateOverlayConfig('stats', 'opacity', parseFloat(e.target.value))}
              />
            </ConfigItem>
          </ConfigSection>

          <ConfigSection>
            <h4>Mira</h4>
            <ConfigItem>
              <Toggle>
                <input
                  type="checkbox"
                  checked={overlayConfig.crosshair.enabled}
                  onChange={(e) => updateOverlayConfig('crosshair', 'enabled', e.target.checked)}
                />
                <label>Mostrar mira customizada</label>
              </Toggle>
            </ConfigItem>
            <ConfigItem>
              <label>Cor da mira</label>
              <ColorPicker>
                {colors.map(color => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={() => updateOverlayConfig('crosshair', 'color', color)}
                  />
                ))}
              </ColorPicker>
            </ConfigItem>
            <ConfigItem>
              <label>Tamanho</label>
              <Slider
                type="range"
                min="1"
                max="5"
                step="1"
                value={overlayConfig.crosshair.size}
                onChange={(e) => updateOverlayConfig('crosshair', 'size', parseInt(e.target.value))}
              />
            </ConfigItem>
          </ConfigSection>

          <ConfigSection>
            <h4>Minimapa</h4>
            <ConfigItem>
              <Toggle>
                <input
                  type="checkbox"
                  checked={overlayConfig.minimap.enabled}
                  onChange={(e) => updateOverlayConfig('minimap', 'enabled', e.target.checked)}
                />
                <label>Mostrar minimapa</label>
              </Toggle>
            </ConfigItem>
            <ConfigItem>
              <label>Opacidade</label>
              <Slider
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={overlayConfig.minimap.opacity}
                onChange={(e) => updateOverlayConfig('minimap', 'opacity', parseFloat(e.target.value))}
              />
            </ConfigItem>
          </ConfigSection>

          <ConfigSection>
            <h4>Habilidades</h4>
            <ConfigItem>
              <Toggle>
                <input
                  type="checkbox"
                  checked={overlayConfig.abilities.enabled}
                  onChange={(e) => updateOverlayConfig('abilities', 'enabled', e.target.checked)}
                />
                <label>Mostrar habilidades</label>
              </Toggle>
            </ConfigItem>
            <ConfigItem>
              <Toggle>
                <input
                  type="checkbox"
                  checked={overlayConfig.abilities.showCooldowns}
                  onChange={(e) => updateOverlayConfig('abilities', 'showCooldowns', e.target.checked)}
                />
                <label>Mostrar cooldowns</label>
              </Toggle>
            </ConfigItem>
          </ConfigSection>

          <ActionButtons>
            <ActionButton onClick={resetConfiguration}>
              <RotateCcw />
              Resetar
            </ActionButton>
            <ActionButton className="primary" onClick={saveConfiguration}>
              <Save />
              Salvar
            </ActionButton>
          </ActionButtons>
        </ConfigPanel>
      </OverlayGrid>
    </OverlayContainer>
  );
}

export default Overlay; 