import React, { useState,useContext } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Logo from '../../olx-logo.png';
import './Signup.css';
import { AuthContext, FirebaseContext } from '../../store/Context';

export default function Signup() {
  const history = useHistory()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const {firebase} = useContext(FirebaseContext);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect to="/" />;
  }

  const handleSubmit = (e)=>{
    e.preventDefault()

    if (!username || !phone || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (username.trim() === '') {
      setError("Please enter a username");
      return;
    }

    if (username.trim().replace(/\s/g, '') === '') {
      setError("Username cannot contain only whitespace");
      return;
    }

    firebase.firestore().collection('users').where('phone', '==', phone).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        setError("Phone number is already registered with another account");
        return;
      }
  
      firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
        result.user.updateProfile({ displayName: username }).then(() => {
          firebase.firestore().collection('users').add({
            id: result.user.uid,
            username: username,
            phone: phone
          }).then(() => {
            history.push('/login');
          });
        }).catch((error) => {
          setError(error.message);
        });
      }).catch((error) => {
        setError(error.message);
      });
    }).catch((error) => {
      setError(error.message);
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^(?!0{10}$)\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };
  
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div>
      <div className="signupParentDiv" style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img width="200px" height="200px" src={Logo} alt='logo'></img>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className="input"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            type="text"
            id="fname"
            name="name"
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            id="fname"
            name="email"
          />
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className="input"
            type="number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            id="lname"
            name="phone"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            id="lname"
            name="password"
          />
          <br />
          {error && (
            <div className="error" style={{ textAlign: 'center', color: 'red' }}>
              {error}
            </div>
          )}
          <br />
          <button type='submit'>Signup</button>
        </form>
        <div className="login-btn">
          <Link to='/login' style={{ textDecoration: 'none', color: 'black' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
