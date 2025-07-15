/**
 * Serviço para decodificar e gerar códigos de mira do Valorant
 * Baseado no formato real do arquivo SavedCrosshairProfileData
 * 
 * ESTRUTURA DO JSON INTERNO DO VALORANT:
 * {
 *   "currentProfile": 1,
 *   "profiles": [{
 *     "primary": {
 *       "color": {"b":255, "g":255, "r":255, "a":255},
 *       "colorCustom": {"b":0, "g":0, "r":0, "a":255},
 *       "bUseCustomColor": false,
 *       "bHasOutline": false,
 *       "centerDotSize": 1,
 *       "centerDotOpacity": 0,
 *       "bDisplayCenterDot": false,
 *       "innerLines": {
 *         "lineThickness": 2,
 *         "lineLength": 3,
 *         "lineLengthVertical": 6,
 *         "lineOffset": 0,
 *         "bShowMovementError": false,
 *         "bShowShootingError": false,
 *         "bShowMinError": true,
 *         "opacity": 1,
 *         "bShowLines": true
 *       },
 *       "outerLines": {
 *         "bShowLines": false,
 *         "opacity": 0.35
 *       }
 *     }
 *   }]
 * }
 * 
 * FORMATO DO CÓDIGO DE COMPARTILHAMENTO:
 * 0;s;1;P;u;000000FF;h;0;f;0;0l;3;0o;0;0a;1;0f;0;1b;0
 * 
 * PARÂMETROS:
 * 0 = Perfil (sempre 0 para primary)
 * s = Separador
 * 1 = Perfil ativo
 * P = Tipo Primary
 * u = Usar cor personalizada
 * 000000FF = Cor em hexadecimal RRGGBBAA
 * h = Outline (0/1)
 * f = Fade (0/1)
 * 0l = Line length (inner)
 * 0o = Offset (inner)
 * 0a = Opacity (inner)
 * 0f = Firing error (inner)
 * 1b = Show outer lines (0/1)
 */
class ValorantCrosshairCodec {
  
  // Cores padrão do Valorant (BGRA)
  static defaultColors = {
    white: { r: 255, g: 255, b: 255, a: 255 },
    green: { r: 0, g: 255, b: 0, a: 255 },
    yellow: { r: 255, g: 255, b: 0, a: 255 },
    cyan: { r: 0, g: 255, b: 255, a: 255 },
    red: { r: 255, g: 0, b: 0, a: 255 },
    pink: { r: 255, g: 105, b: 180, a: 255 },
    blue: { r: 0, g: 0, b: 255, a: 255 },
    black: { r: 0, g: 0, b: 0, a: 255 }
  };

  // Configuração padrão do Valorant
  static defaultConfig = {
    color: { r: 255, g: 255, b: 255, a: 255 },
    colorCustom: { r: 0, g: 0, b: 0, a: 255 },
    bUseCustomColor: false,
    bHasOutline: false,
    outlineThickness: 1,
    outlineColor: { r: 0, g: 0, b: 0, a: 255 },
    outlineOpacity: 1,
    centerDotSize: 1,
    centerDotOpacity: 0,
    bDisplayCenterDot: false,
    bFadeCrosshairWithFiringError: false,
    bShowSpectatedPlayerCrosshair: true,
    bHideCrosshair: false,
    bTouchCrosshairHighlightEnabled: false,
    touchCrosshairHighlightColor: { r: 255, g: 0, b: 0, a: 255 },
    bFixMinErrorAcrossWeapons: false,
    
    innerLines: {
      lineThickness: 2,
      lineLength: 3,
      lineLengthVertical: 6,
      bAllowVertScaling: false,
      lineOffset: 0,
      bShowMovementError: false,
      bShowShootingError: false,
      bShowMinError: true,
      opacity: 1,
      bShowLines: true,
      firingErrorScale: 1,
      movementErrorScale: 1
    },
    
    outerLines: {
      lineThickness: 2,
      lineLength: 2,
      lineLengthVertical: 2,
      bAllowVertScaling: false,
      lineOffset: 10,
      bShowMovementError: true,
      bShowShootingError: true,
      bShowMinError: true,
      opacity: 0.35,
      bShowLines: false,
      firingErrorScale: 1,
      movementErrorScale: 1
    }
  };

  /**
   * Converte configuração interna para formato de preview
   * @param {Object} config - Configuração interna do Valorant
   * @returns {Object} Configuração para preview
   */
  static configToPreview(config) {
    const color = config.bUseCustomColor ? config.colorCustom : config.color;
    
    return {
      color: this.bgraToHex(color),
      showOutline: config.bHasOutline,
      outlineColor: this.bgraToHex(config.outlineColor),
      outlineThickness: config.outlineThickness,
      outlineOpacity: config.outlineOpacity,
      
      centerDot: config.bDisplayCenterDot,
      centerDotSize: config.centerDotSize,
      centerDotOpacity: config.centerDotOpacity,
      
      innerLines: {
        show: config.innerLines.bShowLines,
        thickness: config.innerLines.lineThickness,
        length: config.innerLines.lineLength,
        lengthVertical: config.innerLines.lineLengthVertical,
        offset: config.innerLines.lineOffset,
        opacity: config.innerLines.opacity,
        showMovementError: config.innerLines.bShowMovementError,
        showShootingError: config.innerLines.bShowShootingError,
        showMinError: config.innerLines.bShowMinError,
        movementErrorScale: config.innerLines.movementErrorScale,
        firingErrorScale: config.innerLines.firingErrorScale
      },
      
      outerLines: {
        show: config.outerLines.bShowLines,
        thickness: config.outerLines.lineThickness,
        length: config.outerLines.lineLength,
        lengthVertical: config.outerLines.lineLengthVertical,
        offset: config.outerLines.lineOffset,
        opacity: config.outerLines.opacity,
        showMovementError: config.outerLines.bShowMovementError,
        showShootingError: config.outerLines.bShowShootingError,
        showMinError: config.outerLines.bShowMinError,
        movementErrorScale: config.outerLines.movementErrorScale,
        firingErrorScale: config.outerLines.firingErrorScale
      },
      
      fadeCrosshairWithFiringError: config.bFadeCrosshairWithFiringError,
      showSpectatedPlayerCrosshair: config.bShowSpectatedPlayerCrosshair,
      hideCrosshair: config.bHideCrosshair
    };
  }

  /**
   * Converte configuração de preview para formato interno
   * @param {Object} previewConfig - Configuração de preview
   * @returns {Object} Configuração interna do Valorant
   */
  static previewToConfig(previewConfig) {
    const color = this.hexToBgra(previewConfig.color);
    
    return {
      color: color,
      colorCustom: color,
      bUseCustomColor: !this.isDefaultColor(color),
      bHasOutline: previewConfig.showOutline || false,
      outlineThickness: previewConfig.outlineThickness || 1,
      outlineColor: this.hexToBgra(previewConfig.outlineColor || '#000000'),
      outlineOpacity: previewConfig.outlineOpacity || 1,
      
      centerDotSize: previewConfig.centerDotSize || 1,
      centerDotOpacity: previewConfig.centerDotOpacity || 0,
      bDisplayCenterDot: previewConfig.centerDot || false,
      
      bFadeCrosshairWithFiringError: previewConfig.fadeCrosshairWithFiringError || false,
      bShowSpectatedPlayerCrosshair: previewConfig.showSpectatedPlayerCrosshair !== false,
      bHideCrosshair: previewConfig.hideCrosshair || false,
      bTouchCrosshairHighlightEnabled: false,
      touchCrosshairHighlightColor: { r: 255, g: 0, b: 0, a: 255 },
      bFixMinErrorAcrossWeapons: false,
      
      innerLines: {
        lineThickness: previewConfig.innerLines?.thickness || 2,
        lineLength: previewConfig.innerLines?.length || 3,
        lineLengthVertical: previewConfig.innerLines?.lengthVertical || 6,
        bAllowVertScaling: false,
        lineOffset: previewConfig.innerLines?.offset || 0,
        bShowMovementError: previewConfig.innerLines?.showMovementError || false,
        bShowShootingError: previewConfig.innerLines?.showShootingError || false,
        bShowMinError: previewConfig.innerLines?.showMinError !== false,
        opacity: previewConfig.innerLines?.opacity || 1,
        bShowLines: previewConfig.innerLines?.show !== false,
        firingErrorScale: previewConfig.innerLines?.firingErrorScale || 1,
        movementErrorScale: previewConfig.innerLines?.movementErrorScale || 1
      },
      
      outerLines: {
        lineThickness: previewConfig.outerLines?.thickness || 2,
        lineLength: previewConfig.outerLines?.length || 2,
        lineLengthVertical: previewConfig.outerLines?.lengthVertical || 2,
        bAllowVertScaling: false,
        lineOffset: previewConfig.outerLines?.offset || 10,
        bShowMovementError: previewConfig.outerLines?.showMovementError !== false,
        bShowShootingError: previewConfig.outerLines?.showShootingError !== false,
        bShowMinError: previewConfig.outerLines?.showMinError !== false,
        opacity: previewConfig.outerLines?.opacity || 0.35,
        bShowLines: previewConfig.outerLines?.show || false,
        firingErrorScale: previewConfig.outerLines?.firingErrorScale || 1,
        movementErrorScale: previewConfig.outerLines?.movementErrorScale || 1
      }
    };
  }

  /**
   * Decodifica código de mira do Valorant
   * @param {string} code - Código de mira
   * @returns {Object} Configuração de preview
   */
  static decodeCrosshair(code) {
    if (!code || typeof code !== 'string') {
      return this.configToPreview(this.defaultConfig);
    }

    console.log('🎯 Decodificando código:', code);
    
    const params = code.split(';');
    const config = { ...this.defaultConfig };
    
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const value = params[i + 1];
      
      switch (param) {
        case 'u': // Cor personalizada
          if (value) {
            config.colorCustom = this.parseHexColor(value);
            config.bUseCustomColor = true;
          }
          break;
          
        case 'h': // Outline
          if (value) {
            config.bHasOutline = value === '1';
          }
          break;
          
        case 'f': // Fade
          if (value) {
            config.bFadeCrosshairWithFiringError = value === '1';
          }
          break;
          
        case '0l': // Inner line length
          if (value) {
            config.innerLines.lineLength = parseInt(value);
          }
          break;
          
        case '0o': // Inner line offset
          if (value) {
            config.innerLines.lineOffset = parseInt(value);
          }
          break;
          
        case '0a': // Inner line opacity
          if (value) {
            config.innerLines.opacity = parseFloat(value);
          }
          break;
          
        case '0f': // Inner firing error
          if (value) {
            config.innerLines.bShowShootingError = value === '1';
          }
          break;
          
        case '1b': // Outer lines show
          if (value) {
            config.outerLines.bShowLines = value === '1';
          }
          break;
          
        case '1l': // Outer line length
          if (value) {
            config.outerLines.lineLength = parseInt(value);
          }
          break;
          
        case '1o': // Outer line offset
          if (value) {
            config.outerLines.lineOffset = parseInt(value);
          }
          break;
          
        case '1a': // Outer line opacity
          if (value) {
            config.outerLines.opacity = parseFloat(value);
          }
          break;
          
        case '1f': // Outer firing error
          if (value) {
            config.outerLines.bShowShootingError = value === '1';
          }
          break;
          
        case '0g': // Inner thickness
          if (value) {
            config.innerLines.lineThickness = parseInt(value);
          }
          break;
          
        case '1g': // Outer thickness
          if (value) {
            config.outerLines.lineThickness = parseInt(value);
          }
          break;
          
        case '0v': // Inner vertical length
          if (value) {
            config.innerLines.lineLengthVertical = parseInt(value);
          }
          break;
          
        case '1v': // Outer vertical length
          if (value) {
            config.outerLines.lineLengthVertical = parseInt(value);
          }
          break;
          
        case 'd': // Center dot
          if (value) {
            config.bDisplayCenterDot = value === '1';
          }
          break;
          
        case 'z': // Center dot size
          if (value) {
            config.centerDotSize = parseInt(value);
          }
          break;
          
        case 'a': // Center dot opacity
          if (value) {
            config.centerDotOpacity = parseFloat(value);
          }
          break;
      }
    }
    
    console.log('✅ Configuração decodificada:', config);
    return this.configToPreview(config);
  }

  /**
   * Gera código de mira do Valorant
   * @param {Object} previewConfig - Configuração de preview
   * @returns {string} Código de mira
   */
  static generateCrosshairCode(previewConfig) {
    const config = this.previewToConfig(previewConfig);
    let code = ['0', 's', '1', 'P'];
    
    // Cor personalizada
    if (config.bUseCustomColor) {
        code.push('u');
      code.push(this.bgraToHexCode(config.colorCustom));
    }
    
    // Outline
    if (config.bHasOutline) {
      code.push('h');
      code.push('1');
    }
    
    // Fade
    if (config.bFadeCrosshairWithFiringError) {
      code.push('f');
      code.push('1');
    }
    
    // Center dot
    if (config.bDisplayCenterDot) {
      code.push('d');
      code.push('1');
    
      if (config.centerDotSize !== 1) {
      code.push('z');
        code.push(config.centerDotSize.toString());
    }
    
    if (config.centerDotOpacity !== 1) {
      code.push('a');
      code.push(config.centerDotOpacity.toString());
    }
    }
    
    // Inner lines
    if (config.innerLines.lineLength !== 3) {
      code.push('0l');
      code.push(config.innerLines.lineLength.toString());
    }
    
    if (config.innerLines.lineOffset !== 0) {
      code.push('0o');
      code.push(config.innerLines.lineOffset.toString());
    }
    
    if (config.innerLines.opacity !== 1) {
    code.push('0a');
    code.push(config.innerLines.opacity.toString());
    }
    
    if (config.innerLines.bShowShootingError) {
    code.push('0f');
      code.push('1');
    }
    
    if (config.innerLines.lineThickness !== 2) {
      code.push('0g');
      code.push(config.innerLines.lineThickness.toString());
    }
    
    if (config.innerLines.lineLengthVertical !== 6) {
      code.push('0v');
      code.push(config.innerLines.lineLengthVertical.toString());
    }
    
    // Outer lines
    if (config.outerLines.bShowLines) {
      code.push('1b');
      code.push('1');
      
      if (config.outerLines.lineLength !== 2) {
        code.push('1l');
        code.push(config.outerLines.lineLength.toString());
      }
      
      if (config.outerLines.lineOffset !== 10) {
      code.push('1o');
        code.push(config.outerLines.lineOffset.toString());
    }
    
      if (config.outerLines.opacity !== 0.35) {
      code.push('1a');
      code.push(config.outerLines.opacity.toString());
    }
    
      if (config.outerLines.bShowShootingError) {
      code.push('1f');
      code.push('1');
    }
    
      if (config.outerLines.lineThickness !== 2) {
        code.push('1g');
        code.push(config.outerLines.lineThickness.toString());
      }
      
      if (config.outerLines.lineLengthVertical !== 2) {
        code.push('1v');
        code.push(config.outerLines.lineLengthVertical.toString());
      }
    } else {
      code.push('1b');
      code.push('0');
    }
    
    return code.join(';');
  }

  /**
   * Converte cor BGRA para hex
   * @param {Object} bgra - Cor BGRA {r, g, b, a}
   * @returns {string} Cor hex (#RRGGBB)
   */
  static bgraToHex(bgra) {
    const r = Math.round(bgra.r).toString(16).padStart(2, '0');
    const g = Math.round(bgra.g).toString(16).padStart(2, '0');
    const b = Math.round(bgra.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  /**
   * Converte cor BGRA para código hex do Valorant
   * @param {Object} bgra - Cor BGRA {r, g, b, a}
   * @returns {string} Código hex do Valorant (RRGGBBAA)
   */
  static bgraToHexCode(bgra) {
    const r = Math.round(bgra.r).toString(16).padStart(2, '0');
    const g = Math.round(bgra.g).toString(16).padStart(2, '0');
    const b = Math.round(bgra.b).toString(16).padStart(2, '0');
    const a = Math.round(bgra.a).toString(16).padStart(2, '0');
    return `${r}${g}${b}${a}`.toUpperCase();
  }

  /**
   * Converte hex para cor BGRA
   * @param {string} hex - Cor hex (#RRGGBB)
   * @returns {Object} Cor BGRA {r, g, b, a}
   */
  static hexToBgra(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b, a: 255 };
  }

  /**
   * Converte código hex do Valorant para cor BGRA
   * @param {string} hexCode - Código hex do Valorant (RRGGBBAA)
   * @returns {Object} Cor BGRA {r, g, b, a}
   */
  static parseHexColor(hexCode) {
    if (!hexCode || hexCode.length < 6) {
      return { r: 255, g: 255, b: 255, a: 255 };
    }
    
    const r = parseInt(hexCode.substring(0, 2), 16);
    const g = parseInt(hexCode.substring(2, 4), 16);
    const b = parseInt(hexCode.substring(4, 6), 16);
    const a = hexCode.length >= 8 ? parseInt(hexCode.substring(6, 8), 16) : 255;
    
    return { r, g, b, a };
  }

  /**
   * Verifica se é uma cor padrão do Valorant
   * @param {Object} color - Cor BGRA
   * @returns {boolean} True se for cor padrão
   */
  static isDefaultColor(color) {
    return Object.values(this.defaultColors).some(defaultColor => 
      defaultColor.r === color.r && 
      defaultColor.g === color.g && 
      defaultColor.b === color.b && 
      defaultColor.a === color.a
    );
  }
}

export { ValorantCrosshairCodec }; 