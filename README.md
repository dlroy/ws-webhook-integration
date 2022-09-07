# WebSocket Webhook Integration Example 

This repo illustrates using API Gateways with Lambda integrations for clients to connect via websockets to support bidirectional asynchronous requests and responses between clients and 3rd party backend services via webhook integration.

## Components in this repo
- Client - simple websocket client using `wscat`
- WebSocket Server - API Gateway (WS) with Lambda integration
- Backend Service - Lambda function that processes both websocket and webhook messages
- Webhook Service - API Gateway (HTTP) with Lambda integration
- 3rd Party Service - localhost service exposed publicly via `ngrok`

## How it works
One or more clients establishes a websocket connection to the WebSocket Server.

When a client sends a message over the websocket, the message is forwarded by the WebSocket Server to the Backend Service for processing.  

Based on the message, the Backend Service sends a message to the 3rd Party Service and sends a websocket response to the client with an acknowledgement of receipt of the message.

Some time later, the 3rd Party Service responds via a message to the Webhook Service via a URL provided in the Backend Service's message.  

The Webhook Service forwards the message to the Backend Service for processing.

The Backend Service responds to the websocket client via the WebSocket Server.

### Diagram
![Sequence Diagram](/assets/uml.svg "Sequence Diagram")

### How to run
- Client: `wscat -c wss://<API_GATEWAY_WS_ENDPOINT>`
- WebSocket Server: Create WebSocket API Gateway
- Backend Service: deploy `lambda.js` as lambda (the example lambda code requires no external dependencies for simplicity in leveraging the AWS lambda code editor)
- Webhook Service: Create HTTP API Gateway 
- 3rd Party Service: `npm start` to run `server.js`, then `ngrok http 8888` to host publicly over SSL

- From Client, enter `{"action":"sendMessage", "data":"hello world"}`

### Utilities
[wscat](https://www.npmjs.com/package/wscat) - websocket client CLI

[ngrok](https://ngrok.com/) - expose local services publicly over https

### Misc
[awscurl](https://formulae.brew.sh/formula/awscurl) --access_key <ACCESS_KEY> --secret_key <SECRET_KEY> --service execute-api -X POST -d <DATA> https://<API_GATEWAY_ENDPOINT>/@connections/<CONNECTION_ID>

