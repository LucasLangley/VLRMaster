import { ValorantAPI } from './ValorantAPI';
import API_CONFIG from '../config/api-config.js';

class GameDetectionServiceClass {
  constructor() {
    this.isDetecting = false;
    this.detectionInterval = null;
    this.callback = null;
    this.currentGameState = {
      isGameRunning: false,
      currentMatch: null,
      playerData: null,
      lastUpdate: null
    };
    this.pollInterval = API_CONFIG.pollInterval;
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = API_CONFIG.maxConsecutiveFailures;
  }

  startDetection(callback) {
    if (this.isDetecting) {
      return;
    }

    this.isDetecting = true;
    this.callback = callback;
    
    this.detectGame();
    
    this.detectionInterval = setInterval(() => {
      this.detectGame();
    }, this.pollInterval);
  }

  stopDetection() {
    if (!this.isDetecting) return;

    this.isDetecting = false;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    this.callback = null;
  }

  async detectGame() {
    try {
      const matchData = await ValorantAPI.getCurrentMatch();
      const playerData = await ValorantAPI.getPlayerData();
      
      const wasRunning = this.currentGameState.isGameRunning;
      const isRunning = !!(matchData || playerData);
      
      if (isRunning) {
        this.consecutiveFailures = 0;
      } else {
        this.consecutiveFailures++;
      }
      
      let processDetected = false;
      if (window.electron) {
        processDetected = await this.checkValorantProcess();
      }
      
      let gameDetected = isRunning || processDetected;
      
      if (this.consecutiveFailures > this.maxConsecutiveFailures) {
        gameDetected = false;
        this.consecutiveFailures = 0;
      }
      
      this.currentGameState = {
        isGameRunning: gameDetected,
        currentMatch: matchData ? this.parseMatchData(matchData) : null,
        playerData: playerData ? this.parsePlayerData(playerData) : null,
        lastUpdate: new Date(),
        processDetected: processDetected,
        apiDetected: isRunning
      };

      if (wasRunning !== gameDetected) {
        if (gameDetected) {
        } else {
          this.currentGameState.currentMatch = null;
          this.currentGameState.playerData = null;
        }
      }

      if (this.callback) {
        this.callback(this.currentGameState);
      }

    } catch (error) {
      console.error('Erro na detecção do jogo:', error);
      
      this.consecutiveFailures++;
      
      if (this.consecutiveFailures > this.maxConsecutiveFailures) {
        this.currentGameState.isGameRunning = false;
        this.currentGameState.currentMatch = null;
        this.currentGameState.playerData = null;
        this.consecutiveFailures = 0;
      }
      
      if (this.callback) {
        this.callback(this.currentGameState);
      }
    }
  }

  async checkValorantProcess() {
    try {
      if (!window.electron) {
        return false;
      }
      
      if (window.electron.invoke) {
        const processRunning = await window.electron.invoke('check-process', 'valorant');
        return processRunning;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar processo:', error);
      return false;
    }
  }

  parseMatchData(matchData) {
    if (!matchData) return null;

    try {
      return {
        map: matchData.mapName || 'Unknown',
        mode: matchData.gameMode || 'Unknown',
        phase: matchData.gamePhase || 'Unknown',
        isRanked: matchData.isRanked || false,
        round: matchData.round || 0,
        maxRounds: matchData.maxRounds || 25,
        team: matchData.team || 'Unknown',
        score: {
          ally: matchData.allyTeamScore || 0,
          enemy: matchData.enemyTeamScore || 0
        },
        players: this.parsePlayersData(matchData.allPlayers) || [],
        gameTime: matchData.gameTime || 0
      };
    } catch (error) {
      console.error('Erro ao processar dados da partida:', error);
      return null;
    }
  }

  parsePlayerData(playerData) {
    if (!playerData) return null;

    try {
      return {
        name: playerData.summonerName || 'Unknown',
        agent: playerData.characterName || 'Unknown',
        level: playerData.level || 1,
        currentHp: playerData.currentHp || 0,
        maxHp: playerData.maxHp || 100,
        armor: playerData.armor || 0,
        ultimate: {
          ready: playerData.ultimate?.ready || false,
          charges: playerData.ultimate?.charges || 0
        },
        abilities: this.parseAbilities(playerData.abilities) || [],
        weapon: playerData.weapon || null,
        money: playerData.money || 0,
        roundKills: playerData.roundKills || 0,
        roundDeaths: playerData.roundDeaths || 0
      };
    } catch (error) {
      console.error('Erro ao processar dados do jogador:', error);
      return null;
    }
  }

  parsePlayersData(allPlayers) {
    if (!allPlayers || !Array.isArray(allPlayers)) return [];

    return allPlayers.map(player => ({
      name: player.summonerName || 'Unknown',
      agent: player.characterName || 'Unknown',
      team: player.team || 'Unknown',
      level: player.level || 1,
      kills: player.kills || 0,
      deaths: player.deaths || 0,
      assists: player.assists || 0,
      score: player.score || 0,
      isAlive: player.isAlive !== false,
      kda: player.deaths > 0 ? ((player.kills + player.assists) / player.deaths).toFixed(2) : 'Perfect'
    }));
  }

  parseAbilities(abilities) {
    if (!abilities || !Array.isArray(abilities)) return [];

    return abilities.map(ability => ({
      name: ability.name || 'Unknown',
      charges: ability.charges || 0,
      maxCharges: ability.maxCharges || 0,
      cooldown: ability.cooldown || 0,
      ready: ability.charges > 0 && ability.cooldown === 0
    }));
  }

  getCurrentGameState() {
    return this.currentGameState;
  }

  isGameRunning() {
    return this.currentGameState.isGameRunning;
  }

  getGamePhaseText(phase) {
    const phases = {
      'WarmUp': 'Aquecimento',
      'BuyPhase': 'Fase de Compra',
      'Live': 'Ao Vivo',
      'GameEnded': 'Jogo Terminado',
      'PreRound': 'Pré-Round',
      'PostRound': 'Pós-Round'
    };
    
    return phases[phase] || phase;
  }

  getTeamColor(team) {
    const colors = {
      'Red': '#ff4655',
      'Blue': '#53ddf1',
      'Ally': '#00d4aa',
      'Enemy': '#ff4655'
    };
    
    return colors[team] || '#ffffff';
  }

  formatGameTime(seconds) {
    if (!seconds) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  setDetectionInterval(interval) {
    this.pollInterval = interval;
    
    if (this.isDetecting) {
      this.stopDetection();
      this.startDetection(this.callback);
    }
  }

  getDetectionInterval() {
    return this.pollInterval;
  }


}

export const GameDetectionService = new GameDetectionServiceClass(); 