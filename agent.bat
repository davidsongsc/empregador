@echo off
set OLLAMA_API_BASE=http://localhost:11434

:: Usando o Qwen2.5-Coder que é otimizado para o Aider e mais rápido
:: Removi o --no-stream para você ver a geração em tempo real
:: Adicionei o --map-tokens para diminuir a carga de leitura de arquivos
aider --model ollama/deepseek-coder:6.7b --edit-format diff --map-tokens 0
pause