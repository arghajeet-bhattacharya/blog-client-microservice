const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    console.log('event_bus: ', event);

    axios.post('http://127.0.0.1:4000/events', event);
    axios.post('http://127.0.0.1:4001/events', event);
    axios.post('http://127.0.0.1:4002/events', event);

    res.send({message: "Event Received Successfully"});
});

app.listen(4005, () => {
    console.info("Listening on port: 4005");
})