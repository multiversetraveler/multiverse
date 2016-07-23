## Multiverse Traveler Merkz / API

Esta API gerencia todas as ações e ciclos do game Multiverse Traveler Merkz

### Docker

O ambiente é configurado usando Docker, você pode criar/baixar a imagem que vai gerar o container

**Baixar do Docker Hub**

    $ sudo docker pull ehattori/nodejs

**Gerar a partir do dockerfile do projeto**

    $ cd docker && sudo docker build -t multiverse/api .

 
 **Caracteristicas do Container**

 * Linux Ubuntu    **v14.04**
 * NodeJs          **v4.4.7**
 * Npm             **v2.15.8**
 * Mocha           **v2.5.3**
 * Pm2             **v1.1.3**
 * Istanbul        **v0.4.4**
 
**Script de Inicialização do Container**

O arquivo do container `./start.sh` é responsável por toda inicialização e configuração do contianer, o modelo encontra-s no repositório  [docker/start.sh](https://github.com/eHattori/multiverse/blob/master/docker/start.sh) onde toda a inicialização é configurada.




