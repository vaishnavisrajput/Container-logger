import docker
import subprocess
from flask import Flask, Response
from threading import Thread
from flask_cors import CORS
from flask import request

client=docker.from_env()

app=Flask(__name__)

CORS(app,origins="*")



def stream_logs(containerid):
    containerlog=client.containers.get(containerid)
    print("hr",containerid)
    for log in containerlog.logs(stream=True,follow=True):
        yield log


def getcontainerid(endpoint):
    endpoint_list={
        'appointment':"docker ps --format '{{.ID}}\t{{.Ports}}' | grep -E '(:80->|:82->)' | awk '{print $1}'",
        'elastic':"docker ps --format '{{.ID}}\t{{.Ports}}' | grep -E '(:80->|:85->)' | awk '{print $1}'",
        'master':"docker ps --format '{{.ID}}\t{{.Ports}}' | grep -E '(:80->|:84->)' | awk '{print $1}'",
        'patient':"docker ps --format '{{.ID}}\t{{.Ports}}' | grep -E '(:80->|:83->)' | awk '{print $1}'"
    }
    
    bash_command = endpoint_list.get(endpoint)
    # Execute the Bash command and capture the output

    print("hello")
    containerid = subprocess.check_output(bash_command, shell=True).decode('utf-8').strip()
    print("the container id is:",containerid)
    if not containerid:
        return None
    return containerid

    
def service_exist(servicename):
    services = ['appointment', 'elastic', 'master', 'patient']
    return servicename in services

@app.route('/api/<string:endpoint>')
def container_logs(endpoint):
    print("+++++++++++++++++++++++++++++++++++++++++++++")
    containerid=0
    if service_exist(endpoint):

        containerid=getcontainerid(endpoint)
       


    return Response(stream_logs(containerid),content_type='text/plain')
  


if __name__ == '__main__':
    app.run(debug=True)
