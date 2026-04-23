import os

# CONFIGURAÇÕES
KEYWORD = "activeCompanyId"  # Troque pela palavra que deseja buscar
TARGET_DIRECTORIES = ['app', 'src'] # Pastas raiz permitidas
EXTENSIONS = ('.ts', '.tsx')

def search_in_files():
    found_count = 0
    print(f"🔍 Buscando por: '{KEYWORD}' em arquivos {EXTENSIONS}...")
    print("-" * 60)

    # Percorre o diretório atual
    for root, dirs, files in os.walk('.'):
        
        # Filtra para ler apenas se estiver dentro de 'app' ou 'src'
        # ou subpastas destas
        path_parts = root.split(os.sep)
        if not any(target in path_parts for target in TARGET_DIRECTORIES):
            continue

        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if KEYWORD in line:
                                found_count += 1
                                # Limpa a linha para exibição amigável
                                clean_line = line.strip()
                                print(f"📍 {file_path}:{i+1}")
                                print(f"   {clean_line}\n")
                except Exception as e:
                    print(f"⚠️ Erro ao ler {file_path}: {e}")

    print("-" * 60)
    print(f"✅ Busca finalizada. Encontradas {found_count} ocorrências.")

if __name__ == "__main__":
    search_in_files()