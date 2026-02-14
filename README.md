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


----


🎵 DLPV2 - Downloader & Metadata Processor
Este projeto é uma ferramenta robusta para download de áudio e vídeo utilizando yt-dlp, com um pipeline automatizado de processamento de metadados baseado em Fingerprint de áudio (AcoustID) e MusicBrainz.

🏗️ Arquitetura do Sistema
O sistema funciona como um pipeline de processamento assíncrono dividido em três camadas:

API Layer (Fastify): Recebe as requisições de download e gerencia o status em tempo real.

Download Layer (DLPService): Interface com o yt-dlp que gerencia o processo de download e extração de áudio.

Processing Layer (Watcher + Worker): Monitora arquivos finalizados, identifica a música via áudio digital e organiza a biblioteca.

🛠️ Fluxo de Trabalho (Pipeline)
1. Download (DLPService)
O download é iniciado via spawn do yt-dlp.

Formato: Prioriza áudio em alta qualidade (aac).

Metadados Iniciais: O yt-dlp injeta tags básicas e a thumbnail do vídeo diretamente no arquivo.

Status: O progresso é capturado via Regex no stdout para monitoramento em tempo real.

2. Observação (Watcher)
Utiliza a biblioteca chokidar para monitorar a pasta downloads/pending.

Estabilidade: Aguarda 3 segundos após o download (awaitWriteFinish) para garantir que o arquivo não esteja mais sendo bloqueado pelo sistema.

Fila: Os arquivos detectados são enviados para uma PQueue com concorrência limitada (concurrency: 1) para evitar banimento por excesso de requisições (Rate Limit) nas APIs de metadados.

3. Identificação (getMetaData)
O processamento segue uma estratégia de fallback:

Nível 1 (AcoustID): Gera um fingerprint do áudio e consulta o AcoustID. Se houver um match, busca informações detalhadas (Álbum, Capa, Artista) no MusicBrainz.

Nível 2 (Native Fallback): Caso o fingerprint falhe ou a música não seja identificada, o sistema utiliza a biblioteca music-metadata para ler as tags que o yt-dlp injetou na origem.

4. Organização Final
Após a identificação, o arquivo é renomeado para o padrão Artista - Título.extension, limpando caracteres especiais inválidos, e movido para a pasta downloads/processed.

📂 Estrutura de Pastas
downloads/pending: Local temporário onde os arquivos são baixados.

downloads/processed: Local final com arquivos renomeados e tagueados.

utils/: Utilitários para fingerprint, busca em APIs e duração de áudio.

server/: Rotas e lógica do servidor Fastify.

🚀 Como Executar
Requisitos
Node.js (v18+)

yt-dlp instalado no PATH.

FFmpeg (necessário para o yt-dlp e geração de fingerprints).

AtomicParsley (para embutir thumbnails em m4a).

Chromaprint no sistema

Instalação
Bash
npm install
Configuração
Certifique-se de configurar suas chaves de API para o AcoustID nos arquivos utilitários, se necessário.

Iniciar o servidor
Bash
npm start
📝 Endpoints Principais
POST /api/download: Inicia um novo download.

Body: { "url": "...", "format": "aac" }

GET /api/status/:id: Retorna a porcentagem e o status do processo.


sistema usa o Pino para gerar logs.
