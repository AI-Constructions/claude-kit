---
name: handoff
description: Use ao parar uma tarefa (fim de sessão, limite de uso do Claude, troca para Codex/Antigravity, pausa) para registrar o estado e permitir que outro agente continue sem reexplicar; e ao começar num projeto, para retomar do último handoff.
---

# Handoff entre agentes

## Ao parar
1. Crie `.handoff/AAAA-MM-DD-HHMM-<agente>.md` na raiz do repositório atual com:
   - **Objetivo** — o que o usuário pediu, nas palavras dele.
   - **Feito** — o que está pronto (commits, arquivos).
   - **Falta** — próximos passos em ordem.
   - **Arquivos-chave** — caminhos relevantes.
   - **Decisões** — escolhas feitas e por quê.
   - **Pendências de consentimento** — ações que precisam da aprovação do usuário.
   - **Como verificar** — comandos de teste/execução.
2. Garanta que `.handoff/` não seja versionado sem alterar arquivos do repositório: se não estiver em `.git/info/exclude`, acrescente a linha `.handoff/` lá.
3. Se houver ferramenta de memória (ai-memory) disponível, grave um resumo de 3–5 linhas com o projeto e o caminho do handoff.
4. Se o próximo agente for outro (Codex, Antigravity etc.), informe ao usuário o caminho do arquivo para ele passar adiante.

## Ao começar
1. Se existir `.handoff/`, leia o arquivo mais recente e confirme em uma frase com o usuário de onde está retomando.
2. Consulte a memória pelo nome do projeto.
