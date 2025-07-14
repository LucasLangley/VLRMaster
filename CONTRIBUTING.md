# Contribuindo para o VLRMaster

Obrigado por querer contribuir com o VLRMaster! Este documento contém as diretrizes para contribuir com o projeto.

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/VLRMaster/issues)
2. Se não encontrar, crie uma nova issue com:
   - Título descritivo
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Versão do sistema operacional
   - Logs de erro (se houver)

### Sugerindo Melhorias

1. Verifique se a sugestão já foi feita
2. Crie uma nova issue com a tag "enhancement"
3. Descreva claramente a melhoria proposta
4. Explique por que seria útil para o projeto

### Enviando Código

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Faça suas alterações
4. Commit com mensagens descritivas:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
5. Push para sua branch:
   ```bash
   git push origin feature/minha-feature
   ```
6. Abra um **Pull Request**

## 📝 Padrões de Código

### Estrutura de Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação, sem mudanças no código
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes

### Estilo de Código

- Use **JavaScript ES6+**
- Siga o padrão **React Hooks**
- Use **Styled Components** para estilização
- Mantenha funções pequenas e focadas
- Adicione comentários quando necessário

### Estrutura de Arquivos

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── services/         # APIs e serviços
├── config/           # Configurações
└── routes.jsx        # Roteamento
```

## 🔧 Configuração do Ambiente

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Git

### Instalação

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/VLRMaster.git
cd VLRMaster

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Execute em modo de desenvolvimento
npm run dev
```

## 🧪 Testes

Antes de enviar um PR, certifique-se de:

1. Testar a funcionalidade manualmente
2. Verificar se não há erros no console
3. Testar com diferentes cenários
4. Verificar se o build funciona: `npm run build`

## 📋 Checklist do PR

- [ ] Código segue os padrões do projeto
- [ ] Funcionalidade foi testada manualmente
- [ ] Não há console.log desnecessários
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commit messages seguem o padrão
- [ ] Branch está atualizada com a main

## 🛡️ Segurança

- **Nunca** faça commit de chaves de API
- **Sempre** use variáveis de ambiente para dados sensíveis
- **Verifique** se arquivos sensíveis estão no .gitignore
- **Valide** inputs do usuário

## 📞 Ajuda

Se precisar de ajuda:

1. Verifique a [documentação](README.md)
2. Procure nas [Issues](https://github.com/seu-usuario/VLRMaster/issues)
3. Crie uma nova issue com a tag "question"

## 🎯 Áreas que Precisam de Ajuda

- [ ] Melhoria na detecção automática
- [ ] Novas funcionalidades de overlay
- [ ] Otimização de performance
- [ ] Testes automatizados
- [ ] Documentação
- [ ] Traduções

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [MIT License](LICENSE).

---

Obrigado por contribuir com o VLRMaster! 🎮 