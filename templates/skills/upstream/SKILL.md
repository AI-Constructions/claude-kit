---
name: upstream
description: Use para verificar novidades de repositórios GitHub acompanhados pelo projeto/equipe (por padrão os de origem do kit: gstack, superpowers, claude-video) e propor o que vale trazer; roda sob demanda ou agendado.
---

# Upstream

Acompanha releases/commits de repositórios de origem e resume o que mudou. Não instala nem atualiza nada sozinho.

## Configuração
- Lista de repositórios: `.claude/upstream-repos.txt`, um `owner/repo` por linha (`#` comenta). Se não existir, use o padrão:
  - garrytan/gstack
  - obra/superpowers
  - bradautomates/claude-video
- Estado anterior: `.claude/upstream-state.json` (`{"<owner/repo>": "<tag ou sha>"}`; ausente = primeira execução). Não versione se contiver algo interno; em geral é seguro versionar.
- Requer a CLI `gh` autenticada. Se não houver, diga isso e pare.

## Passos
1. Leia a lista e o estado anterior.
2. Para cada repo: `gh api repos/<owner/repo>/releases/latest --jq .tag_name`; se não houver releases, `gh api repos/<owner/repo>/commits/HEAD --jq .sha`.
3. Para os que mudaram, leia as notas da release (ou os commits desde o anterior) e resuma no idioma do usuário: o que mudou, se afeta o projeto, recomendação (trazer / ignorar / observar).
4. Não instale nem atualize nada: atualizar é instalação e precisa da aprovação do usuário.
5. Atualize o arquivo de estado e termine com o resumo. Se nada mudou, diga só "sem novidades".
