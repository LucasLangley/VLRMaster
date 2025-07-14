# 🎮 VLRMaster

**VLRMaster** é uma aplicação desktop para Valorant que oferece detecção automática do jogo, análise de performance, overlays personalizados e ferramentas avançadas para jogadores.

## ✨ Funcionalidades

- 🔍 **Detecção Automática** - Detecta quando o Valorant está rodando
- 📊 **Dashboard Interativo** - Visualize suas estatísticas em tempo real
- 🎯 **Overlay Personalizado** - Overlay transparente durante o jogo
- 🔧 **Configurações Avançadas** - Crosshairs, setups e configurações
- 📈 **Analytics** - Análise detalhada de performance
- 🎨 **Interface Moderna** - Design responsivo e intuitivo

## 🚀 Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Valorant instalado

### Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/VLRMaster.git
   cd VLRMaster
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e adicione sua chave da API da Riot Games:
   ```
   RIOT_API_KEY=sua_chave_aqui
   ```

4. **Execute a aplicação**
   ```bash
   npm run dev
   ```

## 🔑 Configuração da API

### Riot Games API

Para usar todas as funcionalidades, você precisa de uma chave da API da Riot Games:

1. Acesse [Riot Developer Portal](https://developer.riotgames.com/)
2. Faça login com sua conta da Riot
3. Crie um novo projeto
4. Copie sua chave da API
5. Adicione no arquivo `.env`

### Configurações Opcionais

```env
# Configurações de timeout e retry
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=3

# Configurações do jogo
POLL_INTERVAL=5000
MAX_CONSECUTIVE_FAILURES=10
```

## 🎯 Como Usar

### 1. Detecção Automática
- Abra o VLRMaster
- Inicie o Valorant
- A aplicação detectará automaticamente quando o jogo estiver rodando

### 2. Dashboard
- Visualize estatísticas em tempo real
- Monitore status da conexão
- Acesse ferramentas rápidas

### 3. Overlay
- Ative o overlay transparente
- Visualize informações durante o jogo
- Configure opacidade e posição

### 4. Busca de Jogadores
- Digite no formato: `NomeDoJogador#TAG`
- Visualize estatísticas detalhadas
- Analise histórico de partidas

## 🛠️ Tecnologias

- **Frontend**: React, Styled Components, Framer Motion
- **Backend**: Electron, Node.js
- **APIs**: Riot Games API, Valorant API
- **Bundler**: Webpack
- **Linguagem**: JavaScript

## 📦 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm run electron-prod

# Compilar para Electron
npm run electron-pack
```

## 🔧 Estrutura do Projeto

```
VLRMaster/
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # APIs e serviços
│   ├── config/           # Configurações
│   └── routes.jsx        # Roteamento
├── public/               # Arquivos estáticos
├── main.js              # Processo principal do Electron
└── package.json         # Dependências
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Disclaimer

Este projeto não é afiliado à Riot Games. Valorant é uma marca registrada da Riot Games, Inc.

## 🐛 Problemas Conhecidos

- A API local do Valorant pode estar desabilitada em algumas versões
- Alguns recursos requerem que o jogo esteja em execução
- Firewalls podem bloquear a detecção automática

## 📞 Suporte

Se você encontrar problemas ou tiver sugestões:

1. Verifique as [Issues](https://github.com/seu-usuario/VLRMaster/issues) existentes
2. Crie uma nova issue com detalhes do problema
3. Inclua logs e informações do sistema

## 🎉 Agradecimentos

- Riot Games pela API oficial
- Comunidade Valorant pelos feedbacks
- Contribuidores do projeto

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório! 