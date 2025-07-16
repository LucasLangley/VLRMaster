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
  Upload,
  Link,
  Unlink
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
  height: 250px;
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

const CrosshairPreview = styled.div.attrs({
  shouldForwardProp: (prop) => !['color', 'showOutline', 'outlineColor', 'outlineThickness', 'outlineOpacity', 'centerDot', 'centerDotSize', 'centerDotOpacity', 'innerLines', 'outerLines', 'fadeCrosshairWithFiringError'].includes(prop),
})`
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
    width: ${props => (props.centerDot ? `${props.centerDotSize * 2 * scaleFactor}px` : '0px')};
    height: ${props => (props.centerDot ? `${props.centerDotSize * 2 * scaleFactor}px` : '0px')};
    background: ${props => props.color};
    border-radius: 50%;
    opacity: ${props => props.centerDotOpacity || 0};
    ${props => props.showOutline ? `box-shadow: 0 0 0 ${props.outlineThickness * scaleFactor}px rgba(${parseInt(props.outlineColor.slice(1,3),16)}, ${parseInt(props.outlineColor.slice(3,5),16)}, ${parseInt(props.outlineColor.slice(5,7),16)}, ${props.outlineOpacity});` : ''}
  }
  
  .inner-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => {
      if (props.fadeCrosshairWithFiringError && props.innerLines?.showShootingError) {
        return props.innerLines.opacity * 0.5; // Simula fade reduzindo opacidade
      }
      return props.innerLines?.opacity || 1;
    }};
    
    .line {
      position: absolute;
      background: ${props => props.color};
      opacity: ${props => props.innerLines?.opacity || 1};
      ${props => props.showOutline ? `box-shadow: 0 0 0 ${props.outlineThickness * scaleFactor}px rgba(${parseInt(props.outlineColor.slice(1,3),16)}, ${parseInt(props.outlineColor.slice(3,5),16)}, ${parseInt(props.outlineColor.slice(5,7),16)}, ${props.outlineOpacity});` : ''}
      
      &.horizontal-left {
        top: 50%;
        right: ${props => {
          const baseOffset = (props.innerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.innerLines?.showShootingError) ? props.innerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(100%, -50%);
        width: ${props => ((props.innerLines?.length || 0) * scaleFactor)}px;
        height: ${props => ((props.innerLines?.thickness || 0) * scaleFactor)}px;
      }
      
      &.horizontal-right {
        top: 50%;
        left: ${props => {
          const baseOffset = (props.innerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.innerLines?.showShootingError) ? props.innerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-100%, -50%);
        width: ${props => ((props.innerLines?.length || 0) * scaleFactor)}px;
        height: ${props => ((props.innerLines?.thickness || 0) * scaleFactor)}px;
      }
      
      &.vertical-top {
        left: 50%;
        bottom: ${props => {
          const baseOffset = (props.innerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.innerLines?.showShootingError) ? props.innerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-50%, 100%);
        width: ${props => ((props.innerLines?.thickness || 0) * scaleFactor)}px;
        height: ${props => ((props.innerLines?.lengthVertical || props.innerLines?.length || 0) * scaleFactor)}px;
      }
      
      &.vertical-bottom {
        left: 50%;
        top: ${props => {
          const baseOffset = (props.innerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.innerLines?.showShootingError) ? props.innerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-50%, -100%);
        width: ${props => ((props.innerLines?.thickness || 0) * scaleFactor)}px;
        height: ${props => ((props.innerLines?.lengthVertical || props.innerLines?.length || 0) * scaleFactor)}px;
      }
    }
  }
  
  .outer-lines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => {
      if (props.fadeCrosshairWithFiringError && props.outerLines?.showShootingError) {
        return props.outerLines.opacity * 0.5; // Simula fade reduzindo opacidade
      }
      return props.outerLines?.opacity || 0.35;
    }};
    
    .line {
      position: absolute;
      background: ${props => props.color};
      opacity: ${props => props.outerLines?.opacity || 0.35};
      ${props => props.showOutline ? `box-shadow: 0 0 0 ${props.outlineThickness * scaleFactor}px rgba(${parseInt(props.outlineColor.slice(1,3),16)}, ${parseInt(props.outlineColor.slice(3,5),16)}, ${parseInt(props.outlineColor.slice(5,7),16)}, ${props.outlineOpacity});` : ''}
      
      &.horizontal-left {
        top: 50%;
        right: ${props => {
          const baseOffset = (props.outerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.outerLines?.showShootingError) ? props.outerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(100%, -50%);
        width: ${props => ((props.outerLines?.length || 0) * scaleFactor)}px;
        height: ${props => ((props.outerLines?.thickness || 0) * scaleFactor)}px;
      }
      
      &.horizontal-right {
        top: 50%;
        left: ${props => {
          const baseOffset = (props.outerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.outerLines?.showShootingError) ? props.outerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-100%, -50%);
        width: ${props => ((props.outerLines?.length || 0) * scaleFactor)}px;
        height: ${props => ((props.outerLines?.thickness || 0) * scaleFactor)}px;
      }
      
      &.vertical-top {
        left: 50%;
        bottom: ${props => {
          const baseOffset = (props.outerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.outerLines?.showShootingError) ? props.outerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-50%, 100%);
        width: ${props => ((props.outerLines?.thickness || 0) * scaleFactor)}px;
        height: ${props => ((props.outerLines?.lengthVertical || props.outerLines?.length || 0) * scaleFactor)}px;
      }
      
      &.vertical-bottom {
        left: 50%;
        top: ${props => {
          const baseOffset = (props.outerLines?.offset || 0) * scaleFactor;
          const firingOffset = (!props.fadeCrosshairWithFiringError && props.outerLines?.showShootingError) ? props.outerLines.firingErrorScale * 5 * scaleFactor : 0;
          return `${baseOffset + firingOffset}px`;
        }};
        transform: translate(-50%, -100%);
        width: ${props => ((props.outerLines?.thickness || 0) * scaleFactor)}px;
        height: ${props => ((props.outerLines?.lengthVertical || props.outerLines?.length || 0) * scaleFactor)}px;
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

const LinkButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 4px;
  background: ${props => props.linked ? 'rgba(255, 70, 85, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.linked ? 'var(--primary-red)' : '#888'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.linked ? 'rgba(255, 70, 85, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.linked ? 'var(--primary-red)' : '#ccc'};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LengthControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .length-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .slider-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }
  }
  
  .link-container {
    display: flex;
    justify-content: center;
    margin: 0.25rem 0;
  }
`;

const scaleFactor = 1.5; // Ajustado para preview menor e proporcional

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
      showShootingError: true,
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

  const [codeInput, setCodeInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [innerLinesLinked, setInnerLinesLinked] = useState(false);
  const [outerLinesLinked, setOuterLinesLinked] = useState(false);

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

  const handleInnerLengthChange = (type, value) => {
    if (innerLinesLinked) {
      updateConfig('innerLines.length', value);
      updateConfig('innerLines.lengthVertical', value);
    } else {
      updateConfig(`innerLines.${type}`, value);
    }
  };

  const handleOuterLengthChange = (type, value) => {
    if (outerLinesLinked) {
      updateConfig('outerLines.length', value);
      updateConfig('outerLines.lengthVertical', value);
    } else {
      updateConfig(`outerLines.${type}`, value);
    }
  };

  const toggleInnerLinesLink = () => {
    setInnerLinesLinked(!innerLinesLinked);
    if (!innerLinesLinked) {
      // Quando conecta, sincroniza o valor vertical com o horizontal
      updateConfig('innerLines.lengthVertical', crosshairConfig.innerLines.length);
    }
  };

  const toggleOuterLinesLink = () => {
    setOuterLinesLinked(!outerLinesLinked);
    if (!outerLinesLinked) {
      // Quando conecta, sincroniza o valor vertical com o horizontal
      updateConfig('outerLines.lengthVertical', crosshairConfig.outerLines.length);
    }
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
        showShootingError: true,
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

            <div>
                {/* SEÇÃO 1: RETÍCULA */}
                <ConfigSection>
                  <h3 style={{ color: 'var(--primary-red)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    RETÍCULA
                  </h3>
                  
                  <ConfigRow>
                    <label>Cor da retícula</label>
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

                  <ConfigRow>
                    <label>Contornos</label>
                    <ToggleSwitch
                      checked={crosshairConfig.showOutline}
                      onClick={() => updateConfig('showOutline', !crosshairConfig.showOutline)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Opacidade de contorno</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        value={crosshairConfig.outlineOpacity}
                        onChange={(e) => updateConfig('outlineOpacity', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outlineOpacity}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Espessura de contorno</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={crosshairConfig.outlineThickness}
                        onChange={(e) => updateConfig('outlineThickness', parseInt(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outlineThickness}</span>
                    </div>
                  </ConfigRow>

                  <ConfigRow>
                    <label>Ponto central</label>
                    <ToggleSwitch
                      checked={crosshairConfig.centerDot}
                      onClick={() => updateConfig('centerDot', !crosshairConfig.centerDot)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Opacidade do ponto central</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        value={crosshairConfig.centerDotOpacity}
                        onChange={(e) => updateConfig('centerDotOpacity', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.centerDotOpacity}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Espessura do ponto central</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="1"
                        max="6"
                        step="1"
                        value={crosshairConfig.centerDotSize}
                        onChange={(e) => updateConfig('centerDotSize', parseInt(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.centerDotSize}</span>
                    </div>
                  </ConfigRow>

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

                {/* SEÇÃO 2: LINHAS INTERNAS */}
                <ConfigSection>
                  <h3 style={{ color: 'var(--primary-red)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    LINHAS INTERNAS
                  </h3>
                  
                  <ConfigRow>
                    <label>Exibir linhas internas</label>
                    <ToggleSwitch
                      checked={crosshairConfig.innerLines.show}
                      onClick={() => updateConfig('innerLines.show', !crosshairConfig.innerLines.show)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Opacidade da linha interna</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        value={crosshairConfig.innerLines.opacity}
                        onChange={(e) => updateConfig('innerLines.opacity', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.innerLines.opacity}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Comprimento da linha interna</label>
                    <LengthControlsContainer>
                      <div className="length-row">
                        <div className="slider-container">
                          <Slider
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={crosshairConfig.innerLines.length}
                            onChange={(e) => handleInnerLengthChange('length', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.length}</span>
                        </div>
                      </div>
                      <div className="link-container">
                        <LinkButton linked={innerLinesLinked} onClick={toggleInnerLinesLink}>
                          {innerLinesLinked ? <Link /> : <Unlink />}
                        </LinkButton>
                      </div>
                      <div className="length-row">
                        <div className="slider-container">
                          <Slider
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={crosshairConfig.innerLines.lengthVertical}
                            onChange={(e) => handleInnerLengthChange('lengthVertical', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.innerLines.lengthVertical}</span>
                        </div>
                      </div>
                    </LengthControlsContainer>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Espessura da linha interna</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={crosshairConfig.innerLines.thickness}
                        onChange={(e) => updateConfig('innerLines.thickness', parseInt(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.innerLines.thickness}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Deslocamento da linha interna</label>
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
                    <label>Erro de movimento</label>
                    <ToggleSwitch
                      checked={crosshairConfig.innerLines.showMovementError}
                      onClick={() => updateConfig('innerLines.showMovementError', !crosshairConfig.innerLines.showMovementError)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Multiplicador de erro de movimento</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="3"
                        step="0.001"
                        value={crosshairConfig.innerLines.movementErrorScale}
                        onChange={(e) => updateConfig('innerLines.movementErrorScale', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.innerLines.movementErrorScale}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Erro de disparo</label>
                    <ToggleSwitch
                      checked={crosshairConfig.innerLines.showShootingError}
                      onClick={() => updateConfig('innerLines.showShootingError', !crosshairConfig.innerLines.showShootingError)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Multiplicador de erro de disparo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="3"
                        step="0.001"
                        value={crosshairConfig.innerLines.firingErrorScale}
                        onChange={(e) => updateConfig('innerLines.firingErrorScale', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.innerLines.firingErrorScale}</span>
                    </div>
                  </ConfigRow>
                </ConfigSection>

                {/* SEÇÃO 3: LINHAS EXTERNAS */}
                <ConfigSection>
                  <h3 style={{ color: 'var(--primary-red)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    LINHAS EXTERNAS
                  </h3>
                  
                  <ConfigRow>
                    <label>Exibir linhas externas</label>
                    <ToggleSwitch
                      checked={crosshairConfig.outerLines.show}
                      onClick={() => updateConfig('outerLines.show', !crosshairConfig.outerLines.show)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Opacidade da linha externa</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        value={crosshairConfig.outerLines.opacity}
                        onChange={(e) => updateConfig('outerLines.opacity', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outerLines.opacity}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Comprimento da linha externa</label>
                    <LengthControlsContainer>
                      <div className="length-row">
                        <div className="slider-container">
                          <Slider
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={crosshairConfig.outerLines.length}
                            onChange={(e) => handleOuterLengthChange('length', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.length}</span>
                        </div>
                      </div>
                      <div className="link-container">
                        <LinkButton linked={outerLinesLinked} onClick={toggleOuterLinesLink}>
                          {outerLinesLinked ? <Link /> : <Unlink />}
                        </LinkButton>
                      </div>
                      <div className="length-row">
                        <div className="slider-container">
                          <Slider
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={crosshairConfig.outerLines.lengthVertical}
                            onChange={(e) => handleOuterLengthChange('lengthVertical', parseInt(e.target.value))}
                          />
                          <span className="value-display">{crosshairConfig.outerLines.lengthVertical}</span>
                        </div>
                      </div>
                    </LengthControlsContainer>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Espessura da linha externa</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={crosshairConfig.outerLines.thickness}
                        onChange={(e) => updateConfig('outerLines.thickness', parseInt(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outerLines.thickness}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Deslocamento da linha externa</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={crosshairConfig.outerLines.offset}
                        onChange={(e) => updateConfig('outerLines.offset', parseInt(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outerLines.offset}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Erro de movimento</label>
                    <ToggleSwitch
                      checked={crosshairConfig.outerLines.showMovementError}
                      onClick={() => updateConfig('outerLines.showMovementError', !crosshairConfig.outerLines.showMovementError)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Multiplicador de erro de movimento</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="3"
                        step="0.001"
                        value={crosshairConfig.outerLines.movementErrorScale}
                        onChange={(e) => updateConfig('outerLines.movementErrorScale', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outerLines.movementErrorScale}</span>
                    </div>
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Erro de disparo</label>
                    <ToggleSwitch
                      checked={crosshairConfig.outerLines.showShootingError}
                      onClick={() => updateConfig('outerLines.showShootingError', !crosshairConfig.outerLines.showShootingError)}
                    />
                  </ConfigRow>
                  
                  <ConfigRow>
                    <label>Multiplicador de erro de disparo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Slider
                        type="range"
                        min="0"
                        max="3"
                        step="0.001"
                        value={crosshairConfig.outerLines.firingErrorScale}
                        onChange={(e) => updateConfig('outerLines.firingErrorScale', parseFloat(e.target.value))}
                      />
                      <span className="value-display">{crosshairConfig.outerLines.firingErrorScale}</span>
                    </div>
                  </ConfigRow>
                </ConfigSection>

                <ConfigSection>
                  <h4>Importar Código de Mira</h4>
                  <div className="section-description">
                    Cole o código da mira do Valorant para importar as configurações
                  </div>
                  <ConfigRow>
                    <textarea
                      className="import-input"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Cole o código da mira aqui (ex: 0;s;1;P;u;000000FF;h;0;f;0;0l;3;0o;0;0a;1;0f;0;1b;0)"
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 70, 85, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </ConfigRow>
                  <ActionButtons>
                    <ActionButton onClick={importFromCode} className="primary">
                      <Import />
                      Importar
                    </ActionButton>
                    <ActionButton onClick={resetConfig}>
                      <RotateCcw />
                      Resetar
                    </ActionButton>
                  </ActionButtons>
                </ConfigSection>
              </div>
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