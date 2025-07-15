#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Verificando segurança do projeto...\n');

const sensitivePatterns = [
  {
    pattern: /RGAPI-[a-zA-Z0-9-]+/g,
    description: 'Chave da API Riot Games',
    severity: 'CRÍTICO'
  },
  {
    pattern: /api_key.*=.*['"'][^'"]+['"']/gi,
    description: 'Chave de API hardcoded',
    severity: 'CRÍTICO'
  },
  {
    pattern: /password.*=.*['"'][^'"]+['"']/gi,
    description: 'Senha hardcoded',
    severity: 'CRÍTICO'
  },
  {
    pattern: /secret.*=.*['"'][^'"]+['"']/gi,
    description: 'Segredo hardcoded',
    severity: 'ALTO'
  },
  {
    pattern: /token.*=.*['"'][^'"]+['"']/gi,
    description: 'Token hardcoded',
    severity: 'ALTO'
  }
];

const prohibitedFiles = [
  '.env',
  '.env.local',
  '.env.production',
  'api-keys.json',
  'secrets.json',
  'src/config/api-keys.js',
  'src/config/secrets.js'
];
function checkProhibitedFiles() {
  console.log('Verificando arquivos proibidos...');
  let found = false;
  
  prohibitedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`ERRO: Arquivo sensível encontrado: ${file}`);
      found = true;
    }
  });
  
  if (!found) {
    console.log('Nenhum arquivo proibido encontrado');
  }
  
  return !found;
}

function checkSensitivePatterns() {
  console.log('\nVerificando padrões sensíveis no código...');
  let issuesFound = false;
  
  const filesToCheck = [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
    '*.js',
    '*.json'
  ];
  
  filesToCheck.forEach(pattern => {
    try {
      const files = execSync(`find . -name "${pattern}" -not -path "./node_modules/*" -not -path "./build/*" -not -path "./.git/*"`, { encoding: 'utf8' })
        .split('\n')
        .filter(file => file.trim());
      
      files.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          sensitivePatterns.forEach(({ pattern, description, severity }) => {
            const matches = content.match(pattern);
            if (matches) {
              console.log(`${severity}: ${description}`);
              console.log(`   Arquivo: ${file}`);
              console.log(`   Encontrado: ${matches[0]}`);
              issuesFound = true;
            }
          });
        }
      });
    } catch (error) {

    }
  });
  
  if (!issuesFound) {
    console.log('Nenhum padrão sensível encontrado');
  }
  
  return !issuesFound;
}

function checkGitignore() {
  console.log('\nVerificando .gitignore...');
  
  if (!fs.existsSync('.gitignore')) {
    console.log('ERRO: Arquivo .gitignore não encontrado');
    return false;
  }
  
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const requiredEntries = ['.env', '*.key', 'api-keys.json', 'secrets.json'];
  
  let allFound = true;
  requiredEntries.forEach(entry => {
    if (!gitignoreContent.includes(entry)) {
      console.log(`AVISO: '${entry}' não está no .gitignore`);
      allFound = false;
    }
  });
  
  if (allFound) {
    console.log('.gitignore está configurado corretamente');
  }
  
  return allFound;
}

function checkEnvExample() {
  console.log('\nVerificando arquivo env.example...');
  
  if (fs.existsSync('env.example')) {
    console.log('Arquivo env.example encontrado');
    return true;
  } else {
    console.log('AVISO: Arquivo env.example não encontrado');
    return false;
  }
}

function runSecurityCheck() {
  console.log('Iniciando verificação de segurança...\n');
  
  const checks = [
    checkProhibitedFiles(),
    checkSensitivePatterns(),
    checkGitignore(),
    checkEnvExample()
  ];
  
  const allPassed = checks.every(check => check);
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('SUCESSO: Todas as verificações de segurança passaram!');
    console.log('Seu código está seguro para commit.');
    process.exit(0);
  } else {
    console.log('FALHA: Problemas de segurança encontrados!');
    console.log('Corrija os problemas antes de fazer commit.');
    process.exit(1);
  }
}

if (require.main === module) {
  runSecurityCheck();
}

module.exports = { runSecurityCheck }; S