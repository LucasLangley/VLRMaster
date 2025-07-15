import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Target, 
  Settings, 
  RotateCcw,
  Copy,
  Eye,
  Code,
  Check,
  X,
  Import,
  Download,
  Upload
} from 'lucide-react';
import { ValorantAPI } from '../../services/ValorantAPI';

const CrosshairsContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-red);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  p {
    color: #aaa;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  min-width: 0;
`;

const PreviewColumn = styled.div`
  @media (min-width: 1200px) {
    flex: 0 0 400px;
    margin-left: 2rem;
  }
`;

const StickyPreview = styled.div`
  position: sticky;
  top: 1rem;
  background: rgba(26, 30, 35, 0.98);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 70, 85, 0.4);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
  }
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const PreviewCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background: 
    linear-gradient(135deg, #1a1e24 0%, #0f1419 100%),
    radial-gradient(circle at 50% 50%, rgba(255, 70, 85, 0.03) 0%, transparent 70%);
  border-radius: 12px;
  border: 2px solid rgba(255, 70, 85, 0.2);
  overflow: hidden;
  margin-bottom: 1.5rem;
  
  .reference-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 2;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.03);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 100%;
      background: rgba(255, 255, 255, 0.03);
    }
  }
`;

const CrosshairPreview = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  
  .center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.centerDot ? `${props.centerDotSize * 2}px` : '0px'};
    height: ${props => props.centerDot ? `${props.centerDotSize * 2}px` : '0px'};
    background: ${props => props.color};
    border-radius: 50%;
    opacity: ${props => props.centerDotOpacity || 0};
    ${props => props.showOutline ? `
      box-shadow: 0 0 0 ${props.outlineThickness}px ${props.outlineColor};
    ` : ''}
  }
  
  .inner-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    .line {
      position: absolute;
      background: ${props => props.color};
      opacity: ${props => props.innerLines?.opacity || 1};
      ${props => props.showOutline ? `
        box-shadow: 0 0 0 ${props.outlineThickness}px ${props.outlineColor};
      ` : ''}
      
      &.horizontal-left {
        top: 50%;
        right: ${props => (props.innerLines?.offset || 0)}px;
        transform: translate(100%, -50%);
        width: ${props => (props.innerLines?.length || 0)}px;
        height: ${props => (props.innerLines?.thickness || 0)}px;
      }
      
      &.horizontal-right {
        top: 50%;
        left: ${props => (props.innerLines?.offset || 0)}px;
        transform: translate(-100%, -50%);
        width: ${props => (props.innerLines?.length || 0)}px;
        height: ${props => (props.innerLines?.thickness || 0)}px;
      }
      
      &.vertical-top {
        left: 50%;
        bottom: ${props => (props.innerLines?.offset || 0)}px;
        transform: translate(-50%, 100%);
        width: ${props => (props.innerLines?.thickness || 0)}px;
        height: ${props => (props.innerLines?.lengthVertical || props.innerLines?.length || 0)}px;
      }
      
      &.vertical-bottom {
        left: 50%;
        top: ${props => (props.innerLines?.offset || 0)}px;
        transform: translate(-50%, -100%);
        width: ${props => (props.innerLines?.thickness || 0)}px;
        height: ${props => (props.innerLines?.lengthVertical || props.innerLines?.length || 0)}px;
      }
    }
  }
  
  .outer-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    .line {
      position: absolute;
      background: ${props => props.color};
      opacity: ${props => props.outerLines?.opacity || 0.35};
      ${props => props.showOutline ? `
        box-shadow: 0 0 0 ${props.outlineThickness}px ${props.outlineColor};
      ` : ''}
      
      &.horizontal-left {
        top: 50%;
        right: ${props => (props.outerLines?.offset || 0)}px;
        transform: translate(100%, -50%);
        width: ${props => (props.outerLines?.length || 0)}px;
        height: ${props => (props.outerLines?.thickness || 0)}px;
      }
      
      &.horizontal-right {
        top: 50%;
        left: ${props => (props.outerLines?.offset || 0)}px;
        transform: translate(-100%, -50%);
        width: ${props => (props.outerLines?.length || 0)}px;
        height: ${props => (props.outerLines?.thickness || 0)}px;
      }
      
      &.vertical-top {
        left: 50%;
        bottom: ${props => (props.outerLines?.offset || 0)}px;
        transform: translate(-50%, 100%);
        width: ${props => (props.outerLines?.thickness || 0)}px;
        height: ${props => (props.outerLines?.lengthVertical || props.outerLines?.length || 0)}px;
      }
      
      &.vertical-bottom {
        left: 50%;
        top: ${props => (props.outerLines?.offset || 0)}px;
        transform: translate(-50%, -100%);
        width: ${props => (props.outerLines?.thickness || 0)}px;
        height: ${props => (props.outerLines?.lengthVertical || props.outerLines?.length || 0)}px;
      }
    }
  }
`;

const CodeSection = styled.div`
  background: rgba(15, 20, 25, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  margin-bottom: 1rem;
  
  h4 {
    color: var(--primary-red);
    font-size: 1.1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .code-display {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 70, 85, 0.2);
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    word-break: break-all;
    white-space: pre-wrap;
    color: #00ff00;
    line-height: 1.4;
    max-height: 100px;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  
  .code-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const ConfigCard = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  
  h3 {
    color: var(--primary-red);
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 70, 85, 0.2);
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: ${props => props.active ? 'rgba(255, 70, 85, 0.1)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-red)' : '#aaa'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-red)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 70, 85, 0.1);
    color: var(--primary-red);
  }
`;

const ConfigSection = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    color: var(--primary-red);
    font-size: 1.1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .section-description {
    color: #888;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`;

const ConfigRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(15, 20, 25, 0.5);
  border-radius: 8px;
  
  label {
    color: #ccc;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .value-display {
    color: var(--primary-red);
    font-size: 0.875rem;
    font-weight: 600;
    min-width: 40px;
    text-align: right;
  }
`;

const Slider = styled.input`
  width: 120px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary-red);
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--primary-red);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 8px;
  background: rgba(255, 70, 85, 0.1);
  color: var(--primary-red);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  &:hover {
    background: rgba(255, 70, 85, 0.2);
  }
  
  &.primary {
    background: var(--primary-red);
    color: white;
    
    &:hover {
      background: #e53e3e;
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const CodeImportSection = styled.div`
  .import-input {
    width: 100%;
    padding: 1rem;
    background: rgba(15, 20, 25, 0.8);
    border: 1px solid rgba(255, 70, 85, 0.2);
    border-radius: 8px;
    color: #fff;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: var(--primary-red);
    }
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  .color-input {
    width: 60px;
    height: 40px;
    padding: 0;
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }
  
  .color-hex {
    color: #ccc;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${props => props.checked ? 'var(--primary-red)' : '#333'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
`;

function Crosshairs() {
  const [crosshairConfig, setCrosshairConfig] = useState({
    color: '#FFFFFF',
    showOutline: false,
    outlineColor: '#000000',
    outlineThickness: 1,
    outlineOpacity: 1,
    
    centerDot: false,
    centerDotSize: 1,
    centerDotOpacity: 0,
    
    innerLines: {
      show: true,
      thickness: 2,
      length: 3,
      lengthVertical: 6,
      offset: 0,
      opacity: 1,
      showMovementError: false,
      showShootingError: false,
      showMinError: true,
      movementErrorScale: 1,
      firingErrorScale: 1
    },
    
    outerLines: {
      show: false,
      thickness: 2,
      length: 2,
      lengthVertical: 2,
      offset: 10,
      opacity: 0.35,
      showMovementError: true,
      showShootingError: true,
      showMinError: true,
      movementErrorScale: 1,
      firingErrorScale: 1
    },
    
    fadeCrosshairWithFiringError: false,
    showSpectatedPlayerCrosshair: true,
    hideCrosshair: false
  });

  const [activeTab, setActiveTab] = useState('visual');
  const [codeInput, setCodeInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const updateConfig = (path, value) => {
    setCrosshairConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const generateCode = () => {
    try {
      return ValorantAPI.generateCrosshairCode(crosshairConfig);
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      return 'Erro ao gerar código';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const importFromCode = () => {
    try {
      const decoded = ValorantAPI.decodeCrosshairCode(codeInput);
      setCrosshairConfig(decoded);
      setCodeInput('');
    } catch (error) {
      console.error('Erro ao importar código:', error);
      alert('Código inválido. Verifique o formato.');
    }
  };

  const resetConfig = () => {
    setCrosshairConfig({
      color: '#FFFFFF',
      showOutline: false,
      outlineColor: '#000000',
      outlineThickness: 1,
      outlineOpacity: 1,
      
      centerDot: false,
      centerDotSize: 1,
      centerDotOpacity: 0,
      
      innerLines: {
        show: true,
        thickness: 2,
        length: 3,
        lengthVertical: 6,
        offset: 0,
        opacity: 1,
        showMovementError: false,
        showShootingError: false,
        showMinError: true,
        movementErrorScale: 1,
        firingErrorScale: 1
      },
      
      outerLines: {
        show: false,
        thickness: 2,
        length: 2,
        lengthVertical: 2,
        offset: 10,
        opacity: 0.35,
        showMovementError: true,
        showShootingError: true,
        showMinError: true,
        movementErrorScale: 1,
        firingErrorScale: 1
      },
      
      fadeCrosshairWithFiringError: false,
      showSpectatedPlayerCrosshair: true,
      hideCrosshair: false
    });
  };

  return (
    <CrosshairsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>
          <Target />
          Configurador de Miras
        </h1>
        <p>
          Crie e personalize suas miras do Valorant com preview em tempo real. 
          Configure cada aspecto da sua mira e copie o código para usar no jogo.
        </p>
      </Header>

      <MainLayout>
        <ContentArea>
          <ConfigCard>
            <h3>
              <Settings />
              Configurações da Mira
            </h3>

            <TabContainer>
              <Tab 
                active={activeTab === 'visual'} 
                onClick={() => setActiveTab('visual')}
              >
                <Settings />
                Configurações Visuais
              </Tab>
              <Tab 
                active={activeTab === 'code'} 
                onClick={() => setActiveTab('code')}
              >
                <Code />
                Importar Código
              </Tab>
            </TabContainer>

            {activeTab === 'visual' ? (
              <div>
                <ConfigSection>
                  <h4>Cor da Mira</h4>
                  <div className="section-description">
                    Configure a cor principal da mira
                  </div>
                  <ConfigRow>
                    <label>Cor Principal</label>
                    <ColorPicker>
                      <input
                        type="color"
                        value={crosshairConfig.color}
                        onChange={(e) => updateConfig('color', e.target.value)}
                        className="color-input"
                      />
                      <span className="color-hex">{crosshairConfig.color}</span>
                    </ColorPicker>
                  </ConfigRow>
                </ConfigSection>

                <ConfigSection>
                  <h4>Contorno</h4>
                  <div className="section-description">
                    Configure o contorno da mira
                  </div>
                  <ConfigRow>
                    <label>Mostrar Contorno</label>
                    <ToggleSwitch
                      checked={crosshairConfig.showOutline}
                      onClick={() => updateConfig('showOutline', !crosshairConfig.showOutline)}
                    />
                  </ConfigRow>
                  
                  {crosshairConfig.showOutline && (
                    <>
                      <ConfigRow>
                        <label>Cor do Contorno</label>
                        <ColorPicker>
                          <input
                            type="color"
                            value={crosshairConfig.outlineColor}
                            onChange={(e) => updateConfig('outlineColor', e.target.value)}
                            className="color-input"
                          />
                          <span className="color-hex">{crosshairConfig.outlineColor}</span>
                        </ColorPicker>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Opacidade de Contorno</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={crosshairConfig.outlineOpacity}
                            onChange={(e) => updateConfig('outlineOpacity', parseFloat(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outlineOpacity}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Espessura de Contorno</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={crosshairConfig.outlineThickness}
                            onChange={(e) => updateConfig('outlineThickness', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outlineThickness}</span>
                        </div>
                      </ConfigRow>
                    </>
                  )}
                </ConfigSection>

                <ConfigSection>
                  <h4>Ponto Central</h4>
                  <div className="section-description">
                    Configure o ponto central da mira
                  </div>
                  <ConfigRow>
                    <label>Ponto Central</label>
                    <ToggleSwitch
                      checked={crosshairConfig.centerDot}
                      onClick={() => updateConfig('centerDot', !crosshairConfig.centerDot)}
                    />
                  </ConfigRow>
                  
                  {crosshairConfig.centerDot && (
                    <>
                      <ConfigRow>
                        <label>Opacidade do Ponto Central</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={crosshairConfig.centerDotOpacity}
                            onChange={(e) => updateConfig('centerDotOpacity', parseFloat(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.centerDotOpacity}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Espessura do Ponto Central</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={crosshairConfig.centerDotSize}
                            onChange={(e) => updateConfig('centerDotSize', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.centerDotSize}</span>
                        </div>
                      </ConfigRow>
                    </>
                                    )}
                </ConfigSection>

                <ConfigSection>
                  <h4>Configurações Avançadas</h4>
                  <div className="section-description">
                    Configurações especiais da mira
                  </div>
                  <ConfigRow>
                    <label>Sobrepor o deslocamento de erro de disparo pelo deslocamento de retícula</label>
                    <ToggleSwitch
                      checked={crosshairConfig.fadeCrosshairWithFiringError}
                      onClick={() => updateConfig('fadeCrosshairWithFiringError', !crosshairConfig.fadeCrosshairWithFiringError)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Sobrepor todas as retículas primárias pela minha retícula primária</label>
                    <ToggleSwitch
                      checked={crosshairConfig.showSpectatedPlayerCrosshair}
                      onClick={() => updateConfig('showSpectatedPlayerCrosshair', !crosshairConfig.showSpectatedPlayerCrosshair)}
                    />
                  </ConfigRow>
                </ConfigSection>

                <ConfigSection>
                  <h4>Linhas Internas</h4>
                  <div className="section-description">
                    Configure as linhas principais da mira
                  </div>
                  <ConfigRow>
                    <label>Exibir linhas internas</label>
                    <ToggleSwitch
                      checked={crosshairConfig.innerLines.show}
                      onClick={() => updateConfig('innerLines.show', !crosshairConfig.innerLines.show)}
                    />
                  </ConfigRow>
                  
                  {crosshairConfig.innerLines.show && (
                    <>
                      <ConfigRow>
                        <label>Opacidade da Linha Interna</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={crosshairConfig.innerLines.opacity}
                            onChange={(e) => updateConfig('innerLines.opacity', parseFloat(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.opacity}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Comprimento da Linha Interna</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={crosshairConfig.innerLines.length}
                            onChange={(e) => updateConfig('innerLines.length', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.length}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Espessura da Linha Interna</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={crosshairConfig.innerLines.thickness}
                            onChange={(e) => updateConfig('innerLines.thickness', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.thickness}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Deslocamento da Linha Interna</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={crosshairConfig.innerLines.offset}
                            onChange={(e) => updateConfig('innerLines.offset', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.offset}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Erro de Movimento</label>
                        <ToggleSwitch
                          checked={crosshairConfig.innerLines.showMovementError}
                          onClick={() => updateConfig('innerLines.showMovementError', !crosshairConfig.innerLines.showMovementError)}
                        />
                      </ConfigRow>
                      
                      {crosshairConfig.innerLines.showMovementError && (
                        <ConfigRow>
                          <label>Multiplicador de Erro de Movimento</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Slider
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={crosshairConfig.innerLines.movementErrorScale}
                              onChange={(e) => updateConfig('innerLines.movementErrorScale', parseFloat(e.target.value))}
                            />
                            <span className="value-display">{crosshairConfig.innerLines.movementErrorScale}</span>
                          </div>
                        </ConfigRow>
                      )}
                      
                      <ConfigRow>
                        <label>Erro de Disparo</label>
                        <ToggleSwitch
                          checked={crosshairConfig.innerLines.showShootingError}
                          onClick={() => updateConfig('innerLines.showShootingError', !crosshairConfig.innerLines.showShootingError)}
                        />
                      </ConfigRow>
                      
                      {crosshairConfig.innerLines.showShootingError && (
                        <ConfigRow>
                          <label>Multiplicador de Erro de Disparo</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Slider
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={crosshairConfig.innerLines.firingErrorScale}
                              onChange={(e) => updateConfig('innerLines.firingErrorScale', parseFloat(e.target.value))}
                            />
                            <span className="value-display">{crosshairConfig.innerLines.firingErrorScale}</span>
                          </div>
                        </ConfigRow>
                      )}
                    </>
                  )}
                </ConfigSection>

                <ConfigSection>
                  <h4>Linhas Externas</h4>
                  <div className="section-description">
                    Configure as linhas externas da mira
                  </div>
                  <ConfigRow>
                    <label>Exibir Linhas Externas</label>
                    <ToggleSwitch
                      checked={crosshairConfig.outerLines.show}
                      onClick={() => updateConfig('outerLines.show', !crosshairConfig.outerLines.show)}
                    />
                  </ConfigRow>
                  
                  {crosshairConfig.outerLines.show && (
                    <>
                      <ConfigRow>
                        <label>Opacidade da Linha Externa</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={crosshairConfig.outerLines.opacity}
                            onChange={(e) => updateConfig('outerLines.opacity', parseFloat(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.opacity}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Comprimento da Linha Externa</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={crosshairConfig.outerLines.length}
                            onChange={(e) => updateConfig('outerLines.length', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.length}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Espessura da Linha Externa</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={crosshairConfig.outerLines.thickness}
                            onChange={(e) => updateConfig('outerLines.thickness', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.thickness}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Deslocamento da Linha Externa</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Slider
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={crosshairConfig.outerLines.offset}
                            onChange={(e) => updateConfig('outerLines.offset', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.offset}</span>
                        </div>
                      </ConfigRow>
                      
                      <ConfigRow>
                        <label>Erro de Movimento</label>
                        <ToggleSwitch
                          checked={crosshairConfig.outerLines.showMovementError}
                          onClick={() => updateConfig('outerLines.showMovementError', !crosshairConfig.outerLines.showMovementError)}
                        />
                      </ConfigRow>
                      
                      {crosshairConfig.outerLines.showMovementError && (
                        <ConfigRow>
                          <label>Multiplicador de Erro de Movimento</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Slider
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={crosshairConfig.outerLines.movementErrorScale}
                              onChange={(e) => updateConfig('outerLines.movementErrorScale', parseFloat(e.target.value))}
                            />
                            <span className="value-display">{crosshairConfig.outerLines.movementErrorScale}</span>
                          </div>
                        </ConfigRow>
                      )}
                      
                      <ConfigRow>
                        <label>Erro de Disparo</label>
                        <ToggleSwitch
                          checked={crosshairConfig.outerLines.showShootingError}
                          onClick={() => updateConfig('outerLines.showShootingError', !crosshairConfig.outerLines.showShootingError)}
                        />
                      </ConfigRow>
                      
                      {crosshairConfig.outerLines.showShootingError && (
                        <ConfigRow>
                          <label>Multiplicador de Erro de Disparo</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Slider
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={crosshairConfig.outerLines.firingErrorScale}
                              onChange={(e) => updateConfig('outerLines.firingErrorScale', parseFloat(e.target.value))}
                            />
                            <span className="value-display">{crosshairConfig.outerLines.firingErrorScale}</span>
                          </div>
                        </ConfigRow>
                      )}
                    </>
                  )}
                </ConfigSection>

                <ActionButtons>
                  <ActionButton onClick={resetConfig}>
                    <RotateCcw />
                    Resetar
                  </ActionButton>
                </ActionButtons>
              </div>
            ) : (
              <CodeImportSection>
                <h4>Importar Código de Mira</h4>
                <div className="section-description">
                  Cole o código da mira do Valorant para importar as configurações
                </div>
                <textarea
                  className="import-input"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Cole o código da mira aqui (ex: 0;s;1;P;u;000000FF;h;0;f;0;0l;3;0o;0;0a;1;0f;0;1b;0)"
                  rows={4}
                />
                <ActionButtons>
                  <ActionButton onClick={importFromCode} className="primary">
                    <Import />
                    Importar
                  </ActionButton>
                </ActionButtons>
              </CodeImportSection>
            )}
          </ConfigCard>
        </ContentArea>

        <PreviewColumn>
          <StickyPreview>
            <PreviewHeader>
              <h3>
                <Eye />
                Preview
              </h3>
            </PreviewHeader>
            
            <PreviewCanvas>
              <div className="reference-lines" />
              <CrosshairPreview {...crosshairConfig}>
                <div className="center-dot" />
                
                {crosshairConfig.innerLines.show && (
                  <div className="inner-lines">
                    <div className="line horizontal-left" />
                    <div className="line horizontal-right" />
                    <div className="line vertical-top" />
                    <div className="line vertical-bottom" />
                  </div>
                )}
                
                {crosshairConfig.outerLines.show && (
                  <div className="outer-lines">
                    <div className="line horizontal-left" />
                    <div className="line horizontal-right" />
                    <div className="line vertical-top" />
                    <div className="line vertical-bottom" />
                  </div>
                )}
              </CrosshairPreview>
            </PreviewCanvas>
            
            <CodeSection>
              <h4>
                <Code />
                Código da Mira
              </h4>
              <div className="code-display">
                {generateCode()}
              </div>
              <div className="code-actions">
                <ActionButton onClick={copyToClipboard}>
                  {copySuccess ? <Check /> : <Copy />}
                  {copySuccess ? 'Copiado!' : 'Copiar'}
                </ActionButton>
              </div>
            </CodeSection>
          </StickyPreview>
        </PreviewColumn>
      </MainLayout>
    </CrosshairsContainer>
  );
}

export default Crosshairs; 