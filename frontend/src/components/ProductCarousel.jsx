import { Link } from 'react-router-dom';
import { Carousel, Image, Spinner } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const CarouselItem = ({ product }) => (
  <Carousel.Item key={product._id}>
    <Link to={`/product/${product._id}`}>
      <Image src={product.image} alt={product.name} fluid />
      <Carousel.Caption className='carousel-caption'>
        <h2 className='text-white text-right'>
          {product.name} (${product.price})
        </h2>
      </Carousel.Caption>
    </Link>
  </Carousel.Item>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Message variant='danger'>
        {error?.data?.message || error.error}
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Message>
    );
  }

  return (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {products.map((product) => (
        <CarouselItem product={product} />
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
