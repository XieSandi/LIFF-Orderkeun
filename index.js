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
                                "text": "LAPER ?",
                                "size": "xl",
                                "weight": "bold",
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "hero": {
                            "type": "image",
                            "url": "https://image.freepik.com/free-vector/cheeseboard-hand-drawn-illustration_23-2148796986.jpg",
                            "size": "300px"
                            },

                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Sini di Orderkeun !",
                                "size": "xl",
                                "weight": "bold",
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

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
                                    "style": "primary",
                                    "color": "#0000ff"
                                }
                            ]
                            }
                        }
                    }
                );
        }

        else if(messageKey == "hallo! aku pesen 'paket hemat' seharga rp 30.000"){
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
                                "text": "PESANAN DITERIMA",
                                "size": "xl",
                                "weight": "bold"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "hero": {
                            "type": "image",
                            "url": "https://github.com/XieSandi/LIFF-Orderkeun/blob/main/img/1.jpg?raw=true",
                            "size": "300px"
                            },

                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Kamu pesan 'Paket Hemat'"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "separator",
                                    "color": "#000000"
                                },
                                {
                                    "type": "text",
                                    'text': "TERIMA KASIH",
                                    // "size": "xl",
                                    "weight": "bold"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"
                            }
                        }
                    }
                );
        }

        else if(messageKey == "hallo! aku pesen 'paket kenyang' seharga rp 50.000"){
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
                                "text": "PESANAN DITERIMA",
                                "size": "xl",
                                "weight": "bold"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "hero": {
                            "type": "image",
                            "url": "https://github.com/XieSandi/LIFF-Orderkeun/blob/main/img/2.jpg?raw=true",
                            "size": "300px"
                            },

                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Kamu pesan 'Paket Kenyang'"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "separator",
                                    "color": "#000000"
                                },
                                {
                                    "type": "text",
                                    'text': "TERIMA KASIH",
                                    // "size": "xl",
                                    "weight": "bold"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"
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
                                "text": "Laper ?",
                                "size": "xl",
                                "weight": "bold",
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "hero": {
                            "type": "image",
                            "url": "https://image.freepik.com/free-vector/cheeseboard-hand-drawn-illustration_23-2148796986.jpg",
                            "size": "300px"
                            },

                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Sini di Orderkeun !"
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

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

        // testing purpose
        else if(messageKey == 'sticker'){
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "sticker",
                        "packageId": "11537",
                        "stickerId": "52002744"
                    },
                );
        } 
        
        // sent msg when Key doesn't match
        else{
            return client.replyMessage
                (event.replyToken,
                    {
                        "type": "flex",
                        "altText": "Unkown-Keyword",
                        "contents": {
                            "type": "bubble",
                            
                            "header": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Perintah tidak dapat ditemukan",
                                // "size": "xl",
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            "hero": {
                            "type": "image",
                            "url": "https://github.com/XieSandi/LIFF-Orderkeun/blob/main/img/404.jpg?raw=true",
                            "size": "300px"
                            },

                            "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                "type": "text",
                                "text": "Ketik 'Pesan' untuk memulai",
                                // "size": "xl",
                                }
                            ],
                            "justifyContent": "space-evenly",
                            "alignItems": "center"

                            },
                            // "footer": {
                            // "type": "box",
                            // "layout": "vertical",
                            // "contents": [
                            //     {
                            //         "type": "separator",
                            //         "color": "#000000"
                            //     },
                            //     {
                            //         "type": "text",
                            //         'text': "Salam hangat dari Orderkeun",
                            //         "size": "sm",
                            //     }
                            // ],
                            // "justifyContent": "space-evenly",
                            // "alignItems": "center"
                            // }
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