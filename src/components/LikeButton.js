import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Label, Button, Icon, Popup } from 'semantic-ui-react';
// import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: {id, likeCount, likes }}) {
    const [liked, setLiked] = useState(false);
    const [nameArray, setNameArray] = useState([])
    
    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        }
        else {
            setLiked(false)
        }

        let namesArray=[]

        likes.map(like => {
            if(like.username === user.username) {
                return namesArray.unshift('You')
            }
            else {
                return namesArray.push(`${like.firstname} ${like.lastname}`)
            }
        })

        // var multiLineString = namesArray.join(",\n", namesArray)
        setNameArray(namesArray)
        // console.log(multiLineString)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='red'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='red' basic>
                <Icon name='heart outline' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='red' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        // <MyPopup content={liked ? 'Unlike Post' : 'Like Post'}>
        // <MyPopup content={multiLineString === "" ? "like post" : multiLineString}>
        //     <Button as='div' labelPosition='right' onClick={likePost}>
        //         {likeButton}
        //         <Label basic color='red' pointing='left'>
        //             {likeCount}
        //         </Label>
        //     </Button>  
        // </MyPopup>

        <Popup id="likeNames" inverted trigger={
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label basic color='red' pointing='left'>
                    {likeCount}
                </Label>
            </Button>   
        }>
            {
                nameArray.map(name => {
                    return <p key={Math.random()} style={{fontSize: '15px', lineHeight: '7.5px'}}>{name}</p>
                })
            }
        </Popup>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id username firstname lastname
            }
            likeCount
        }
    }
`

export default LikeButton;

