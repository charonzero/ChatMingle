'use strict';

const express = require('express');
const app = express();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.use('/viber', bot.middleware());

const port = process.env.PORT || 8080;
const webhookUrl = "http://18.141.198.28:8080/viber"; // Use HTTP instead of HTTPS


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);

    bot.setWebhook(webhookUrl).catch(error => {
        console.error('Error setting the webhook:', JSON.stringify(error, null, 2));
    });

});
