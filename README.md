# Teste Life - Sistema de Rastreamento de Veículos

Uma aplicação web para gerenciar e rastrear veículos em tempo real.

## Funcionalidades Implementadas

1. **Sistema de Autenticação**

    - Tela de login com validação de formulário
    - Autenticação baseada em token JWT
    - Rotas protegidas para usuários autenticados
    - Redirecionamento automático para página de login

2. **Dashboard**

    - Visão geral da frota
    - Total de veículos ativos
    - Quantidade de veículos online

3. **Gerenciamento de Veículos**

    - Operações completas de CRUD
    - Listagem de todos os veículos com indicadores de status
    - Adição de novos veículos
    - Edição de detalhes dos veículos
    - Exclusão de veículos com confirmação

4. **Suporte a Temas**

    - Modo claro e escuro
    - Detecção de preferência do sistema
    - Seleção de tema persistente

5. **Rastreamento de Veículos** (Apenas Interface)
    - Interface de seleção de veículos
    - Placeholder para o mapa

## Tecnologias Utilizadas

-   Next.js 14 (App Router)
-   React 18
-   TypeScript
-   Tailwind CSS
-   Componentes Shadcn UI
-   Zustand (Gerenciamento de Estado)
-   Autenticação JWT

## Problemas Identificados

1. **Bug na Edição de Veículos**

    - Ao editar um veículo, ele desaparece da listagem
    - O problema parece estar relacionado à API que não retorna o item atualizado

2. **Inconsistência no Status do Veículo**

    - Veículos mostram status "offline" mesmo sendo definidos como ativos
    - A API retorna o mesmo timestamp de "última atualização" para todos os veículos

3. **Limitações da Funcionalidade de Rastreamento**
    - O rastreamento em tempo real não pôde ser implementado porque a API não fornece coordenadas geográficas (latitude/longitude)
    - Foi adicionado um alerta informativo para explicar esta limitação aos usuários

## Como Rodar o Projeto

1. Clone o repositório:

    ```
    git clone https://github.com/seu-usuario/tracking-vehicles-test-life.git
    ```

2. Entre na pasta do projeto:

    ```
    cd tracking-vehicles-test-life
    ```

3. Instale as dependências:

    ```
    npm install
    ```

4. Inicie o servidor de desenvolvimento:

    ```
    npm run dev
    ```

5. Abra o navegador e acesse:

    ```
    http://localhost:3000
    ```

6. Faça login com as credenciais:
    - Usuário: user02
    - Senha: x20QL8M

## Estrutura do Projeto

-   `/app` - Páginas Next.js (App Router)
-   `/components` - Componentes de UI reutilizáveis
-   `/context` - Provedores de contexto React (autenticação)
-   `/lib` - Funções utilitárias e gerenciamento de estado
-   `/public` - Arquivos estáticos
