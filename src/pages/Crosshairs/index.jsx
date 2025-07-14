import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Crosshair, 
  Palette, 
  Settings, 
  Save, 
  Download, 
  Upload,
  RotateCcw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { ValorantAPI } from '../../services/ValorantAPI';

const CrosshairsContainer = styled(motion.div)`
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

const CrosshairGrid = styled.div`
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

const PreviewCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: 
    radial-gradient(circle at center, rgba(255, 70, 85, 0.1) 0%, transparent 70%),
    linear-gradient(90deg, transparent 49.5%, rgba(255, 255, 255, 0.1) 50%, transparent 50.5%),
    linear-gradient(0deg, transparent 49.5%, rgba(255, 255, 255, 0.1) 50%, transparent 50.5%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23333" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  border-radius: 8px;
  border: 1px solid rgba(255, 70, 85, 0.2);
  overflow: hidden;
`;

const CrosshairPreview = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.size * 4}px;
  height: ${props => props.size * 4}px;
  
  .crosshair-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.centerDot ? props.dotSize : 0}px;
    height: ${props => props.centerDot ? props.dotSize : 0}px;
    background: ${props => props.color};
    border-radius: 50%;
    opacity: ${props => props.centerDotOpacity};
  }
  
  .crosshair-line {
    position: absolute;
    background: ${props => props.color};
    opacity: ${props => props.opacity};
    
    &.horizontal {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${props => props.length * 2}px;
      height: ${props => props.thickness}px;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: ${props => props.gap * 2}px;
        height: 100%;
        background: transparent;
      }
    }
    
    &.vertical {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${props => props.thickness}px;
      height: ${props => props.length * 2}px;
      
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 100%;
        height: ${props => props.gap * 2}px;
        background: transparent;
      }
    }
  }
  
  ${props => props.outline && `
    .crosshair-center,
    .crosshair-line {
      box-shadow: 0 0 0 ${props.outlineThickness}px ${props.outlineColor};
    }
  `}
`;

const ConfigPanel = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  height: fit-content;
`;

const ConfigSection = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    color: var(--primary-red);
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const ConfigRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  label {
    color: #ccc;
    font-size: 0.875rem;
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
  flex-wrap: wrap;
  
  .color-option {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid ${props => props.active ? 'var(--primary-red)' : 'transparent'};
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--primary-red);
    }
  }
`;

const Switch = styled.div`
  position: relative;
  width: 44px;
  height: 24px;
  background: ${props => props.checked ? 'var(--primary-red)' : '#333'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PresetCard = styled(motion.div)`
  background: rgba(15, 20, 25, 0.8);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid ${props => props.$active ? 'var(--primary-red)' : 'rgba(255, 70, 85, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    border-color: var(--primary-red);
  }
  
  .preset-name {
    font-size: 0.875rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }
  
  .preset-preview {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  min-width: 120px;
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

const CodeOutput = styled.div`
  background: rgba(15, 20, 25, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #ccc;
  border: 1px solid rgba(255, 70, 85, 0.1);
`;

function Crosshairs() {
  const [crosshairConfig, setCrosshairConfig] = useState({
    color: '#00ff00',
    outlineColor: '#000000',
    outlineThickness: 1,
    showOutline: true,
    centerDot: true,
    centerDotOpacity: 0.8,
    dotSize: 4,
    innerLines: {
      show: true,
      length: 6,
      thickness: 2,
      gap: 2,
      opacity: 1
    },
    outerLines: {
      show: false,
      length: 4,
      thickness: 2,
      gap: 4,
      opacity: 0.8
    }
  });

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showCode, setShowCode] = useState(false);

  const colors = [
    '#00ff00', '#ffffff', '#ff0000', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ff8000', '#8000ff', '#ff4655'
  ];

  const presets = ValorantAPI.getCrosshairPresets();

  const updateConfig = (path, value) => {
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      setCrosshairConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCrosshairConfig(prev => ({
        ...prev,
        [path]: value
      }));
    }
  };

  const applyPreset = (preset) => {
    setCrosshairConfig(prev => ({
      ...prev,
      ...preset.settings
    }));
    setSelectedPreset(preset.id);
  };

  const resetConfig = () => {
    setCrosshairConfig({
      color: '#00ff00',
      outlineColor: '#000000',
      outlineThickness: 1,
      showOutline: true,
      centerDot: true,
      centerDotOpacity: 0.8,
      dotSize: 4,
      innerLines: {
        show: true,
        length: 6,
        thickness: 2,
        gap: 2,
        opacity: 1
      },
      outerLines: {
        show: false,
        length: 4,
        thickness: 2,
        gap: 4,
        opacity: 0.8
      }
    });
    setSelectedPreset(null);
  };

  const generateCode = () => {
    const config = crosshairConfig;
    return `cl_crosshair_drawdot 1
cl_crosshair_dot_size ${config.dotSize}
cl_crosshair_dot_color ${config.color}
cl_crosshair_dot_opacity ${config.centerDotOpacity}
cl_crosshair_line_show ${config.innerLines.show ? 1 : 0}
cl_crosshair_line_length ${config.innerLines.length}
cl_crosshair_line_thickness ${config.innerLines.thickness}
cl_crosshair_line_gap ${config.innerLines.gap}
cl_crosshair_outline_show ${config.showOutline ? 1 : 0}
cl_crosshair_outline_thickness ${config.outlineThickness}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
  };

  return (
    <CrosshairsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Configuração de Mira</h1>
        <p>Personalize sua crosshair para máxima precisão</p>
      </Header>

      <CrosshairGrid>
        <PreviewArea>
          <PreviewHeader>
            <h3>Preview da Mira</h3>
            <ActionButton onClick={() => setShowCode(!showCode)}>
              {showCode ? <EyeOff /> : <Eye />}
              {showCode ? 'Ocultar' : 'Mostrar'} Código
            </ActionButton>
          </PreviewHeader>

          <PreviewCanvas>
            <CrosshairPreview
              color={crosshairConfig.color}
              size={Math.max(crosshairConfig.innerLines.length, crosshairConfig.outerLines.length)}
              centerDot={crosshairConfig.centerDot}
              centerDotOpacity={crosshairConfig.centerDotOpacity}
              dotSize={crosshairConfig.dotSize}
              length={crosshairConfig.innerLines.length}
              thickness={crosshairConfig.innerLines.thickness}
              gap={crosshairConfig.innerLines.gap}
              opacity={crosshairConfig.innerLines.opacity}
              outline={crosshairConfig.showOutline}
              outlineThickness={crosshairConfig.outlineThickness}
              outlineColor={crosshairConfig.outlineColor}
            >
              {crosshairConfig.centerDot && (
                <div className="crosshair-center" />
              )}
              
              {crosshairConfig.innerLines.show && (
                <>
                  <div className="crosshair-line horizontal" />
                  <div className="crosshair-line vertical" />
                </>
              )}
            </CrosshairPreview>
          </PreviewCanvas>

          {showCode && (
            <CodeOutput>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Código da Configuração:</span>
                <ActionButton onClick={copyToClipboard}>
                  <Copy />
                  Copiar
                </ActionButton>
              </div>
              <pre>{generateCode()}</pre>
            </CodeOutput>
          )}
        </PreviewArea>

        <ConfigPanel>
          <h3 style={{ color: 'var(--primary-red)', marginBottom: '1.5rem' }}>
            Configurações
          </h3>

          <ConfigSection>
            <h4>Presets</h4>
            <PresetGrid>
              {presets.map(preset => (
                <PresetCard
                  key={preset.id}
                  $active={selectedPreset === preset.id}
                  onClick={() => applyPreset(preset)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-preview">
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '2px',
                      backgroundColor: preset.settings.color,
                      opacity: preset.settings.innerLines?.opacity || 1
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '2px',
                      height: '20px',
                      backgroundColor: preset.settings.color,
                      opacity: preset.settings.innerLines?.opacity || 1
                    }} />
                    {preset.settings.centerDot && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: preset.settings.color,
                        borderRadius: '50%',
                        opacity: preset.settings.centerDotOpacity || 1
                      }} />
                    )}
                  </div>
                </PresetCard>
              ))}
            </PresetGrid>
          </ConfigSection>

          <ConfigSection>
            <h4>Cor</h4>
            <ColorPicker>
              {colors.map(color => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => updateConfig('color', color)}
                />
              ))}
            </ColorPicker>
          </ConfigSection>

          <ConfigSection>
            <h4>Ponto Central</h4>
            <ConfigRow>
              <label>Mostrar Ponto</label>
              <Switch
                checked={crosshairConfig.centerDot}
                onClick={() => updateConfig('centerDot', !crosshairConfig.centerDot)}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Tamanho do Ponto</label>
              <Slider
                type="range"
                min="2"
                max="8"
                value={crosshairConfig.dotSize}
                onChange={(e) => updateConfig('dotSize', parseInt(e.target.value))}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Opacidade do Ponto</label>
              <Slider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={crosshairConfig.centerDotOpacity}
                onChange={(e) => updateConfig('centerDotOpacity', parseFloat(e.target.value))}
              />
            </ConfigRow>
          </ConfigSection>

          <ConfigSection>
            <h4>Linhas</h4>
            <ConfigRow>
              <label>Mostrar Linhas</label>
              <Switch
                checked={crosshairConfig.innerLines.show}
                onClick={() => updateConfig('innerLines.show', !crosshairConfig.innerLines.show)}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Comprimento</label>
              <Slider
                type="range"
                min="2"
                max="16"
                value={crosshairConfig.innerLines.length}
                onChange={(e) => updateConfig('innerLines.length', parseInt(e.target.value))}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Espessura</label>
              <Slider
                type="range"
                min="1"
                max="6"
                value={crosshairConfig.innerLines.thickness}
                onChange={(e) => updateConfig('innerLines.thickness', parseInt(e.target.value))}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Espaçamento</label>
              <Slider
                type="range"
                min="0"
                max="8"
                value={crosshairConfig.innerLines.gap}
                onChange={(e) => updateConfig('innerLines.gap', parseInt(e.target.value))}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Opacidade</label>
              <Slider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={crosshairConfig.innerLines.opacity}
                onChange={(e) => updateConfig('innerLines.opacity', parseFloat(e.target.value))}
              />
            </ConfigRow>
          </ConfigSection>

          <ConfigSection>
            <h4>Contorno</h4>
            <ConfigRow>
              <label>Mostrar Contorno</label>
              <Switch
                checked={crosshairConfig.showOutline}
                onClick={() => updateConfig('showOutline', !crosshairConfig.showOutline)}
              />
            </ConfigRow>
            <ConfigRow>
              <label>Espessura</label>
              <Slider
                type="range"
                min="1"
                max="4"
                value={crosshairConfig.outlineThickness}
                onChange={(e) => updateConfig('outlineThickness', parseInt(e.target.value))}
              />
            </ConfigRow>
          </ConfigSection>

          <ActionButtons>
            <ActionButton onClick={resetConfig}>
              <RotateCcw />
              Reset
            </ActionButton>
            <ActionButton onClick={copyToClipboard}>
              <Copy />
              Copiar
            </ActionButton>
            <ActionButton
              className="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save />
              Salvar
            </ActionButton>
          </ActionButtons>
        </ConfigPanel>
      </CrosshairGrid>
    </CrosshairsContainer>
  );
}

export default Crosshairs; 