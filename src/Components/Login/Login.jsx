import React, { useState, useContext } from 'react';
import {AuthContext, FirebaseContext} from '../../store/Context'
import Logo from '../../olx-logo.png';
import './Login.css';
import { Link, Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {firebase} = useContext(FirebaseContext)
  const history = useHistory()
  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e)=>{
    e.preventDefault();

    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      history.push('/')
    }).catch((error) => {
      alert(error.message);
    });
};

  return (
    <div>
      <div className="loginParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        <form onSubmit={handleLogin}>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            id="fname"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            name="email"
            defaultValue="John"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            id="lname"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            name="password"
            defaultValue="Doe"
          />
          <br />
          <br />
          <button type='submit'>Login</button>
        </form>
        <div className="signup-btn">
          <Link to="/signup" style={{ textDecoration: 'none', color: 'black' }}>Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
