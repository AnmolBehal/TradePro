import React, { useState } from 'react';
import styled from 'styled-components';

const StatsCard = ({ title, value, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? 'hovered' : ''}
    >
      <IconContainer>{icon}</IconContainer>
      <Content>
        <Title>{title}</Title>
        <Value>{value}</Value>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover, &.hovered {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  font-size: 24px;
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 5px;
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export default StatsCard;