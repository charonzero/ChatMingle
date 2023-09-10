const axios = require('axios');

const VIBER_TOKEN = 'YOUR_VIBER_BOT_TOKEN';

app.post('/webhook/viber', (req, res) => {
    const message = req.body.message;
    const senderId = req.body.sender.id;

    // Process the message, save it to the database, etc.

    res.status(200).send();
});

// When your server starts or in an appropriate place in your code:
axios.post('https://chatapi.viber.com/pa/set_webhook', {
    url: 'https://yourdomain.com/webhook/viber',
    event_types: ['delivered', 'seen', 'failed', 'subscribed', 'unsubscribed', 'conversation_started']
}, {
    headers: {
        'X-Viber-Auth-Token': VIBER_TOKEN
    }
});
