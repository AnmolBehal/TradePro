import { keyframes, css } from 'styled-components';

// Keyframes
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInRight = keyframes`
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Animation mixins
export const fadeInAnimation = css`
  animation: ${fadeIn} 0.5s ease forwards;
`;

export const slideUpAnimation = css`
  animation: ${slideUp} 0.5s ease forwards;
`;

export const slideDownAnimation = css`
  animation: ${slideDown} 0.5s ease forwards;
`;

export const slideInLeftAnimation = css`
  animation: ${slideInLeft} 0.5s ease forwards;
`;

export const slideInRightAnimation = css`
  animation: ${slideInRight} 0.5s ease forwards;
`;

export const pulseAnimation = css`
  animation: ${pulse} 2s infinite ease-in-out;
`;

export const rotateAnimation = css`
  animation: ${rotate} 2s linear infinite;
`;

// Hover animations
export const hoverLift = css`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const hoverScale = css`
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const hoverGlow = css`
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 10px ${({ theme }) => theme.primary};
  }
`;