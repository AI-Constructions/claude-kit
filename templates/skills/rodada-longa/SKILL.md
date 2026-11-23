---
name: rodada-longa
description: Use quando o usuário pedir para deixar um agente trabalhando sozinho por horas (madrugada, "overnight", "rodada longa"); define objetivo, critério de pronto e limite de tempo, e agenda retomadas periódicas se o agente tiver um mecanismo de agendamento.
---

# Rodada longa (trabalho autônomo por horas)

## Antes de começar
1. Confirme com o usuário, em uma única mensagem: objetivo, critério de "pronto", limite de horas (padrão 10h) e o que **não** pode ser feito sozinho.
2. Escreva o plano em `.handoff/rodada-longa.md`: objetivo, critério, passos, horário de início, limite e (depois) o id do agendamento.
3. Garanta que `.handoff/` não seja versionado: se faltar, acrescente a linha `.handoff/` em `.git/info/exclude`.

## Retomada periódica (escolha o que o seu agente oferece)
Objetivo: a cada ~30 min reabrir o plano, verificar o estado e executar o próximo passo útil; se a janela de uso estiver esgotada, só registrar o horário e aguardar.

- **Claude Code:** `/loop 30m <prompt>` ou as ferramentas de agendamento (`ScheduleWakeup`, `CronCreate`), com o prompt: "Rodada longa: leia .handoff/rodada-longa.md, verifique o estado e execute o próximo passo útil. Se o critério de pronto foi atingido ou o limite de horas passou, finalize a rodada."
- **Paseo:** `paseo heartbeat create --cron "*/30 * * * *" --name rodada-longa "<mesmo prompt>"`.
- **Sem agendamento disponível:** trabalhe em sequência na própria sessão, com checkpoints no `.handoff/rodada-longa.md` a cada passo concluído, e avise o usuário de que a rodada para se a sessão for encerrada.

Anote o id/nome do agendamento em `.handoff/rodada-longa.md`.

## Regras durante a rodada
- Ações que exigem aprovação do usuário (produção, deploy, instalar software, push na branch principal, force-push, apagar dados) **não são feitas**: registre em `.handoff/pendencias.md` e siga com o resto.
- Commits frequentes em branch de trabalho; nunca na branch principal.
- Ao bater o limite de uso, **espere** a janela reabrir; não troque de agente/provedor sozinho.

## Ao finalizar
1. Cancele o agendamento (`CronDelete`, parar o `/loop`, `paseo heartbeat delete <id>`).
2. Escreva `.handoff/resumo-da-manha.md`: o que foi feito, o que falhou, pendências de aprovação, como verificar.
3. Use a skill `handoff`.
