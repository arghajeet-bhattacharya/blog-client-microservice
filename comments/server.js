const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require("axios");
const { stat } = require('fs');

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
    
    comment.push({id: commentId, content, status: "pending"});

    commentsByPostId[id] = comment;

    await axios.post("http://event-bus-srv:4005/events", {
        type: "comment_created",
        data: {
            id: commentId, 
            content,
            postId: id,
            status: "pending"
        }
    });

    res.status(201).send(comment);
})

app.post('/events', async (req, res) => {
    console.log("event: ", req.body.type);
    const {type, data} = req.body;
    
    if(type === "comment_moderated") {
        const {postId, id, status, content} = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post("http://event-bus-srv:4005/events", {
            type: "comment_updated",
            data: {
                id,
                postId,
                status,
                content
            }
        });

    }

    res.send({message: "Event Received"});
})

app.listen(4001, () => {
    console.log('Listening on port: 4001');
});