const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    console.log('event_bus: ', event);

    events.push(event);

    axios.post('http://127.0.0.1:4000/events', event); //posts
    axios.post('http://127.0.0.1:4001/events', event); //comments
    axios.post('http://127.0.0.1:4002/events', event); //query
    axios.post('http://127.0.0.1:4003/events', event); //moderation


    res.send({message: "Event Received Successfully"});
});

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.info("Listening on port: 4005");
})