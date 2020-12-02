import React, {useState} from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import axios from 'axios';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
    const { values, onChange, onSubmit }  = useForm(createPostCallback, {
        body: '',
        image: ''
    });

    // const [fileInputState, setFileInputState] = useState();
    // const [selectedFile, setSelectedFile] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [hideCreatePost, setHideCreatePost] = useState(false);
    const [errors, setErrors] = useState({})

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            // data.getPosts = [result.data.createPost, ...data.getPosts]
            proxy.writeQuery({ 
                query: FETCH_POSTS_QUERY, 
                // data 
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                },
            })
            values.body = '';
            values.image = '';
            setPreviewSource('')
            setHideCreatePost(!hideCreatePost)
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(errors)
            // console.log(values)
        },
    })

    const handFileInputChange = async (e) => {
        const file = e.target.files[0];
        // setFileInputState(file)
        previewFile(file);
        // console.log(file)

        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', 'socialeyes')

        // console.log(formData)
        const response = await axios.post(
            'http://api.cloudinary.com/v1_1/dwsf70imh/image/upload', formData
        )
        // console.log(response.data.secure_url)
        values.image = response.data.secure_url
        // console.log(values)
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
        // console.log(previewSource)
    }

    function createPostCallback() {
        createPost();
    }

    return (
        <div>
            <div id="createPostHeader" className={hideCreatePost ? "createPostBorderTop" : "createPostBorderAll"} onClick={() => setHideCreatePost(!hideCreatePost)}>
                <i className='fas' style={{opacity: "0"}}>&#xf00d;</i>
                <h3>share a moment</h3>
                {
                    hideCreatePost ?
                    <i className='fas'>&#xf00d;</i>
                    :
                    <i className='fas'>&#xf068;</i>
                }
            </div>

            {
            hideCreatePost ?  
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <div onClick={() => document.getElementById('previewImageInput').click()} id="previewImage" style={{backgroundImage: `url(${previewSource})`}}>
                        {/* <div onClick={() => document.getElementById('previewImageInput').click()} id="previewImage" style={{backgroundImage: `url(${values.image})`}}> */}
                            <Form.Input
                                placeholder="upload image."
                                name="image"
                                onChange={handFileInputChange}
                                // error={errors.image ? true : false}
                                error={error ? true : false}
                                type="file"
                                id="previewImageInput"
                            />
                            <i id="previewImageCamera" className='fas'>&#xf083;</i>
                            <p>Upload a photo here.</p>
                        </div>
                        
                        <div id="bodyInputField">
                            <Form.Input
                                placeholder="write a description."
                                name="body"
                                onChange={onChange}
                                value={values.body}
                                // error={error ? true : false}
                                // error={errors.body ? true : false}
                                id="bodyInputField2"
                            />
                            <Button id="bodyInputButton" type="submit" color="teal">Submit</Button>
                        </div>
                    </Form.Field>
                </Form>
            :
            null
            }

            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
            {/* {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!, $image: String!){
        createPost(body: $body, image: $image){
            id body createdAt username image firstname lastname picture
            likes {
                id username createdAt firstname lastname
            }
            likeCount
            comments {
                id body username createdAt firstname lastname picture
            }
            commentCount
        }
    }
`

export default PostForm;