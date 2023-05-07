import json
import subprocess

def ping():
    return 'pong'

def run_command(command_line: str):
    result = subprocess.run(command_line, shell=True, capture_output=True, text=True)
    return result.stdout or result.stderr

def execute_request(request):
    available_methods = {
        "ping": ping,
        "run_command": run_command
    }

    # Tentamos seguir o padrão do JSON-RPC: https://www.jsonrpc.org/specification
    request_id = request['id']
    method_name = request['method']
    method_params = request['params']

    method = available_methods[method_name]
    result = method(*method_params)

    return {
        "jsonrpc": "2.0", # crime
        "result": result,
        "id": request_id
    }

def main():
    while True:
        # Le uma request da entrada padrão, realizando o parse para JSON
        request = json.loads(input())
        # Executa a request, obtendo uma resposta
        response = execute_request(request)
        # Escreve a resposta na saida padrão, codificando em JSON
        print(json.dumps(response))

if __name__ == '__main__':
    main()