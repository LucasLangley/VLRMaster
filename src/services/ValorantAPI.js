import axios from 'axios';
import API_CONFIG from '../config/api-config.js';

class ValorantAPIService {
  constructor() {
    this.baseURL = API_CONFIG.valorantAPI;
    this.localAPI = API_CONFIG.localAPI;
    
    this.riotAPIKey = API_CONFIG.riotAPI.key;
    this.riotAPI = API_CONFIG.riotAPI.regions;
    
    this.timeout = API_CONFIG.timeout;
    this.retryAttempts = API_CONFIG.retryAttempts;
    
    this.initialized = false;
    this.gameData = {
      agents: [],
      maps: [],
      weapons: [],
      tiers: []
    };
    this.playerProfile = null;
  }

  async initialize() {
    try {
      await this.loadGameData();
      this.initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar ValorantAPI:', error);
    }
  }

  async getPlayerByName(gameName, tagLine, region = 'americas') {
    try {
      const response = await axios.get(
        `${this.riotAPI[region]}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
        {
          headers: {
            'X-Riot-Token': this.riotAPIKey
          }
        }
      );
      
      this.playerProfile = response.data;
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar jogador:', error.response?.data || error.message);
      return null;
    }
  }

  async getPlayerMatchHistory(puuid, region = 'americas', count = 20) {
    try {
      const response = await axios.get(
        `${this.riotAPI[region]}/val/match/v1/matchlists/by-puuid/${puuid}`,
        {
          headers: {
            'X-Riot-Token': this.riotAPIKey
          },
          params: { size: count }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error.response?.status, error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        return { 
          error: 'API_FORBIDDEN',
          message: 'API Key não tem permissão para acessar histórico deste jogador',
          suggestion: 'Tente com sua própria conta que está associada à API Key'
        };
      }
      
      return null;
    }
  }

  async getMatchDetails(matchId, region = 'americas') {
    try {
      const response = await axios.get(
        `${this.riotAPI[region]}/val/match/v1/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': this.riotAPIKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da partida:', error.response?.data || error.message);
      return null;
    }
  }

  async getPlayerRanking(puuid, actId, region = 'americas') {
    try {
      const response = await axios.get(
        `${this.riotAPI[region]}/val/ranked/v1/leaderboards/by-act/${actId}`,
        {
          headers: {
            'X-Riot-Token': this.riotAPIKey
          },
          params: { 
            size: 200,
            startIndex: 0
          }
        }
      );
      
      const playerRank = response.data.players.find(player => player.puuid === puuid);
      
      if (playerRank) {
        return playerRank;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error.response?.data || error.message);
      return null;
    }
  }

  async getCompletePlayerData(gameName, tagLine, region = 'americas') {
    try {
      const profile = await this.getPlayerByName(gameName, tagLine, region);
      if (!profile) return null;
      
      const matchHistory = await this.getPlayerMatchHistory(profile.puuid, region, 10);
      const stats = await this.analyzeRecentMatches(matchHistory, profile.puuid, region);
      
      return {
        profile,
        matchHistory,
        stats
      };
    } catch (error) {
      console.error('Erro ao buscar dados completos:', error);
      return null;
    }
  }

  async analyzeRecentMatches(matchHistory, puuid, region) {
    if (!matchHistory || !matchHistory.history) return null;
    
    try {
      const recentMatches = matchHistory.history.slice(0, 10);
      const matchDetails = [];
      
      for (const match of recentMatches.slice(0, 5)) {
        const details = await this.getMatchDetails(match.matchId, region);
        if (details) {
          matchDetails.push(details);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const stats = this.calculatePlayerStats(matchDetails, puuid);
      
      return stats;
    } catch (error) {
      console.error('Erro na análise:', error);
      return null;
    }
  }

  calculatePlayerStats(matches, puuid) {
    if (!matches || matches.length === 0) return null;
    
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalWins = 0;
    let totalRounds = 0;
    let totalHeadshots = 0;
    let agents = {};
    let maps = {};
    
    matches.forEach(match => {
      const playerData = match.players.find(p => p.puuid === puuid);
      if (playerData) {
        totalKills += playerData.stats.kills;
        totalDeaths += playerData.stats.deaths;
        totalAssists += playerData.stats.assists;
        totalRounds += playerData.stats.roundsPlayed;
        
        if (playerData.stats.headshots) {
          totalHeadshots += playerData.stats.headshots;
        }
        
        const playerTeam = playerData.teamId;
        const winningTeam = match.teams.find(team => team.won)?.teamId;
        if (playerTeam === winningTeam) {
          totalWins++;
        }
        
        const agentName = playerData.characterId;
        agents[agentName] = (agents[agentName] || 0) + 1;
        
        const mapName = match.matchInfo.mapId;
        maps[mapName] = (maps[mapName] || 0) + 1;
      }
    });
    
    const avgKDA = totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : 'Perfect';
    const winRate = ((totalWins / matches.length) * 100).toFixed(1);
    const headshotRate = totalKills > 0 ? ((totalHeadshots / totalKills) * 100).toFixed(1) : '0';
    
    return {
      matchesAnalyzed: matches.length,
      totalKills,
      totalDeaths,
      totalAssists,
      avgKDA,
      winRate: `${winRate}%`,
      headshotRate: `${headshotRate}%`,
      totalRounds,
      avgKillsPerRound: (totalKills / totalRounds).toFixed(1),
      favoriteAgent: Object.keys(agents)[0] || 'Unknown',
      mostPlayedMap: Object.keys(maps)[0] || 'Unknown'
    };
  }

  async testAPIConnection() {
    const results = {
      localAPI: false,
      riotAPI: false,
      details: {}
    };
    
    try {
      const response = await axios.get(`${this.localAPI}/help`, { timeout: 2000 });
      results.localAPI = true;
      results.details.localAPI = 'Conectada - Dados em tempo real disponíveis';
    } catch (error) {
      results.details.localAPI = 'Desconectada - Normal se não estiver em partida';
      
      const endpoints = ['/liveclientdata/allgamedata', '/liveclientdata/activeplayer'];
      for (const endpoint of endpoints) {
        try {
          await axios.get(`${this.localAPI}${endpoint}`, { timeout: 1000 });
          results.localAPI = true;
          results.details.localAPI = 'Conectada via endpoint específico';
          break;
        } catch (endpointError) {
        }
      }
    }
    
    try {
      const testResponse = await axios.get(
        `${this.riotAPI.americas}/val/status/v1/platform-data`,
        {
          headers: { 'X-Riot-Token': this.riotAPIKey },
          timeout: 5000
        }
      );
      results.riotAPI = true;
      results.details.riotAPI = 'Conectada - Dados históricos disponíveis';
    } catch (error) {
      results.riotAPI = false;
      results.details.riotAPI = `Erro: ${error.response?.status || error.message}`;
    }
    
    return results;
  }

    async loadGameData() {
    try {
      const [agentsRes, mapsRes, weaponsRes, tiersRes] = await Promise.all([
        axios.get(`${this.baseURL}/agents`),
        axios.get(`${this.baseURL}/maps`),
        axios.get(`${this.baseURL}/weapons`),
        axios.get(`${this.baseURL}/competitivetiers`)
      ]);

      this.gameData.agents = agentsRes.data.data;
      this.gameData.maps = mapsRes.data.data;
      this.gameData.weapons = weaponsRes.data.data;
      this.gameData.tiers = tiersRes.data.data;

    } catch (error) {
      console.error('Erro ao carregar dados do jogo:', error);
    }
  }

  getAgents() {
    return this.gameData.agents;
  }

  getAgentById(id) {
    return this.gameData.agents.find(agent => agent.uuid === id);
  }

  getAgentByName(name) {
    return this.gameData.agents.find(agent => 
      agent.displayName.toLowerCase() === name.toLowerCase()
    );
  }

  getMaps() {
    return this.gameData.maps;
  }

  getMapById(id) {
    return this.gameData.maps.find(map => map.uuid === id);
  }

  getMapByName(name) {
    return this.gameData.maps.find(map => 
      map.displayName.toLowerCase() === name.toLowerCase()
    );
  }

  getWeapons() {
    return this.gameData.weapons;
  }

  getWeaponById(id) {
    return this.gameData.weapons.find(weapon => weapon.uuid === id);
  }

  async getCurrentMatch() {
    try {
      const response = await axios.get(`${this.localAPI}/liveclientdata/allgamedata`, {
        timeout: this.timeout
      });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || 
          error.code === 'ERR_CONNECTION_REFUSED' || 
          error.message.includes('Network Error') ||
          error.message.includes('CONNECTION_REFUSED')) {
        return null;
      }
      console.error('Erro inesperado ao obter dados da partida:', error.message);
      return null;
    }
  }

  async getPlayerData() {
    try {
      const response = await axios.get(`${this.localAPI}/liveclientdata/activeplayer`, {
        timeout: this.timeout
      });
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || 
          error.code === 'ERR_CONNECTION_REFUSED' || 
          error.message.includes('Network Error') ||
          error.message.includes('CONNECTION_REFUSED')) {
        return null;
      }
      console.error('Erro inesperado ao obter dados do jogador:', error.message);
      return null;
    }
  }

  async getMatchStats() {
    try {
      const response = await axios.get(`${this.localAPI}/liveclientdata/playerscores`, {
        timeout: 3000
      });
      return response.data;
          } catch (error) {
        if (error.code === 'ECONNREFUSED' || 
            error.code === 'ERR_CONNECTION_REFUSED' || 
            error.message.includes('Network Error') ||
            error.message.includes('CONNECTION_REFUSED')) {
          return null;
        }
        return null;
      }
  }

  async getGameEvents() {
    try {
      const response = await axios.get(`${this.localAPI}/liveclientdata/eventdata`, {
        timeout: 3000
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  formatPlayerStats(stats) {
    if (!stats) return null;
    
    return {
      kills: stats.kills || 0,
      deaths: stats.deaths || 0,
      assists: stats.assists || 0,
      score: stats.score || 0,
      kda: stats.deaths > 0 ? ((stats.kills + stats.assists) / stats.deaths).toFixed(2) : 'Perfect'
    };
  }

  formatMatchInfo(matchData) {
    if (!matchData) return null;

    return {
      map: matchData.mapName || 'Unknown',
      mode: matchData.gameMode || 'Unknown',
      phase: matchData.gamePhase || 'Unknown',
      team: matchData.team || 'Unknown',
      round: matchData.round || 0,
      maxRounds: matchData.maxRounds || 25
    };
  }

  getCrosshairPresets() {
    return [
      {
        id: 'default',
        name: 'Padrão',
        settings: {
          color: '#00FF00',
          outlineThickness: 1,
          centerDot: true,
          centerDotOpacity: 0.5,
          innerLines: {
            opacity: 1,
            length: 4,
            thickness: 2,
            offset: 2
          }
        }
      },
      {
        id: 'pro',
        name: 'Pro Player',
        settings: {
          color: '#FFFFFF',
          outlineThickness: 2,
          centerDot: false,
          innerLines: {
            opacity: 0.8,
            length: 6,
            thickness: 1,
            offset: 3
          }
        }
      },
      {
        id: 'minimal',
        name: 'Minimalista',
        settings: {
          color: '#FF0040',
          outlineThickness: 0,
          centerDot: true,
          centerDotOpacity: 1,
          innerLines: {
            opacity: 0.6,
            length: 2,
            thickness: 1,
            offset: 1
          }
        }
      }
    ];
  }

  getMapSetups(mapName) {
    const setups = {
      'Bind': [
        {
          id: 'bind_smoke_hookah',
          name: 'Smoke Hookah',
          agent: 'Brimstone',
          type: 'smoke',
          position: { x: 100, y: 200 },
          description: 'Smoke para cobrir Hookah no site A'
        },
        {
          id: 'bind_flash_short',
          name: 'Flash Short',
          agent: 'Phoenix',
          type: 'flash',
          position: { x: 150, y: 180 },
          description: 'Flash para peek Short no site A'
        }
      ],
      'Ascent': [
        {
          id: 'ascent_smoke_default',
          name: 'Smoke Default A',
          agent: 'Omen',
          type: 'smoke',
          position: { x: 200, y: 150 },
          description: 'Smoke padrão para take do site A'
        }
      ],
      'Haven': [
        {
          id: 'haven_smoke_long',
          name: 'Smoke Long A',
          agent: 'Viper',
          type: 'smoke',
          position: { x: 250, y: 100 },
          description: 'Smoke para controle de Long A'
        }
      ]
    };

    return setups[mapName] || [];
  }

  async debugLocalAPI() {
    const endpoints = [
      '/help',
      '/liveclientdata/activeplayer',
      '/liveclientdata/allgamedata',
      '/liveclientdata/playerscores',
      '/liveclientdata/gamestats'
    ];
    
    const results = {
      baseURL: this.localAPI,
      timestamp: new Date().toISOString(),
      endpoints: {}
    };
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${this.localAPI}${endpoint}`, {
          timeout: this.timeout,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        results.endpoints[endpoint] = {
          status: 'success',
          statusCode: response.status,
          dataSize: JSON.stringify(response.data).length,
          hasData: !!response.data
        };
        
      } catch (error) {
        results.endpoints[endpoint] = {
          status: 'error',
          error: error.code || error.message,
          message: error.message
        };
      }
    }
    
    return results;
  }
}

export const ValorantAPI = new ValorantAPIService(); 