'use strict';

const express = require('express');
const app = express();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot = new ViberBot({
    authToken: "519aa0d6bde7e344-31aa29a1ff2098fe-3b24637725a8a416",
    name: "Noble Educare Centre",
    avatar: "https://viber.com/avatar.jpg"
});

const TextMessage = require('viber-bot').Message.Text;

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    const textMessage = new TextMessage('Thank you for your message!');
    response.send(textMessage);
});

// Capture raw request body before any other middleware processes it
app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        req.rawBody = data;
        next();
    });
});

// Log raw request body
app.use((req, res, next) => {
    console.log("Raw Request Body:", req.rawBody);
    next();
});

// Viber middleware should come next
app.use('/viber', bot.middleware());

// Then the body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;
const webhookUrl = "http://18.141.198.28:8080/viber";

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    bot.setWebhook(webhookUrl).catch(error => {
        console.error('Error setting the webhook:', JSON.stringify(error, null, 2));
    });
});
