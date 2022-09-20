import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
    // const params = useParams();
    const navigate = useNavigate();
    const {slug} = useParams();
    console.log({slug});

    const [{loading, error, product}, dispatch] = useReducer(reducer, {
      product : [],
      loading: true, 
      error:''
  });
  
  // const [products, setProducts] = useState([]);
  useEffect(() => {
      const fetchData = async () => {
          dispatch({type:'FETCH_REQUEST'});
          try {
              const result = await axios.get(`/api/products/slug/${slug}`);
              dispatch({type: 'FETCH_SUCCESS', payload: result.data})
          } catch(err) {
              dispatch( {type: 'FETCH_FAIL', payload: getError(err) });
          }
          
          // setProducts(result.data);
      }
      fetchData();
  },[slug])

  // To add an item to the cart you need to dispatch an action under a React context

  const {state, dispatch: cxtDispatch} = useContext(Store);
  // By using the useContext we can access the state of the context and change the context ie cxtDispatch

  const {cart} =  state;

  const addToCartHandler = async() => {
    // Check current item exists in the cart or not

    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    cxtDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}
  });
  
  // Navigate to car page - here we use useNavigate hook to get this functionality
  
  navigate('/cart');
  }

  // Now add items in the cart as a Badge in the app.js Navbar section

  return (
    loading ? 
      (<LoadingBox />) 
      : error ? 
      (<MessageBox variant="danger">{error}</MessageBox>) 
    : (<div>
      <Row>
        <Col md={6}>
          <img 
            className="img-large"
            src={product.image}
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          {/* variant='flush' to get rid of border around the item */}
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              />
              <ListGroup.Item>
                Price: £{product.price}
              </ListGroup.Item>
              <ListGroup.Item>
                Description: 
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
              <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock>0 ? 
                      (<Badge bg='success'>In Stock</Badge>)
                      :(<Badge bg='danger'>Unavailable</Badge>)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant='primary'>
                        Add to Bag
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>)
  )
}

export default ProductScreen
