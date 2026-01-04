import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatters';

const AssetList = ({ assets, selectedAsset, onAssetSelect }) => {
  if (!assets || assets.length === 0) {
    return <EmptyState>No assets found</EmptyState>;
  }

  return (
    <AssetListContainer>
      {assets.map((asset) => (
        <AssetItem 
          key={asset._id} 
          selected={selectedAsset && selectedAsset._id === asset._id}
          onClick={() => onAssetSelect(asset)}
        >
          <AssetInfo>
            <AssetSymbol>{asset.symbol}</AssetSymbol>
            <AssetName>{asset.name}</AssetName>
          </AssetInfo>
          <AssetPriceInfo>
            <AssetPrice>{formatCurrency(asset.currentPrice)}</AssetPrice>
            <PriceChange positive={asset.dailyChangePercentage >= 0}>
              {asset.dailyChangePercentage >= 0 ? '↑' : '↓'} 
              {Math.abs(asset.dailyChangePercentage).toFixed(2)}%
            </PriceChange>
          </AssetPriceInfo>
        </AssetItem>
      ))}
    </AssetListContainer>
  );
};

const AssetListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.secondary};
  }
`;

const AssetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ selected, theme }) => 
    selected ? `${theme.primary}10` : 'transparent'};
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.primary : 'transparent'};
  
  &:hover {
    background-color: ${({ selected, theme }) => 
      selected ? `${theme.primary}15` : theme.backgroundHover};
  }
`;

const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetSymbol = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const AssetName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const AssetPriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const AssetPrice = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const PriceChange = styled.span`
  font-size: 12px;
  color: ${({ positive, theme }) => positive ? theme.success : theme.error};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.secondary};
  font-size: 14px;
`;

export default AssetList;