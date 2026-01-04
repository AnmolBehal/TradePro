import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { getAssets, getAssetHistory, searchAssets } from '../services/assetService';
import { placeOrder } from '../services/orderService';
import Loader from '../components/common/Loader';
import OrderForm from '../components/trading/OrderForm';
import AssetList from '../components/trading/AssetList';
import { formatCurrency } from '../utils/formatters';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Trading = () => {
  
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetHistory, setAssetHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('1d');
  const [assetType, setAssetType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const orderFormRef = useRef(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        let assetsData;
        if (searchQuery.trim()) {
          assetsData = await searchAssets(searchQuery);
        } else {
          assetsData = await getAssets(assetType === 'all' ? '' : assetType);
        }

        setAssets(assetsData);

        // Select the first asset by default if none is selected
        if (!selectedAsset && assetsData.length > 0) {
          setSelectedAsset(assetsData[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError('Failed to load assets. Please try again.');
        setLoading(false);
      }
    };

    fetchAssets();
  }, [assetType, searchQuery, selectedAsset]);

  useEffect(() => {
    const fetchAssetHistory = async () => {
      if (!selectedAsset) return;

      try {
        setLoading(true);
        const historyData = await getAssetHistory(selectedAsset.symbol, timeframe);
        setAssetHistory(historyData.history);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching asset history:', err);
        setError('Failed to load asset history. Please try again.');
        setLoading(false);
      }
    };

    fetchAssetHistory();
  }, [selectedAsset, timeframe]);

  // Add this effect to initialize chart data when component mounts
  useEffect(() => {
    if (assetType === 'all' && assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, assetType, selectedAsset]);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleAssetTypeChange = (newType) => {
    setAssetType(newType);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      

      const response = await placeOrder({
        ...orderData,
        symbol: selectedAsset.symbol
      });

      

      
      setLoading(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        
      }, 5000);
    } catch (err) {
      console.error('Error placing order:', err);
      
      // Check if the error contains a message property or if it's a string
      const errorMessage = err.message || (typeof err === 'string' ? err : 'Failed to place order');
      
      // Only show error toast if there's no order ID in the error response
      // This prevents showing error when order was actually placed successfully
      if (!err.order || !err.order._id) {
        toast.error(`Error: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setError(errorMessage);
      } else {
        
        
        
      }
      
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: assetHistory.map(item => {
      const date = new Date(item.timestamp);
      return timeframe === '1d' ? date.toLocaleTimeString() : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: selectedAsset?.symbol,
        data: assetHistory.map(item => item.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Price: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
    },
  };

  return (
    <TradingContainer>
      <ToastContainer />
      <TradingGrid>
        <AssetListSection>
          <AssetTypeSelector>
            <AssetTypeButton 
              active={assetType === 'all'} 
              onClick={() => handleAssetTypeChange('all')}
            >
              All
            </AssetTypeButton>
            <AssetTypeButton 
              active={assetType === 'stock'} 
              onClick={() => handleAssetTypeChange('stock')}
            >
              Stocks
            </AssetTypeButton>
            <AssetTypeButton 
              active={assetType === 'crypto'} 
              onClick={() => handleAssetTypeChange('crypto')}
            >
              Crypto
            </AssetTypeButton>
          </AssetTypeSelector>

          <SearchInput 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery} 
            onChange={handleSearch} 
          />

          {loading && !selectedAsset ? (
            <Loader />
          ) : error && !selectedAsset ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <AssetList 
              assets={assets} 
              selectedAsset={selectedAsset} 
              onAssetSelect={handleAssetSelect} 
            />
          )}
        </AssetListSection>

        <TradingSection>
          {selectedAsset ? (
            <>
              <AssetHeader>
                <AssetInfo>
                  <AssetSymbol>{selectedAsset.symbol}</AssetSymbol>
                  <AssetName>{selectedAsset.name}</AssetName>
                </AssetInfo>
                <AssetPrice>
                  <CurrentPrice>{formatCurrency(selectedAsset.currentPrice)}</CurrentPrice>
                  <PriceChange positive={selectedAsset.dailyChangePercentage >= 0}>
                    {selectedAsset.dailyChangePercentage >= 0 ? '↑' : '↓'} 
                    {formatCurrency(Math.abs(selectedAsset.dailyChange))} 
                    ({Math.abs(selectedAsset.dailyChangePercentage).toFixed(2)}%)
                  </PriceChange>
                </AssetPrice>
              </AssetHeader>

              <TimeframeSelector>
                <TimeframeButton 
                  active={timeframe === '1h'} 
                  onClick={() => handleTimeframeChange('1h')}
                >
                  1H
                </TimeframeButton>
                <TimeframeButton 
                  active={timeframe === '1d'} 
                  onClick={() => handleTimeframeChange('1d')}
                >
                  1D
                </TimeframeButton>
                <TimeframeButton 
                  active={timeframe === '1w'} 
                  onClick={() => handleTimeframeChange('1w')}
                >
                  1W
                </TimeframeButton>
                <TimeframeButton 
                  active={timeframe === '1m'} 
                  onClick={() => handleTimeframeChange('1m')}
                >
                  1M
                </TimeframeButton>
                <TimeframeButton 
                  active={timeframe === '3m'} 
                  onClick={() => handleTimeframeChange('3m')}
                >
                  3M
                </TimeframeButton>
                <TimeframeButton 
                  active={timeframe === '1y'} 
                  onClick={() => handleTimeframeChange('1y')}
                >
                  1Y
                </TimeframeButton>
              </TimeframeSelector>

              <ChartContainer>
                {loading ? (
                  <Loader />
                ) : error ? (
                  <ErrorMessage>{error}</ErrorMessage>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </ChartContainer>

              <AssetDetails>
                <DetailItem>
                  <DetailLabel>Market Cap</DetailLabel>
                  <DetailValue>{formatCurrency(selectedAsset.marketCap)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>24h Volume</DetailLabel>
                  <DetailValue>{formatCurrency(selectedAsset.volume24h)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>24h High</DetailLabel>
                  <DetailValue>{formatCurrency(selectedAsset.high24h)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>24h Low</DetailLabel>
                  <DetailValue>{formatCurrency(selectedAsset.low24h)}</DetailValue>
                </DetailItem>
              </AssetDetails>
              <OrderForm 
                ref={orderFormRef}
                onPlaceOrder={handlePlaceOrder} 
                selectedAsset={selectedAsset} 
              />
            </>
          ) : (
            <Loader />
          )}
        </TradingSection>
      </TradingGrid>
    </TradingContainer>);
}

// Styled components
const TradingContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AssetListSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: fit-content;
`;

const AssetTypeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const AssetTypeButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ active, theme }) => active ? theme.primary : theme.background};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  cursor: pointer;
  font-size: 14px;
  flex: 1;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.primaryHover : theme.backgroundHover};
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 14px;
  width: 100%;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TradingSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AssetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const AssetInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetSymbol = styled.h2`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const AssetName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
`;

const AssetPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const PriceChange = styled.span`
  font-size: 14px;
  color: ${({ positive, theme }) => positive ? theme.success : theme.error};
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TimeframeButton = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ active, theme }) => active ? theme.primary : theme.background};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.primaryHover : theme.backgroundHover};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 20px;
`;

const AssetDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
`;

const DetailValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  padding: 20px;
  text-align: center;
  font-size: 16px;
`;

export default Trading;