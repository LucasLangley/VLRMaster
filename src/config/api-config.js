const API_CONFIG = {
  valorantAPI: 'https://valorant-api.com/v1',
  localAPI: 'https://127.0.0.1:2999',
  
  riotAPI: {
    key: process.env.RIOT_API_KEY || 'YOUR_API_KEY_HERE',
    regions: {
      americas: 'https://americas.api.riotgames.com',
      europe: 'https://europe.api.riotgames.com',
      asia: 'https://asia.api.riotgames.com',
      brazil: 'https://br1.api.riotgames.com'
    }
  },
  
  timeout: parseInt(process.env.API_TIMEOUT) || 5000,
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS) || 3,
  
  pollInterval: parseInt(process.env.POLL_INTERVAL) || 5000,
  maxConsecutiveFailures: parseInt(process.env.MAX_CONSECUTIVE_FAILURES) || 10
};

export default API_CONFIG; 