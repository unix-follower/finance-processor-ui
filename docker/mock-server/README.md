### Start up container
```shell
docker-compose up -d
```
### Stop container
```shell
docker-compose stop
```
### Define variables
```shell
server_url="$(minikube ip):1080"
```
### Clean up
Clear all expectations and logs
```shell
curl -vX PUT "${server_url}/mockserver/clear?type=log"
```
#### Clean up by path
```shell
curl -vX PUT "${server_url}/mockserver/clear" -d '{
"path": "/api/v1/predictions"
}'
```
#### Get all predictions
```shell
curl -vX PUT "${server_url}/mockserver/expectation" \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "httpRequest": {
    "method": "GET",
    "path": "/api/v1/predictions"
  },
  "httpResponse": {
    "statusCode": 200,
    "headers": {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Max-Age": "3600",
      "Access-Control-Allow-Headers": "*"
    },
    "body": [
      {
        "ticker": "VOO",
        "openRangeAt": "2024-02-01T00:00:00Z",
        "closedRangeAt": "2024-02-21T00:00:00Z",
        "predictionAt": "2024-02-21T12:35:16Z",
        "pricePrediction": 458.44007248160625,
      }
    ]
  }
}'
```
#### Get all predictions with delay
```shell
curl -vX PUT "${server_url}/mockserver/expectation" -d '{
  "httpRequest": {
    "method": "GET",
    "path": "/api/v1/predictions"
  },
  "httpResponse": {
    "delay": {
        "timeUnit": "SECONDS",
        "value": 31
    },
    "statusCode": 200,
    "headers": {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Max-Age": "3600",
      "Access-Control-Allow-Headers": "*"
    },
    "body": [
      {
        "ticker": "VOO",
        "openRangeAt": "2024-02-01T00:00:00Z",
        "closedRangeAt": "2024-02-21T00:00:00Z",
        "predictionAt": "2024-02-21T12:35:16Z",
        "pricePrediction": 458.44007248160625,
      }
    ]
  }
}'
```
#### Get prediction by ticker
```shell
curl -vX PUT "${server_url}/mockserver/expectation" \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "httpRequest": {
    "method": "GET",
    "path": "/api/v1/predictions/VOO"
  },
  "httpResponse": {
    "statusCode": 200,
    "headers": {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Max-Age": "3600",
      "Access-Control-Allow-Headers": "*"
    },
    "body": [
      {
        "ticker": "VOO",
        "openRangeAt": "2024-02-01T00:00:00Z",
        "closedRangeAt": "2024-02-21T00:00:00Z",
        "predictionAt": "2024-02-21T12:35:16Z",
        "pricePrediction": 458.44007248160625,
      }
    ]
  }
}'
```
#### Get prediction by ticker with TICKER_NOT_FOUND error
```shell
curl -vX PUT "${server_url}/mockserver/expectation" \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "httpRequest": {
    "method": "GET",
    "path": "/api/v1/predictions/VOO"
  },
  "httpResponse": {
    "statusCode": 500,
    "headers": {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Max-Age": "3600",
      "Access-Control-Allow-Headers": "*"
    },
    "body": {
      "errorCode": 1
    }
  }
}'
```
