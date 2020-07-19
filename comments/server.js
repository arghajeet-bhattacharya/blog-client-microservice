const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const {id} = req.params;
    res.send(commentsByPostId[id] || [])
});

app.post('/posts/:id/comments', async (req, res) => {
    const {id} = req.params;
    const {content} = req.body;
    const commentId = randomBytes(4).toString('hex');
    const comment = commentsByPostId[id] || [];
    
    comment.push({id: commentId, content});

    commentsByPostId[id] = comment;

    await axios.post("http://127.0.0.1:4005/events", {
        type: "comment_created",
        data: {
            id: commentId, 
            content,
            postId: id
        }
    });

    res.status(201).send(comment);
})

app.post('/events', (req, res) => {
    console.log("event: ", req.body.type);
    res.send({message: "Event Received"});
})

app.listen(4001, () => {
    console.log('Listening on port: 4001');
});