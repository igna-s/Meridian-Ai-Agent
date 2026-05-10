#!/bin/bash
# ==============================================================================
# Meridian AMD MI300X Inference Endpoint Setup Script
# Run this script on your AMD Developer Cloud / DigitalOcean MI300X instance
# ==============================================================================

set -e

# Configuration
MODEL_ID="deepseek-ai/DeepSeek-R1-Distill-Llama-70B"
PORT=8000

echo "🚀 Iniciando despliegue de Inferencia en AMD MI300X..."
echo "📦 Modelo seleccionado: $MODEL_ID"

# 1. Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "⚙️ Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado."
else
    echo "✅ Docker ya está instalado."
fi

# 2. Descargar la imagen oficial de vLLM optimizada para AMD ROCm
echo "📥 Descargando imagen de vLLM optimizada para AMD ROCm..."
sudo docker pull vllm/vllm-openai-rocm:latest

# 3. Levantar el contenedor con acceso a las GPUs AMD
# Nota: La MI300X tiene 192GB de VRAM, suficiente para cargar un 70B en fp16/bf16
# sin necesidad de partición ni cuantización.

echo "🔥 Levantando el endpoint de inferencia..."
echo "⚠️  Nota: La primera vez va a tardar un rato en descargar el modelo de HuggingFace (~130GB)."
echo "🌐 El servidor quedará escuchando en el puerto $PORT"

sudo docker run -d --restart unless-stopped \
  --network=host \
  --device=/dev/kfd \
  --device=/dev/dri \
  --group-add=video \
  --ipc=host \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  vllm/vllm-openai-rocm:latest \
  --model $MODEL_ID \
  --gpu-memory-utilization 0.95 \
  --dtype bfloat16 \
  --port $PORT \
  --served-model-name "llama-3.3-70b-versatile" # Ocultamos el nombre real para que el Frontend no tenga que cambiar nada

# ==============================================================================
# INSTRUCCIONES PARA CONECTAR MERIDIAN
# ==============================================================================
# Una vez que la terminal diga "Uvicorn running on http://0.0.0.0:8000"
# 1. Copiá la IP pública de esta máquina
# 2. Andá a Settings -> AI & Integrations en Meridian
# 3. Pegá esto en donde pide la URL (si hiciste un input para URL) 
#    O modifícalo en `ai-engine.jsx`:
#    const AMD_ENDPOINT = "http://<IP-PUBLICA>:8000/v1/chat/completions";
