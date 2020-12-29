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
  function handleEvent(event) {
    // if (event.type !== 'message' || event.message.type !== 'text' || event.message.text == 'Pesan') {
    //   // ignore non-text-message event
    //   return Promise.resolve(null);
    // }
  
    // create a echoing text message
    // const echo = { type: 'text', text: event.message.text };
  
    // use reply API
    if (event.type == 'message' || event.message.type == 'text' || event.message.text == 'Pesan') {
        return client.replyMessage
            (event.replyToken,
                {
                    "type": "flex",
                    "altText": "this is a flex message",
                    "contents": {
                    "type": "bubble",
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                        {
                            "type": "text",
                            "text": "hello"
                        },
                        {
                            "type": "text",
                            "text": "world"
                        }
                        ]
                    }
                    }
                }
            );
    }
  }  

app.use(express.static('public'));

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.listen(port, () => console.log(`app listening on port ${port}!`));