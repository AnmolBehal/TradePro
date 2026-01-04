import React, { useState } from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const PortfolioTable = ({ assets }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'value',
    direction: 'descending'
  });

  if (!assets || assets.length === 0) {
    return <EmptyState>No assets in portfolio</EmptyState>;
  }

  const sortedAssets = [...assets].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  const handleSellClick = (asset) => {
    // Navigate to trading page with the selected asset and sell action
    navigate('/trading', { 
      state: { 
        selectedAssetSymbol: asset.symbol,
        action: 'sell'
      } 
    });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader onClick={() => requestSort('symbol')}>
              Asset {getSortDirection('symbol')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('type')}>
              Type {getSortDirection('type')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('quantity')}>
              Quantity {getSortDirection('quantity')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('avgPrice')}>
              Avg. Price {getSortDirection('avgPrice')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('currentPrice')}>
              Current Price {getSortDirection('currentPrice')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('value')}>
              Value {getSortDirection('value')}
            </TableHeader>
            <TableHeader onClick={() => requestSort('profitLoss')}>
              Profit/Loss {getSortDirection('profitLoss')}
            </TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAssets.map((asset) => {
            const profitLoss = asset.value - (asset.avgPrice * asset.quantity);
            const profitLossPercentage = ((asset.currentPrice - asset.avgPrice) / asset.avgPrice) * 100;
            const isPositive = profitLoss >= 0;
            
            return (
              <TableRow key={asset._id}>
                <TableCell>
                  <AssetInfo>
                    <AssetSymbol>{asset.symbol}</AssetSymbol>
                    <AssetName>{asset.name}</AssetName>
                  </AssetInfo>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.quantity}</TableCell>
                <TableCell>{formatCurrency(asset.avgPrice)}</TableCell>
                <TableCell>{formatCurrency(asset.currentPrice)}</TableCell>
                <TableCell>{formatCurrency(asset.value)}</TableCell>
                <TableCell>
                  <ProfitLoss positive={isPositive}>
                    {isPositive ? '+' : ''}{formatCurrency(profitLoss)}
                    <ProfitLossPercentage>
                      ({isPositive ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                    </ProfitLossPercentage>
                  </ProfitLoss>
                </TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleSellClick(asset)}>
                    Sell
                  </ActionButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundHover};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetSymbol = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const AssetName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
`;

const ProfitLoss = styled.div`
  color: ${({ positive, theme }) => positive ? theme.success : theme.error};
  display: flex;
  flex-direction: column;
`;

const ProfitLossPercentage = styled.span`
  font-size: 12px;
  margin-top: 2px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.secondary};
  font-size: 14px;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.negative};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.negativeHover || '#d32f2f'};
    transform: translateY(-2px);
  }
`;

export default PortfolioTable;