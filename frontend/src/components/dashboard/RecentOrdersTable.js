import React from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatters';

const RecentOrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <EmptyState>No recent orders</EmptyState>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Asset</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{order.symbol}</TableCell>
              <TableCell>
                <OrderType type={order.type}>{order.type}</OrderType>
              </TableCell>
              <TableCell>{formatCurrency(order.price)}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{formatCurrency(order.price * order.quantity)}</TableCell>
              <TableCell>
                <OrderStatus status={order.status}>{order.status}</OrderStatus>
              </TableCell>
            </TableRow>
          ))}
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
`;

const TableCell = styled.td`
  padding: 12px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const OrderType = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ type, theme }) => 
    type === 'buy' ? `${theme.success}20` : `${theme.error}20`};
  color: ${({ type, theme }) => 
    type === 'buy' ? theme.success : theme.error};
`;

const OrderStatus = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `${theme.success}20`;
      case 'pending':
        return `${theme.warning}20`;
      case 'cancelled':
        return `${theme.error}20`;
      default:
        return theme.backgroundHover;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'cancelled':
        return theme.error;
      default:
        return theme.secondary;
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.secondary};
  font-size: 14px;
`;

export default RecentOrdersTable;