const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const {randomBytes} = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const {title} = req.body;
    const id = randomBytes(4).toString('hex');
    posts[id] = {id, title};

    await axios.post("http://event-bus-srv:4005/events", {
        type: "post_created",
        data: {id, title}
    })

    return res.status(201).send(posts);
});

app.post('/events', (req, res) => {
    console.log("event: ", req.body.type);
    res.send({message: "Event Received"});
})

app.listen(4000, () => {
    console.log('Listening on port: 4000');
});