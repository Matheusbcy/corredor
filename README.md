# 🏃 PaceRun - Plataforma & PWA de Assessoria de Corrida

Plataforma moderna para assessorias de corrida com suporte a Progressive Web App (PWA), desenvolvida com Next.js (App Router), Tailwind CSS e TypeScript.

---

## 🚀 Como Executar

### Opção 1: Atalho Rápido
Basta dar dois cliques no arquivo **`iniciar_plataforma.bat`** dentro desta pasta. Ele abrirá o navegador automaticamente em `http://localhost:3000`.

### Opção 2: Via Terminal
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📱 Recursos do PWA (Mobile-First)

1. **Instalação Direta:** No celular ou computador, o app exibirá o banner *"Instalar PaceRun App"*, permitindo adicionar o ícone à tela de início sem passar pela loja de aplicativos.
2. **Offline-Ready:** Possui Service Worker configurado (`sw.js`) e manifesto com ícones nativos.
3. **Visão do Atleta:**
   * Calendário semanal dinâmico com navegação dia a dia.
   * Treino detalhado por blocos: **Aquecimento**, **Principal** (destacado) e **Desaquecimento**.
   * Zonas de Ritmo (Pace) personalizadas calculadas por VDOT (Z1 a Z5).
   * Formulário de execução pós-treino: distância, tempo, cálculo automático de pace, escala de esforço percebido (Borg RPE 1 a 10) e relato de dores/desconfortos.
4. **Painel do Treinador:**
   * Visão geral de alunos matriculados e estatísticas de adesão.
   * Prescritor de treinos com **Biblioteca de Modelos pré-definidos** (1 clique para carregar Intervalados, Longões, Fartleks).
   * **Calculadora de Ritmos VDOT (Jack Daniels)** embutida: calcula os ritmos de treino a partir de teste recente de 5km com ajuste manual.
   * Feed de feedbacks recebidos dos alunos em tempo real.

---

## 📁 Estrutura do Projeto

* `src/app/page.tsx` — Página principal com alternador de visão (Atleta PWA vs Treinador).
* `src/components/athlete/` — Componentes mobile-first da visão do atleta e modal de feedback.
* `src/components/coach/` — Painel do treinador, prescritor de treinos e calculadora de zonas.
* `src/lib/vdot.ts` — Lógica e fórmulas fisiológicas de cálculo de ritmos de corrida.
* `src/lib/mockData.ts` — Base de atletas, treinos da semana e modelos.
* `public/manifest.json` e `public/sw.js` — Configuração completa do PWA.
# corredor
# corredor
