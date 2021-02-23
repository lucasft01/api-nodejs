# api-nodejs

## Requirements:
- NodeJS >= 8.0.0 AND <=10.23.0
- NPM >= 3.0.0

  > Can get nodejs and npm in https://nodejs.org/en/
  
- Docker
  > Download in https://docs.docker.com/get-docker/
- Docker-Compose
  > Download in https://docs.docker.com/compose/install/

- .env with sensitive information
  >Send message to lucasft.pwa@gmail.com to more informations
  
## Usage inner Docker
1. Install the package 
```
npm install 
```
2. Run docker-compose
```
docker-compose up -d
```
3. Run seed
```
npm run seed 
``` 
## Usage out Docker

1. Install the package 
```
npm install 
```
2. Comment api-nodejs part in docker-compose.yaml

3. Run docker-compose
```
docker-compose up -d
```
4. Run seed
```
npm run seed 
``` 
5. Run project
```
npm run dev
```
or
```
npm run start
```