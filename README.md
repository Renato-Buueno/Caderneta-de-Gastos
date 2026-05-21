# 💸 Caderneta de Gastos

> Aplicativo mobile para controle simples e eficiente de gastos pessoais, desenvolvido com React Native e Expo.

---

## 📱 Sobre o Projeto

A **Caderneta de Gastos** é um app de finanças pessoais que permite ao usuário registrar, visualizar e excluir gastos do dia a dia. O foco é na simplicidade: sem banco de dados, sem cadastro, sem complicações — apenas controle direto na palma da mão.

---

## ✨ Funcionalidades

- ✅ Adicionar gastos com descrição e valor
- ✅ Visualizar todos os gastos em lista organizada
- ✅ Total acumulado atualizado automaticamente
- ✅ Excluir gastos individualmente
- ✅ Validação de campos com mensagens de erro inline
- ✅ Navegação fluida entre telas
- ✅ Interface moderna com tema escuro no cabeçalho

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.76+ | Framework mobile |
| Expo | 52+ | Plataforma de desenvolvimento |
| JavaScript (ES6+) | — | Linguagem principal |
| React Navigation | 7.x | Navegação entre telas |
| useState | Hook nativo | Gerenciamento de estado |
| FlatList | Componente nativo | Listagem de gastos |

---

## 📂 Estrutura do Projeto

```
caderneta-gastos/
├── App.js                        # Entry point — configura navegação e estado global
├── screens/
│   ├── HomeScreen.js             # Tela 1 — Lista de gastos e total
│   └── AddExpenseScreen.js       # Tela 2 — Formulário de novo gasto
├── components/                   # (reservado para futuras expansões)
├── package.json
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Expo Go](https://expo.dev/client) instalado no celular (iOS ou Android)
- npm ou yarn

### Passo a passo

**1. Crie o projeto Expo**
```bash
npx create-expo-app caderneta-gastos
cd caderneta-gastos
```

**2. Substitua os arquivos**

Copie os arquivos `App.js`, `screens/HomeScreen.js` e `screens/AddExpenseScreen.js` para dentro da pasta do projeto.

**3. Instale as dependências de navegação**
```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

**4. Inicie o servidor de desenvolvimento**
```bash
npx expo start
```

**5. Abra no celular**

Escaneie o QR Code exibido no terminal com o aplicativo **Expo Go**.

---

## 📸 Telas do Aplicativo

### Tela 1 — Lista de Gastos
```
┌─────────────────────────────┐
│  Caderneta de Gastos        │  ← Cabeçalho escuro
│  Controle seus gastos...    │
│  ┌───────────────────────┐  │
│  │  Total gasto          │  │  ← Card do total
│  │  R$ 120,50            │  │
│  │  3 registros          │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Seus Gastos                │  ← Seção clara
│  ┌───────────────────────┐  │
│  │ M  Mercado   R$ 50,00 │  │  ← Item da lista
│  │            [Excluir]  │  │
│  └───────────────────────┘  │
│  ...                        │
│  ┌───────────────────────┐  │
│  │  ＋  Novo Gasto        │  │  ← Botão FAB
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Tela 2 — Formulário de Novo Gasto
```
┌─────────────────────────────┐
│  ← Voltar                   │  ← Cabeçalho escuro
│  Novo Gasto                 │
│  Registre um novo item...   │
├─────────────────────────────┤
│  DESCRIÇÃO DO GASTO         │  ← Seção clara
│  ┌───────────────────────┐  │
│  │ Ex: Mercado, Uber...  │  │
│  └───────────────────────┘  │
│                             │
│  VALOR (R$)                 │
│  ┌───────────────────────┐  │
│  │ R$ │ 0,00             │  │
│  └───────────────────────┘  │
│                             │
│  ⚠️ Preencha todos os...   │  ← Erro (quando inválido)
│                             │
│  ┌───────────────────────┐  │
│  │  💾 Salvar Gasto      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Cancelar             │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

## ⚙️ Regras de Validação

| Campo | Regra | Mensagem |
|---|---|---|
| Descrição | Não pode estar vazia | "Preencha todos os campos corretamente." |
| Valor | Não pode estar vazio | "Preencha todos os campos corretamente." |
| Valor | Deve ser numérico | "Preencha todos os campos corretamente." |
| Valor | Deve ser maior que zero | "Preencha todos os campos corretamente." |

As mensagens de erro são exibidas **diretamente na tela**, sem uso de `Alert`.

---

## 🎨 Identidade Visual

| Elemento | Cor | Uso |
|---|---|---|
| `#1a1a2e` | Azul escuro | Background do header |
| `#e94560` | Vermelho/rosa | Destaque, total, botões |
| `#f0f0f7` | Cinza claro | Background das seções |
| `#ffffff` | Branco | Cards e inputs |

---

## 👥 Integrantes

| Nome | RA / Matrícula | Curso |
|---|---|---|
| _Seu Nome Aqui_ | _000000_ | _Curso_ |
| _Nome do Colega_ | _000001_ | _Curso_ |
| _Nome do Colega_ | _000002_ | _Curso_ |

---

## 📝 Observações

- Os dados ficam apenas em **memória RAM** (useState) — ao fechar o app, os gastos são perdidos.
- O app é compatível com **iOS e Android** via Expo Go.
- Não são utilizados TypeScript, AsyncStorage, banco de dados ou APIs externas.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
