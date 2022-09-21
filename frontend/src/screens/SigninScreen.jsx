import Axios from 'axios';
import { Helmet } from "react-helmet-async"
import Container from "react-bootstrap/esm/Container"
import Form from "react-bootstrap/esm/Form"
import Button from "react-bootstrap/esm/Button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';


const SigninScreen = () => {
    // useLocation is a hook form react-router-dom
    const navigate = useNavigate();
    const { search } = useLocation();

    // the value in the redirectInUrl will be '/shipping'
    const redirectInUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await Axios.post('/api/users/signin', {
          email,
          password,
        });
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data)); // data in the local storage should be string type
        navigate(redirect || '/');
      } catch (err) {
        toast.error(getError(err));  // gets the error from backend
      }
    };

    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);
    
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <div className="mb-3">
            <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
            New customer?{' '}
            <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  )
}

export default SigninScreen
