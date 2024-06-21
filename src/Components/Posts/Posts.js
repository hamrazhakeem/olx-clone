import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../../store/Context';
import Heart from '../../assets/Heart';
import './Post.css';
import { PostContext } from '../../store/PostContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Posts() {

  const {firebase} = useContext(FirebaseContext)
  const [products, setProducts] = useState([])
  const {setPostDetails} = useContext(PostContext)
  const history = useHistory()

  useEffect(()=>{
    firebase.firestore().collection('products').get().then((snapshot)=>{
      const allPost = snapshot.docs.map((product)=>{
        return {
          ...product.data(),
          id:product.id
        }
      })
      setProducts(allPost)
    })
  },[])

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map(product=>(
            <div
            className="card" onClick={()=>{
              setPostDetails(product);
              history.push('/view');
            }}
            >
            <div className="favorite">
              <Heart></Heart>
            </div>
            <div className="image">
              <img src={product.url} alt="" />
            </div>
            <div className="content">
              <p className="rate">&#x20B9; {product.price}</p>
              <span className="name"> {product.name}</span>
              <p className="kilometer">{product.category}</p>
            </div>
          </div>))}
        </div>
      </div>
    </div>
  );
}

export default Posts;
