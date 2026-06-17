import speech_recognition as sr
import threading
import requests
import sys

# Configurações
OLLAMA_URL = "http://localhost:11434/api/generate"
MODELO_AGENTE = "llama3.1" # Cérebro para entender o que você quer
MODELO_CODIGO = "deepseek-coder:6.7b" # Especialista para código

def consultar_ollama(prompt, modelo):
    payload = {"model": modelo, "prompt": prompt, "stream": False}
    try:
        r = requests.post(OLLAMA_URL, json=payload)
        return r.json().get("response", "Erro na resposta")
    except:
        return "Erro: Ollama está rodando?"

def processar_comando(texto):
    texto = texto.lower().strip()
    if not texto: return

    print(f"\n[Processando]: {texto}")
    
    # Lógica de Orquestração: Para onde enviar?
    if any(palavra in texto for palavra in ["código", "programar", "python", "script", "refatore"]):
        print(f"-> Encaminhando para Especialista (DeepSeek)...")
        resposta = consultar_ollama(texto, MODELO_CODIGO)
    else:
        print(f"-> Processando como Agente Central (Llama)...")
        resposta = consultar_ollama(texto, MODELO_AGENTE)
    
    print(f"\n🤖 AGENTE: {resposta}\n" + "-"*30)

def escuta_voz():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    print("🎤 Ouvido ativo (pode falar a qualquer momento)...")
    
    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        while True:
            try:
                audio = recognizer.listen(source)
                comando_voz = recognizer.recognize_google(audio, language="pt-BR")
                print(f"\n(Voz captada): {comando_voz}")
                processar_comando(comando_voz)
            except:
                continue

# Inicia a escuta de voz em segundo plano
thread_voz = threading.Thread(target=escuta_voz, daemon=True)
thread_voz.start()

# Loop do Terminal
print("💻 Terminal ativo. Digite seu comando ou apenas fale:")
while True:
    comando_terminal = input("> ")
    if comando_terminal.lower() in ["sair", "exit", "quit"]:
        break
    processar_comando(comando_terminal)