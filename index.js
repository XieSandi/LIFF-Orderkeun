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
    // event.type == 'message' || event.message.type == 'text' || 
    if (event.type == 'message' && event.message.type == 'text') {
        var messageKey = event.message.text.toLowerCase();
        if(messageKey == 'pesan'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "flex",
                        "altText": "Ini menu flex untuk pesan",
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
                            },
                            {
                                "type": "button",
                                "action": {
                                  "type": "uri",
                                  "label": "Tap me",
                                  "uri": "https://example.com"
                                },
                                "style": "primary",
                                "color": "#0000ff"
                              }
                            ]
                        }
                        }
                    }
                );
        }
        
    }
  }  

app.use(express.static('public'));

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.listen(port, () => console.log(`app listening on port ${port}!`));