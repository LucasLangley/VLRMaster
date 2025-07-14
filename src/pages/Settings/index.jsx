import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Keyboard,
  Volume2,
  Wifi,
  HardDrive,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

const SettingsContainer = styled(motion.div)`
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

const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SettingsNav = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
  height: fit-content;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.$active ? 'var(--primary-red)' : '#ccc'};
  background: ${props => props.$active ? 'rgba(255, 70, 85, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 70, 85, 0.05);
    color: var(--primary-red);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const SettingsContent = styled.div`
  background: rgba(26, 30, 35, 0.8);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 70, 85, 0.1);
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    color: var(--primary-red);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #aaa;
    font-size: 0.875rem;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: #fff;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(15, 20, 25, 0.5);
  border-radius: 8px;
  
  .setting-info {
    flex: 1;
    
    .setting-label {
      font-size: 0.875rem;
      color: #fff;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .setting-description {
      font-size: 0.75rem;
      color: #888;
      line-height: 1.4;
    }
  }
  
  .setting-control {
    margin-left: 1rem;
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

const Slider = styled.input`
  width: 120px;
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

const Select = styled.select`
  width: 150px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 6px;
  background: rgba(15, 20, 25, 0.8);
  color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-red);
  }
  
  option {
    background: rgba(15, 20, 25, 0.9);
    color: white;
  }
`;

const Input = styled.input`
  width: 150px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 6px;
  background: rgba(15, 20, 25, 0.8);
  color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-red);
  }
  
  &::placeholder {
    color: #888;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 70, 85, 0.1);
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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
  
  &.danger {
    background: rgba(255, 70, 85, 0.1);
    color: var(--danger-red);
    border-color: var(--danger-red);
    
    &:hover {
      background: rgba(255, 70, 85, 0.2);
    }
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SystemInfo = styled.div`
  background: rgba(15, 20, 25, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h4 {
    color: var(--primary-red);
    margin-bottom: 1rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    
    .info-item {
      .info-label {
        font-size: 0.75rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
      }
      
      .info-value {
        font-size: 0.875rem;
        color: #fff;
        font-weight: 500;
      }
    }
  }
`;

function Settings({ systemInfo }) {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      language: 'pt-BR',
      theme: 'dark',
      autoStart: true,
      minimizeToTray: true,
      checkUpdates: true
    },
    overlay: {
      enabled: true,
      opacity: 0.9,
      hotkey: 'F1',
      showFPS: true,
      showPing: false,
      position: 'top-right'
    },
    notifications: {
      matchStart: true,
      matchEnd: true,
      achievement: true,
      sound: true,
      desktop: true,
      volume: 0.7
    },
    performance: {
      hardwareAcceleration: true,
      lowLatency: false,
      dataCollection: true,
      cacheSize: 500,
      maxFPS: 60
    },
    privacy: {
      analytics: true,
      crashReports: true,
      shareStats: false,
      autoLogin: true
    }
  });

  const navItems = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'overlay', label: 'Overlay', icon: Monitor },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'performance', label: 'Performance', icon: HardDrive },
    { id: 'privacy', label: 'Privacidade', icon: Shield }
  ];

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings({
      general: {
        language: 'pt-BR',
        theme: 'dark',
        autoStart: true,
        minimizeToTray: true,
        checkUpdates: true
      },
      overlay: {
        enabled: true,
        opacity: 0.9,
        hotkey: 'F1',
        showFPS: true,
        showPing: false,
        position: 'top-right'
      },
      notifications: {
        matchStart: true,
        matchEnd: true,
        achievement: true,
        sound: true,
        desktop: true,
        volume: 0.7
      },
      performance: {
        hardwareAcceleration: true,
        lowLatency: false,
        dataCollection: true,
        cacheSize: 500,
        maxFPS: 60
      },
      privacy: {
        analytics: true,
        crashReports: true,
        shareStats: false,
        autoLogin: true
      }
    });
  };

  const saveSettings = () => {
    localStorage.setItem('vlrmaster_settings', JSON.stringify(settings));

  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'vlrmaster-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderSettingsSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <>
            <SectionHeader>
              <h2>Configurações Gerais</h2>
              <p>Configurações básicas do aplicativo</p>
            </SectionHeader>
            
            <SettingsSection>
              <h3>Aplicativo</h3>
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Idioma</div>
                  <div className="setting-description">Idioma da interface</div>
                </div>
                <div className="setting-control">
                  <Select
                    value={settings.general.language}
                    onChange={(e) => updateSetting('general', 'language', e.target.value)}
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </Select>
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Tema</div>
                  <div className="setting-description">Aparência do aplicativo</div>
                </div>
                <div className="setting-control">
                  <Select
                    value={settings.general.theme}
                    onChange={(e) => updateSetting('general', 'theme', e.target.value)}
                  >
                    <option value="dark">Escuro</option>
                    <option value="light">Claro</option>
                    <option value="auto">Automático</option>
                  </Select>
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Iniciar com o Windows</div>
                  <div className="setting-description">Iniciar aplicativo automaticamente</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.general.autoStart}
                    onClick={() => updateSetting('general', 'autoStart', !settings.general.autoStart)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Minimizar para bandeja</div>
                  <div className="setting-description">Manter aplicativo em segundo plano</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.general.minimizeToTray}
                    onClick={() => updateSetting('general', 'minimizeToTray', !settings.general.minimizeToTray)}
                  />
                </div>
              </SettingItem>
            </SettingsSection>
          </>
        );
        
      case 'overlay':
        return (
          <>
            <SectionHeader>
              <h2>Configurações de Overlay</h2>
              <p>Configurações para overlay in-game</p>
            </SectionHeader>
            
            <SettingsSection>
              <h3>Overlay</h3>
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Habilitar Overlay</div>
                  <div className="setting-description">Mostrar overlay durante o jogo</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.overlay.enabled}
                    onClick={() => updateSetting('overlay', 'enabled', !settings.overlay.enabled)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Opacidade</div>
                  <div className="setting-description">Transparência do overlay</div>
                </div>
                <div className="setting-control">
                  <Slider
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.overlay.opacity}
                    onChange={(e) => updateSetting('overlay', 'opacity', parseFloat(e.target.value))}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Tecla de Atalho</div>
                  <div className="setting-description">Tecla para mostrar/ocultar overlay</div>
                </div>
                <div className="setting-control">
                  <Input
                    type="text"
                    value={settings.overlay.hotkey}
                    onChange={(e) => updateSetting('overlay', 'hotkey', e.target.value)}
                    placeholder="F1"
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Mostrar FPS</div>
                  <div className="setting-description">Exibir contador de FPS</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.overlay.showFPS}
                    onClick={() => updateSetting('overlay', 'showFPS', !settings.overlay.showFPS)}
                  />
                </div>
              </SettingItem>
            </SettingsSection>
          </>
        );
        
      case 'notifications':
        return (
          <>
            <SectionHeader>
              <h2>Notificações</h2>
              <p>Configurações de notificações e alertas</p>
            </SectionHeader>
            
            <SettingsSection>
              <h3>Notificações de Jogo</h3>
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Início de Partida</div>
                  <div className="setting-description">Notificar quando a partida iniciar</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.notifications.matchStart}
                    onClick={() => updateSetting('notifications', 'matchStart', !settings.notifications.matchStart)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Fim de Partida</div>
                  <div className="setting-description">Notificar quando a partida terminar</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.notifications.matchEnd}
                    onClick={() => updateSetting('notifications', 'matchEnd', !settings.notifications.matchEnd)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Volume de Notificações</div>
                  <div className="setting-description">Volume dos sons de notificação</div>
                </div>
                <div className="setting-control">
                  <Slider
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.notifications.volume}
                    onChange={(e) => updateSetting('notifications', 'volume', parseFloat(e.target.value))}
                  />
                </div>
              </SettingItem>
            </SettingsSection>
          </>
        );
        
      case 'performance':
        return (
          <>
            <SectionHeader>
              <h2>Performance</h2>
              <p>Configurações de performance e otimização</p>
            </SectionHeader>
            
            {systemInfo && (
              <SystemInfo>
                <h4>Informações do Sistema</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Processador</div>
                    <div className="info-value">{systemInfo.cpu || 'N/A'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Memória RAM</div>
                    <div className="info-value">{systemInfo.memory || 0} GB</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Placa de Vídeo</div>
                    <div className="info-value">{systemInfo.gpu || 'N/A'}</div>
                  </div>
                </div>
              </SystemInfo>
            )}
            
            <SettingsSection>
              <h3>Otimização</h3>
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Aceleração por Hardware</div>
                  <div className="setting-description">Usar GPU para melhor performance</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.performance.hardwareAcceleration}
                    onClick={() => updateSetting('performance', 'hardwareAcceleration', !settings.performance.hardwareAcceleration)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Modo Baixa Latência</div>
                  <div className="setting-description">Priorizar responsividade</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.performance.lowLatency}
                    onClick={() => updateSetting('performance', 'lowLatency', !settings.performance.lowLatency)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Tamanho do Cache</div>
                  <div className="setting-description">Tamanho do cache em MB</div>
                </div>
                <div className="setting-control">
                  <Slider
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={settings.performance.cacheSize}
                    onChange={(e) => updateSetting('performance', 'cacheSize', parseInt(e.target.value))}
                  />
                </div>
              </SettingItem>
            </SettingsSection>
          </>
        );
        
      case 'privacy':
        return (
          <>
            <SectionHeader>
              <h2>Privacidade</h2>
              <p>Configurações de privacidade e dados</p>
            </SectionHeader>
            
            <SettingsSection>
              <h3>Dados e Privacidade</h3>
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Análises de Uso</div>
                  <div className="setting-description">Enviar dados de uso para melhorias</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.privacy.analytics}
                    onClick={() => updateSetting('privacy', 'analytics', !settings.privacy.analytics)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Relatórios de Erro</div>
                  <div className="setting-description">Enviar relatórios de erro automaticamente</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.privacy.crashReports}
                    onClick={() => updateSetting('privacy', 'crashReports', !settings.privacy.crashReports)}
                  />
                </div>
              </SettingItem>
              
              <SettingItem>
                <div className="setting-info">
                  <div className="setting-label">Compartilhar Estatísticas</div>
                  <div className="setting-description">Permitir compartilhamento de estatísticas</div>
                </div>
                <div className="setting-control">
                  <Switch
                    checked={settings.privacy.shareStats}
                    onClick={() => updateSetting('privacy', 'shareStats', !settings.privacy.shareStats)}
                  />
                </div>
              </SettingItem>
            </SettingsSection>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <SettingsContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Configurações</h1>
        <p>Personalize o VLRMaster de acordo com suas preferências</p>
      </Header>

      <SettingsLayout>
        <SettingsNav>
          {navItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                $active={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              >
                <IconComponent />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </SettingsNav>

        <SettingsContent>
          {renderSettingsSection()}
          
          <ActionButtons>
            <ActionButton
              onClick={resetSettings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw />
              Resetar
            </ActionButton>
            <ActionButton
              onClick={exportSettings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download />
              Exportar
            </ActionButton>
            <ActionButton
              className="primary"
              onClick={saveSettings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save />
              Salvar Configurações
            </ActionButton>
          </ActionButtons>
        </SettingsContent>
      </SettingsLayout>
    </SettingsContainer>
  );
}

export default Settings; 