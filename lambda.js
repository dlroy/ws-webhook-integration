const https = require('https');
const AWS = require('aws-sdk')
const api = new AWS.ApiGatewayManagementApi({
    endpoint: '<WEBSOCKET_ENDPOINT>'
})

exports.handler = async (event) => {
    console.log(JSON.stringify(event))

    const { routeKey } = event.requestContext

    switch (routeKey) {
        case "sendMessage":
            const { connectionId } = event.requestContext
            try {
                await postAsync('<3RD_PARTY_URL>', {
                    webhookUrl: '<WEBHOOK_URL>',
                    connectionId,
                    replyToSend: "Hello from the other side",
                    delayInMs: 3000
                })

                await api.postToConnection({
                    ConnectionId: connectionId,
                    Data: Buffer.from(JSON.stringify('Successfully sent message to 3rd party'))
                }).promise()

                // Respond to API Gateway (this does not make it back to the ws client however)
                return {
                    statusCode: 200
                };
            } catch (error) {
                console.log(`Error during POST: ${error}`)
                return {
                    statusCode: 500,
                    body: 'Error sending message to 3rd party',
                };
            }
        case "POST /webhook":
            try {
                const { connectionId, replyToSend } = JSON.parse(event.body)
                console.log(`Sending to ws client: ${connectionId}, ${replyToSend}`)
                await api.postToConnection({
                    ConnectionId: connectionId,
                    Data: Buffer.from(JSON.stringify(replyToSend))
                }).promise()
                console.log(`Sent to ws client: ${connectionId}`)
            }
            catch (error) {
                console.log(`Error: ${error}`)
                return {
                    statusCode: 500,
                    body: `Error: ${error}`,
                };
            }
            break;
        default:
            break;
    }

    // Respond to API Gateway (this does not make it back to the ws client however)
    return {
        statusCode: 200
    };
};

const postAsync = (url, data) => new Promise((resolve, reject) => {
    const { protocol, host, port, pathname } = new URL(url)
    const dataAsString = JSON.stringify(data)

    const req = https.request({
        host,
        port: port || protocol === 'https:' ? 443 : 80,
        path: pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataAsString)
        }
    }, res => {
        res.setEncoding('utf8')
        res.on('data', chunk => {
            console.log(`Response: ${chunk}`)
            resolve(chunk)
        })
        res.on('error', err => {
            console.log(`Error: ${err}`)
            reject(err)
        })
    });

    req.write(dataAsString);
    req.end();
})


if (require.main === module) {
    (async () => {
        await exports.handler({
            requestContext: {
                routeKey: "sendMessage",
                connectionId: "<CONNECTION_ID>"
            }
        })
    })()
}
