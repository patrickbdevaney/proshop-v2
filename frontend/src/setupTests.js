
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Import the React Testing Library methods 
import { render, fireEvent } from '@testing-library/react';

// Add a global cleanup method for tests to help with isolating the tests
import { cleanup } from '@testing-library/react';
afterEach(cleanup);
