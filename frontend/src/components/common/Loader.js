import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  return (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => `${theme.primary}30`};
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export default Loader;