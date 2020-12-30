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
        if(event.message.text == 'Pesan'|| event.message.text == 'pesan'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "bubble",
                        "header": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Header text"
                            }
                          ]
                        },
                        "hero": {
                          "type": "image",
                          "url": "https://example.com/flex/images/image.jpg"
                        },
                        "body": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Body text"
                            }
                          ]
                        },
                        "footer": {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Footer text"
                            }
                          ]
                        },
                        "styles": {
                          "comment": "See the example of a bubble style object"
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