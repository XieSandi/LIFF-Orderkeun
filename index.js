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

app.get('/callback', (req, res) => res.end(`I'm listening. Please access with POST.`));

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });
  
client.getProfile('<userId>')
  .then((profile) => {
    console.log(profile.displayName);
    console.log(profile.userId);
    console.log(profile.pictureUrl);
    console.log(profile.statusMessage);
  })
  .catch((err) => {
    // error handling
  })

  // event handler
  function handleEvent(event) {

    if (event.type == 'message' && event.message.type == 'text') {
        var messageKey = event.message.text.toLowerCase();
        
        // show flex that can redirect into LIFF app from chat
        if(messageKey == 'pesan'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "flex",
                        "altText": "Ini menu flex untuk pesan",
                        "contents": {
                            "type": "bubble",
                            
                            "header": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Laper ?"
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
                                "text": "Sini di Orderkeun !"
                                }
                            ]
                            },
                            "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                    "type": "uri",
                                    "label": "MULAI MEMESAN",
                                    "uri": "https://liff.line.me/1655380958-5NVKkZBY"
                                    },
                                }
                            ],
                            }
                        }
                    }
                );
        }

        // testing purpose
        else if(messageKey == 'coba'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "flex",
                        "altText": "Ini menu flex untuk pesan",
                        "contents": {
                            "type": "bubble",
                            
                            "header": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Laper ?"
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
                                "text": "Sini di Orderkeun !"
                                }
                            ]
                            },
                            "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                    "type": "uri",
                                    "label": "MULAI MEMESAN",
                                    "uri": "https://liff-orderkeun.herokuapp.com/"
                                    },
                                }
                            ]
                            }
                        }
                    }
                );
        }

        else if(messageKey == 'sticker'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "sticker",
                        "packageId": "11537",
                        "stickerId": "52002744"
                    },
                    {
                        "type": "text",
                        'text': "Ketik 'Pesan' untuk memulai ya"
                    }
                );
        
        } 

        else{
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
                                    'text': "Perintah tidak dapat ditemukan"
                                },
                                {
                                    "type": "text",
                                    'text': "Ketik 'Pesan' untuk memulai ya"
                                }
                            ],
                          }
                        }
                      }
                )
        }
        
    }
  }  

app.use(express.static('public'));

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

app.listen(port, () => console.log(`app listening on port ${port}!`));