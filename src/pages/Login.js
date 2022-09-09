import React, { useState, useContext, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Register from './Register';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

import { imagesArr } from '../images/images.js';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [iArr, setIarr] = useState([]);
  const [hideLogin, setHideLogin] = useState(false);
  // console.log(props)
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  });

  // console.log(imagesArr[1])

  useEffect(() => {
    if (imagesArr[1] === '/static/media/2.4c1519c0.svg') {
      setIarr(imagesArr.reverse());
    } else {
      setIarr(imagesArr);
    }
    // console.log(imagesArr[1] === '/static/media/2.8be5a5a0.svg')
    // console.log(imagesArr[1] === '/static/media/111.8d638fcf.svg')
  }, []);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <>
      <div className='loginBackground'>
        <img
          className='imageSpeechBubble'
          key='imageSpeechBubble'
          alt=''
          src={imagesArr[111]}
        />
        {iArr.map((image, i) => {
          if (i === 111) {
            return null;
          } else {
            return <img className={'image' + i} key={i} alt='' src={image} />;
          }
        })}
      </div>

      <div className='loginContainer'>
        <h1 className='socialeyesTitle'>Socialeyes</h1>
        {hideLogin ? (
          <div className='registgerContainer2'>
            <>
              <>
                <Register />
              </>
              <p>
                Already registered?{' '}
                <span
                  className='signButton'
                  onClick={() => setHideLogin(!hideLogin)}
                >
                  Sign in!
                </span>
              </p>
            </>
          </div>
        ) : (
          <div className='loginContainer2'>
            <>
              <>
                <Form
                  onSubmit={onSubmit}
                  noValidate
                  className={loading ? 'loading' : ''}
                >
                  <h1 className='loginWord'>Login</h1>
                  <Form.Input
                    // label="Username"
                    placeholder='Username'
                    name='username'
                    type='text'
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                  />
                  <Form.Input
                    // label="Password"
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                  />
                  <Button type='submit' primary>
                    Go!
                  </Button>
                </Form>
                {Object.keys(errors).length > 0 && (
                  <div className='ui error message'>
                    <ul className='list'>
                      {Object.values(errors).map((value) => (
                        <li key={value}>{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
              <p>
                Don't have an account?{' '}
                <span
                  className='signButton'
                  onClick={() => setHideLogin(!hideLogin)}
                >
                  Sign up!
                </span>
              </p>
            </>
          </div>
        )}
      </div>
    </>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
      firstname
      lastname
      picture
    }
  }
`;

export default Login;
