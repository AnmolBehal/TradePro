import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatters';

const AssetCard = ({ asset }) => {
  const isPositive = asset.changePercentage >= 0;

  return (
    <Card>
      <AssetHeader>
        <AssetSymbol>{asset.symbol}</AssetSymbol>
        <AssetType>{asset.type}</AssetType>
      </AssetHeader>
      <AssetName>{asset.name}</AssetName>
      <AssetValue>{formatCurrency(asset.value)}</AssetValue>
      <AssetChange positive={isPositive}>
        {isPositive ? '↑' : '↓'} {Math.abs(asset.changePercentage).toFixed(2)}%
      </AssetChange>
      <AssetQuantity>
        {asset.quantity} {asset.quantity === 1 ? 'unit' : 'units'}
      </AssetQuantity>
    </Card>
  );
};

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AssetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const AssetSymbol = styled.span`
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const AssetType = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
  background-color: ${({ theme }) => theme.backgroundHover};
  padding: 2px 6px;
  border-radius: 4px;
`;

const AssetName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AssetValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 5px;
`;

const AssetChange = styled.div`
  font-size: 14px;
  color: ${({ positive, theme }) => positive ? theme.success : theme.error};
  margin-bottom: 10px;
`;

const AssetQuantity = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
`;

export default AssetCard;