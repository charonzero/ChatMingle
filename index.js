'use strict';

const express = require('express');
const request = require('request');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const winston = require('winston');
const toYAML = require('winston-console-formatter');

const app = express();

// Create logger
function createLogger() {
    const logger = new winston.Logger({
        level: "debug"
    });

    logger.add(winston.transports.Console, toYAML.config());
    return logger;
}

const logger = createLogger();

const bot = new ViberBot(logger, {
    authToken: "Your account access token goes here",
    name: "Is It Up",
    avatar: "http://api.adorable.io/avatar/200/isitup"
});

function say(response, message) {
    response.send(new TextMessage(message));
}

bot.onSubscribe(response => {
    say(response, `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me if a web site is down for everyone or just you. Just send me a name of a website and I'll do the rest!`);
});

function checkUrlAvailability(botResponse, urlToCheck) {
    if (urlToCheck === '') {
        say(botResponse, 'I need a URL to check');
        return;
    }

    say(botResponse, 'One second...Let me check!');

    const url = urlToCheck.replace(/^http:\/\//, '');
    request('http://isup.me/' + url, function (error, requestResponse, body) {
        if (error || requestResponse.statusCode !== 200) {
            say(botResponse, 'Something is wrong with isup.me.');
            return;
        }

        if (body.search('is up') !== -1) {
            say(botResponse, 'Hooray! ' + urlToCheck + '. looks good to me.');
        } else if (body.search('Huh') !== -1) {
            say(botResponse, 'Hmmmmm ' + urlToCheck + '. does not look like a website to me. Typo? please follow the format `test.com`');
        } else if (body.search('down from here') !== -1) {
            say(botResponse, 'Oh no! ' + urlToCheck + '. is broken.');
        } else {
            say(botResponse, 'Snap...Something is wrong with isup.me.');
        }
    });
}

bot.onTextMessage(/./, (message, response) => {
    checkUrlAvailability(response, message.text);
});

// Middleware
app.use('/viber/webhook', bot.middleware());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
    bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL || "Your public accessible URL here").catch(error => {
        logger.error('Error setting the webhook:', error);
    });
});
