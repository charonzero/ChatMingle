'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const app = express();
const port = process.env.PORT || 8080;
const authToken = '519aa0d6bde7e344-31aa29a1ff2098fe-3b24637725a8a416'; // Replace with your actual auth token
const webhookUrl = 'http://18.141.198.28:8080/viber'; // Replace with your actual webhook URL

const bot = new ViberBot({
    authToken: authToken,
    name: "EchoBot",
    avatar: "http://viber.com/avatar.jpg" // It is recommended to be 720x720, and no more than 100kb.
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Handle incoming messages from Viber
app.post('/viber', (req, res) => {
    bot.middleware()(req, res, () => {
        // Request has been handled by Viber Bot API
        res.status(200).end();
    });
});

// Set up message received event
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    // Echo the message back to the client
    response.send(message);
});

// Start the Express server and set the webhook
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    bot.setWebhook(webhookUrl).then(() => {
        console.log(`Webhook is set to ${webhookUrl}`);
    }).catch((error) => {
        console.error(`Error setting webhook: ${error}`);
    });
});
