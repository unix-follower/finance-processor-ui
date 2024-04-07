### Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
### Docker commands
#### Build an image
```shell
docker build -t finance-processor-ui:latest .
```
#### Start container
```shell
docker run \
  --rm \
  --name finance-processor-ui \
  --hostname finance-processor-ui \
  --network finance-predictor-net \
  --publish 80:80 \
  finance-processor-ui:latest
```
#### Connect to running container 
```shell
docker exec -it finance-processor-ui bash
```
