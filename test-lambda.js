const { handler } = require('./lambda')

    ; (async () => {
        try {
            await handler({
                requestContext: {
                    routeKey: "sendMessage",
                    connectionId: "<CONNECTION_ID>"
                }
            })
        } catch (error) {
            console.log(error)
        }
    })()
