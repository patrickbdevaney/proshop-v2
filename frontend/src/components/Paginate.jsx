import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const generateUrl = (isAdmin, keyword, x) => {
  if (isAdmin) {
    return `/admin/productlist/${x + 1}`;
  }
  if (keyword) {
    return `/search/${keyword}/page/${x + 1}`;
  }
  return `/page/${x + 1}`;
};

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={generateUrl(isAdmin, keyword, x)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

Paginate.propTypes = {
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool,
  keyword: PropTypes.string,
};

export default Paginate;
