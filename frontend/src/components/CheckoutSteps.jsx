import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavItem = ({ step, link, label }) => (
  <Nav.Item>
    {step ? (
      <LinkContainer to={link}>
        <Nav.Link aria-label={label}>{label}</Nav.Link>
      </LinkContainer>
    ) : (
      <Nav.Link disabled>{label}</Nav.Link>
    )}
  </Nav.Item>
);

NavItem.propTypes = {
  step: PropTypes.bool.isRequired,
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const CheckoutSteps = ({ step1, step2, step3, step4 }) => (
  <Nav className='justify-content-center mb-4'>
    <NavItem step={step1} link='/login' label='Sign In' />
    <NavItem step={step2} link='/shipping' label='Shipping' />
    <NavItem step={step3} link='/payment' label='Payment' />
    <NavItem step={step4} link='/placeorder' label='Place Order' />
  </Nav>
);

CheckoutSteps.propTypes = {
  step1: PropTypes.bool,
  step2: PropTypes.bool,
  step3: PropTypes.bool,
  step4: PropTypes.bool,
};

export default CheckoutSteps;
