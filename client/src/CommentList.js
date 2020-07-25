import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default ({postId, comments}) => {
    // const [comments, setComment] = useState([]);
    // const fetchData = async () => {
    //     const output = await axios.get(`http://127.0.0.1:4001/posts/${postId}/comments`);
    //     setComment(output.data);
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const redeneredComments = comments.map((element) => {
        let content;
        
        if(element.status === 'approved') {
            content = element.content;
        }

        if(element.status === 'pending') {
            content = 'This comment is awaiting moderation';
        }

        if(element.status === 'rejected') {
            content = 'This comment has been rejected';
        }

        return <li key={element.id}>{content}</li>
    });

    return <ul>
        {redeneredComments}
    </ul>
}