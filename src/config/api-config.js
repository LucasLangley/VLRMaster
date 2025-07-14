// Helper para acessar variáveis de ambiente de forma segura
const getEnvVar = (key, defaultValue = '') => {
  // Verificar se estamos no Node.js/Electron
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // No browser, usar valores padrão ou localStorage (se necessário)
  return defaultValue;
};

const API_CONFIG = {
  valorantAPI: 'https://valorant-api.com/v1',
  localAPI: 'https://127.0.0.1:2999',
  
  riotAPI: {
    key: getEnvVar('RIOT_API_KEY', 'YOUR_API_KEY_HERE'),
    regions: {
      americas: 'https://americas.api.riotgames.com',
      europe: 'https://europe.api.riotgames.com',
      asia: 'https://asia.api.riotgames.com',
      brazil: 'https://br1.api.riotgames.com'
    }
  },
  
  timeout: parseInt(getEnvVar('API_TIMEOUT', '5000')) || 5000,
  retryAttempts: parseInt(getEnvVar('API_RETRY_ATTEMPTS', '3')) || 3,
  
  pollInterval: parseInt(getEnvVar('POLL_INTERVAL', '5000')) || 5000,
  maxConsecutiveFailures: parseInt(getEnvVar('MAX_CONSECUTIVE_FAILURES', '10')) || 10,
  
  // Detectar ambiente
  isElectron: typeof process !== 'undefined' && process.versions && process.versions.electron,
  isBrowser: typeof window !== 'undefined' && typeof process === 'undefined'
};

export default API_CONFIG; 