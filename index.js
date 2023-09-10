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

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    response.send(message);
});

app.use('/viber', bot.middleware());

const port = process.env.PORT || 8080;
const webhookUrl = "https://18.141.198.28:8080/viber";


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);

    bot.setWebhook(webhookUrl).catch(error => {
        console.error('Error setting the webhook:', error);
    });
});
