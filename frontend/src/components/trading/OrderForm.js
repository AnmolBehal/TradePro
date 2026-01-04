import React, { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const OrderForm = forwardRef(({ onPlaceOrder, selectedAsset }, ref) => {
  const { currentUser } = useContext(AuthContext);
  const [orderData, setOrderData] = useState({
    side: 'buy',
    type: 'market', // Changed from 'type' to 'side' and added order type
    quantity: 1,
    price: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate order data
    if (!orderData.quantity || orderData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (orderData.type !== 'market' && (!orderData.price || orderData.price <= 0)) {
      setError('Price is required for limit and stop orders');
      return;
    }

    // Submit order
    onPlaceOrder(orderData);
  };

  // Calculate estimated total based on order data and selected asset
  const estimatedTotal = orderData.quantity * 
    (orderData.type === 'market' ? 
      (selectedAsset?.currentPrice || 0) : 
      (orderData.price || 0));

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setOrderSide: (side) => {
      setOrderData(prev => ({ ...prev, side }));
    }
  }));
  
  return (
    <FormContainer>
      <FormTitle>Place Order</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Order Side</Label>
          <OrderTypeSelector>
            <OrderTypeButton 
              type="button"
              selected={orderData.side === 'buy'}
              onClick={() => setOrderData({...orderData, side: 'buy'})}
            >
              Buy
            </OrderTypeButton>
            <OrderTypeButton 
              type="button"
              selected={orderData.side === 'sell'}
              onClick={() => setOrderData({...orderData, side: 'sell'})}
            >
              Sell
            </OrderTypeButton>
          </OrderTypeSelector>
        </FormGroup>

        <FormGroup>
          <Label>Order Type</Label>
          <OrderTypeSelector>
            <OrderTypeButton 
              type="button"
              selected={orderData.type === 'market'}
              onClick={() => setOrderData({...orderData, type: 'market'})}
            >
              Market
            </OrderTypeButton>
            <OrderTypeButton 
              type="button"
              selected={orderData.type === 'limit'}
              onClick={() => setOrderData({...orderData, type: 'limit'})}
            >
              Limit
            </OrderTypeButton>
          </OrderTypeSelector>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            step="1"
            value={orderData.quantity}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        {orderData.type !== 'market' && (
          <FormGroup>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              min="0.01"
              step="0.01"
              value={orderData.price}
              onChange={handleChange}
              required
            />
          </FormGroup>
        )}
        
        <TotalSection>
          <TotalLabel>Estimated Total:</TotalLabel>
          <TotalValue>{formatCurrency(estimatedTotal)}</TotalValue>
        </TotalSection>
        
        <Button type="submit">
          Place {orderData.side === 'buy' ? 'Buy' : 'Sell'} Order
        </Button>
      </Form>
    </FormContainer>
  );
});


const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const OrderTypeSelector = styled.div`
  display: flex;
  gap: 10px;
`;

const OrderTypeButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid ${({ selected, theme }) => selected ? theme.primary : theme.border};
  border-radius: 4px;
  background-color: ${({ selected, theme }) => selected ? `${theme.primary}20` : theme.inputBackground};
  color: ${({ selected, theme }) => selected ? theme.primary : theme.text};
  font-weight: ${({ selected }) => selected ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ selected, theme }) => selected ? `${theme.primary}30` : theme.backgroundHover};
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin-top: 10px;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const TotalValue = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  background-color: ${({ theme }) => `${theme.error}10`};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.success};
  background-color: ${({ theme }) => `${theme.success}10`};
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
`;

export default OrderForm;