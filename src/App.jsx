import React, {useEffect, useContext, Suspense, lazy} from 'react';
import './App.css';
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import View from './Pages/ViewPost'

/**
 * ?  =====Import Components=====
 */
import Home from './Pages/Home';
import { AuthContext, FirebaseContext } from './store/Context';
import Post from './store/PostContext';

const Create = lazy(() => import('./Pages/Create'));


function App() {
  const { setUser } = useContext(AuthContext);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      setUser(user);
    });
  }, [firebase, setUser]);
  return (
    <div>
      <Post>
        <Router>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Suspense fallback={<div>Loading...</div>}>
            <Route path='/create'>
              <Create />
            </Route>
          </Suspense>
          <Route path='/view'>
            <View/>
          </Route>
        </Router>
      </Post>
    </div>
  );
}

export default App;
