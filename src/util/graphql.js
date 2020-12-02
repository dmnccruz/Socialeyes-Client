import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
{
    getPosts {
        id body createdAt username likeCount image firstname lastname picture
        likes {
            username firstname lastname
        }
        commentCount
        comments {
            id username createdAt body
        }
    }
}
`