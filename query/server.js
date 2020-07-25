const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
    if(type === 'post_created') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []}
    }

    if(type === 'comment_created') {
        const {id, content, postId, status} = data;
        const post = posts[postId];

        post.comments.push({id, content, status});
    }

    if(type === 'comment_updated') {
        const {id, postId, status, content} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvents(type, data);

    res.send({message: "Event Received"});
});

app.listen(4002, async () => {
    console.info("Listening on port: 4002");

    const eventData = await axios.get("http://localhost:4005/events");

    for(let singleEvent of eventData.data) {
        console.info("processinng event: ", singleEvent.type);
        handleEvents(singleEvent.type, singleEvent.data);
    }
})