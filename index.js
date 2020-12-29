'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };

const client = new line.Client(config);

const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });
  
  // event handler
//   function handleEvent(event) {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//       // ignore non-text-message event
//       return Promise.resolve(null);
//     }
  
//     // create a echoing text message
//     // const echo = { type: 'text', text: event.message.text };
  
//     // use reply API
//     return client.replyMessage(event.replyToken, echo);
//   }  

  function handleText(message, replyToken, source) {
    switch (message.text) {
        case 'profile':
          if (source.userId) {
            return client.getProfile(source.userId)
              .then((profile) => replyText(
                replyToken,
                [
                  `Display name: ${profile.displayName}`,
                  `Status message: ${profile.statusMessage}`,
                ]
              ));
          } else {
            return replyText(replyToken, 'Bot can\'t use profile API without user ID');
          }
        case 'buttons':
          return client.replyMessage(
            replyToken,
            {
              type: 'template',
              altText: 'Buttons alt text',
              template: {
                type: 'buttons',
                thumbnailImageUrl: buttonsImageURL,
                title: 'My button sample',
                text: 'Hello, my button',
                actions: [
                  { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                  { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                  { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                  { label: 'Say message', type: 'message', text: 'Rice=米' },
                ],
              },
            }
          );
        }
    }

app.use(express.static('public'));

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.listen(port, () => console.log(`app listening on port ${port}!`));