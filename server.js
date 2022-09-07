require('dotenv').config()
const axios = require('axios')
const express = require('express')

const port = process.env.PORT

const app = express()
app.use(express.json())

app.post('/api/did', (req, res) => {
    console.log(JSON.stringify(req.body, null, 2))
    const { webhookUrl, connectionId, replyToSend, delayInMs } = req.body
    res.json({ result: true })

    const token = '123'

    setTimeout(() => {
        console.log(`Sending reply to ${webhookUrl}`)
        axios.post(webhookUrl, { connectionId, replyToSend }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(err => console.log(`Error posting to webhook: ${err}`))
        // this should send back to API Gateway using OAuth2 with bearer token        
    }, delayInMs)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})