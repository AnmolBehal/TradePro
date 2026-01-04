import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }

  button {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }

  .slide-down {
    animation: slideDown 0.5s ease forwards;
  }

  .slide-in-left {
    animation: slideInLeft 0.5s ease forwards;
  }

  .slide-in-right {
    animation: slideInRight 0.5s ease forwards;
  }

  /* Keyframes */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideInLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* Page transitions */
  .page-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }

  .page-exit {
    opacity: 1;
  }

  .page-exit-active {
    opacity: 0;
    transition: opacity 300ms;
  }
`;

export default GlobalStyle;