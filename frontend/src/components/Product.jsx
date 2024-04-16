import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCardBody = ({ product }) => (
  <Card.Body>
    <Link to={`/product/${product._id}`}>
      <Card.Title as='div' className='product-title'>
        <strong>{product.name}</strong>
      </Card.Title>
    </Link>

    <Card.Text as='div'>
      <Rating
        value={product.rating}
        text={`${product.numReviews} reviews`}
      />
    </Card.Text>

    <Card.Text as='h3'>${product.price}</Card.Text>
  </Card.Body>
);

const Product = ({ product }) => (
  <Card className='my-3 p-3 rounded'>
    <Link to={`/product/${product._id}`}>
      <Card.Img src={product.image} variant='top' alt={product.name} />
    </Link>
    <ProductCardBody product={product} />
  </Card>
);

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    numReviews: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default Product;
