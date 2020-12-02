import React, { useState, useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import SinglePost from '../pages/SinglePost';
import MyPopup from '../util/MyPopup';

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, picture, likes, image, firstname, lastname } }) {
    const { user } = useContext(AuthContext);
    const [hideComments, setHideComments] = useState(true);

    return (
        <Card centered className="card">
            <Card.Content>
                <div
                    floated='left'
                    size='mini'
                    className ="circular profilePicPost"
                    src=""
                    alt=""
                    style={{backgroundImage: `url(${picture})`}}
                />
                {username === user.username ? 
                <Card.Header>You</Card.Header>
                :
                <Card.Header>{firstname} {lastname}</Card.Header>
                }
                {/* <Card.Meta as={Link} to={`/posts/${id}`} floated='right'>{moment(createdAt).fromNow(true)}</Card.Meta> */}
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description className="carddes" style={{paddingTop:"10px"}}>{body}</Card.Description>
            </Card.Content>

            <Card.Content className="cardpic" style={{backgroundImage: `url(${image})`}}></Card.Content>

            {
            hideComments ? 
                null
            :
                <Card.Content className="cardCommentsWrapper">
                    <SinglePost id={id}/>
                </Card.Content>
            }

            <Card.Content>
                <LikeButton user={user} post={{ id, likes, likeCount }}/>
                <MyPopup content="Comment on post">
                    {/* <Button labelPosition='right' as={Link} to={`/posts/${id}`} onClick={() => setHideComments(true)}> */}
                    <Button labelPosition='right' as='div' onClick={() => setHideComments(!hideComments)}>
                        <Button color='blue' className={hideComments ? 'basic' : null}><Icon name={commentCount === 0 ? 'comments outline' : 'comments'} /></Button>
                        <Label basic color='blue' pointing={hideComments ? 'left' : 'above'}>{commentCount}</Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard;