import React, { Fragment, useContext, useState } from 'react';
import './Create.css';
import Header from '../Header/Header';
import {FirebaseContext, AuthContext} from '../../store/Context'
import { Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Create = () => {
  const history = useHistory()
  const {firebase} = useContext(FirebaseContext)
  const {user} = useContext(AuthContext)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const date = new Date()

  if (!user) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!category.trim() || !/^[a-zA-Z\s]+$/.test(category)) {
      newErrors.category = 'Category is required';
    }

    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
    firebase.storage().ref(`/image/${image.name}`).put(image).then(({ref})=>{
      ref.getDownloadURL().then((url)=>{
        firebase.firestore().collection('products').add({
          name, 
          category,
          price,
          url:url,
          userId:user.uid,
          createdAt:date.toDateString()
        });
        history.push('/')
      });
    });
  }
};

  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">
          <form onSubmit={handleSubmit}>
            <label htmlFor="fname">Name</label>
            <br />
            
            <input
              className="input"
              type="text"
              id="fname"
              name="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
            <br/>
            {errors.name && <span style={{color:'red'}}>{errors.name}</span>}
            <br /><br />
            <label htmlFor="fname">Category</label>
            <br />
            <input
              className="input"
              type="text"
              id="fname"
              name="category"
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
            />
            <br />
            {errors.category && <span style={{color:'red'}}>{errors.category}</span>}
            <br /><br />
            <label htmlFor="fname">Price</label>
            <br />
            <input className="input" type="number" id="fname" name="Price"
              value={price} onChange={(e)=>setPrice(e.target.value)}
            />
            <br />
            {errors.price && <span style={{color:'red'}}>{errors.price}</span>}
          <br />
          <br />
            <br />
            <input onChange={(e)=>{
              setImage(e.target.files[0])
            }} type="file" />
            <br />
            {errors.image && <span style={{color:'red'}}>{errors.image}</span>}
            <button onClick={handleSubmit} className="uploadBtn">Submit</button>
            </form>
        </div>
      </card>
    </Fragment>
  );
};

export default Create;
