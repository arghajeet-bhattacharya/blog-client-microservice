const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    if(type === 'comment_created') {
        const {status, id, postId, content} = data;
        const moderatedStatus = content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'comment_moderated',
            data: {
                id,
                postId,
                content,
                status: moderatedStatus
            }
        })

    }

    res.send({message: "Event Received"});
});

app.listen(4003, () => {
    console.info("Listening on port: 4003");
})