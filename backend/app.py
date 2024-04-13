import docker
import subprocess
from flask import Flask, Response
from threading import Thread
from flask_cors import CORS

client=docker.from_env()

app=Flask(__name__)

CORS(app,origins="*")

# container=client.containers.list()


def stream_logs(containerid):
    containerlog=client.containers.get(containerid)
    for log in containerlog.logs(stream=True,follow=True):
        yield log


@app.route("/")
def container_logs():
    bash_command = "docker ps --format '{{.ID}}\t{{.Ports}}' | grep -E '(:80->|:84->)' | awk '{print $1}'"
    # Execute the Bash command and capture the output
    containerid = subprocess.check_output(bash_command, shell=True).decode('utf-8').strip()
    if not containerid:
        return "No container found"
    
    
    return Response(stream_logs(containerid),content_type='text/plain')
  

# Print the container ID (or do further processing)
# for c in container:
#     print(c.ports)
# print(f"{a.logs()}")

if __name__ == '__main__':
    app.run(debug=True)