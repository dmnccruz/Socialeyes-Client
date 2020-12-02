import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import axios from 'axios';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks'

function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: "",
        email: "",
        picture: "https://res.cloudinary.com/dwsf70imh/image/upload/v1606820063/l5fjp4xz6gif50nhval7.jpg",
        firstname: "",
        lastname: "",
        password: "",
        confirmPassword: ""
    })

    const [previewSource, setPreviewSource] = useState('https://res.cloudinary.com/dwsf70imh/image/upload/v1606820063/l5fjp4xz6gif50nhval7.jpg');

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: {register: userData} }){
            context.login(userData)
            // props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values 
    })
    
    function registerUser() {
        addUser();
    }


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
            'https://api.cloudinary.com/v1_1/dwsf70imh/image/upload', formData
        )
        // console.log(response.data.secure_url)
        values.picture = response.data.secure_url
    };

    // console.log(values)

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    return (
        <div>
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
                <div className="profilePic"  onClick={() => document.getElementById('previewImageInput').click()} style={{backgroundImage: `url(${previewSource})`}}>
                    <Form.Input
                        placeholder="upload image."
                        name="picture"
                        onChange={handFileInputChange}
                        // error={error ? true : false}
                        type="file"
                        id="previewImageInput"
                    />
                    <i id="previewImageCameraRegister" className='fas'>&#xf083;</i>
                    <p>Upload your picture!</p>
                </div>
                <Form.Input 
                    // label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input 
                    // label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />
                <div id="loginRegister">
                    <Form.Input 
                        placeholder="First name"
                        name="firstname"
                        type="text"
                        value={values.firstname}
                        error={errors.firstname ? true : false}
                        onChange={onChange}
                    />
                    <Form.Input 
                        placeholder="Last name"
                        name="lastname"
                        type="text"
                        value={values.lastname}
                        error={errors.lastname ? true : false}
                        onChange={onChange}
                    />
                </div>
                <Form.Input 
                    // label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Form.Input 
                    // label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const REGISTER_USER = gql`
mutation register(
    $username: String!
    $firstname: String!
    $lastname: String!
    $picture: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
){
    register(
        registerInput: {
            username: $username
            firstname: $firstname
            lastname: $lastname
            picture: $picture
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }
    ){
        id email username firstname picture lastname createdAt token 
    }
}
`

export default Register;

