# DLP Web Wrapper

O **DLP Web Wrapper** é uma solução robusta de *Music Information Retrieval (MIR)* e automação de workflow para processamento de áudio.

O sistema atua como um wrapper de alto nível que orquestra todo o ciclo de ingestão e consolidação de mídias de áudio, desde o download a partir de URLs válidas até a identificação precisa do conteúdo e o enriquecimento de metadados musicais.

A pipeline executa de forma assíncrona as seguintes etapas:
- Download de mídia via `yt-dlp`
- Extração de fingerprints acústicos
- Identificação automática de áudio
- Enriquecimento de metadados a partir de bases globais
- Padronização e consolidação final dos arquivos processados

## Funcionalidades

- Download automatizado de mídias via `yt-dlp`
- Orquestração e normalização de metadados
- Identificação automática de áudio por fingerprint acústico
- Extração de:
  - Artista
  - Álbum
  - Duração
  - Capa do álbum
- Pipeline assíncrona baseada em fila de arquivos


## Requisitos

- Node.js 18+
- Conta no AcoustID (API Key)
- yt-dlp instalado no sistema


## Como funciona

URL → yt-dlp → áudio → fingerprint → AcoustID → MusicBrainz → metadados finais


## Aviso de uso e responsabilidade

Este projeto tem caráter **estritamente educacional e experimental**, não possuindo qualquer finalidade comercial.

O software é fornecido "no estado em que se encontra" (*as is*), sem garantias de qualquer tipo. O uso deste projeto para fins comerciais, redistribuição de conteúdo protegido por direitos autorais ou em desacordo com legislações locais e termos de serviço de plataformas de terceiros é de inteira responsabilidade do usuário.

O autor não incentiva nem endossa práticas ilegais ou violações de direitos autorais.
