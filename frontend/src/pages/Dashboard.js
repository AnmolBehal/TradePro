import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import { getUserPortfolio, getPortfolioHistory, getPortfolioStats } from '../services/portfolioService';
import { getAssets } from '../services/assetService';
import Loader from '../components/common/Loader';
import AssetCard from '../components/dashboard/AssetCard';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { getUserOrders } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [topAssets, setTopAssets] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [timeframe, setTimeframe] = useState('1m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch portfolio data
        const portfolioData = await getUserPortfolio();
        setPortfolio(portfolioData);

        // Fetch portfolio history
        const historyData = await getPortfolioHistory(timeframe);
        setPortfolioHistory(historyData.history);

        try {
          // Fetch portfolio stats - wrapped in separate try/catch
          const statsData = await getPortfolioStats();
          setPortfolioStats(statsData);
        } catch (statsErr) {
          console.error('Error fetching portfolio stats:', statsErr);
          // Don't fail the entire dashboard for this one error
        }

        try {
          // Fetch top assets - wrapped in separate try/catch
          const assetsData = await getAssets();
          setTopAssets(assetsData.slice(0, 5));
        } catch (assetsErr) {
          console.error('Error fetching top assets:', assetsErr);
          // Don't fail the entire dashboard for this one error
        }

        try {
          // Fetch recent orders - wrapped in separate try/catch
          const ordersData = await getUserOrders();
          setRecentOrders(ordersData.slice(0, 5));
        } catch (ordersErr) {
          console.error('Error fetching recent orders:', ordersErr);
          // Don't fail the entire dashboard for this one error
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  // Prepare chart data
  const chartData = {
    labels: portfolioHistory.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioHistory.map(item => item.value),
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
            return `Value: ${formatCurrency(context.raw)}`;
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const handleCardClick = (type) => {
    let title, content;
    
    switch(type) {
      case 'cash':
        title = 'Cash Balance';
        content = `Your available cash is ${formatCurrency(portfolio?.cashBalance || 0)}. This is the amount you can use to purchase new assets.`;
        break;
      case 'assets':
        title = 'Assets Value';
        content = `Your assets are worth ${formatCurrency(portfolioStats?.assetsValue || 0)}. This represents the current market value of all stocks and cryptocurrencies in your portfolio.`;
        break;
      case 'orders':
        title = 'Total Orders';
        content = `You have placed ${portfolioStats?.totalOrders || 0} orders in total. This includes ${portfolioStats?.buyOrders || 0} buy orders and ${portfolioStats?.sellOrders || 0} sell orders.`;
        break;
      case 'profit':
        title = 'Profit/Loss';
        content = `Your total profit/loss is ${formatCurrency(portfolioStats?.totalProfitLoss || 0)} (${Math.abs(portfolioStats?.profitLossPercentage || 0).toFixed(2)}%). This includes both realized and unrealized gains.`;
        break;
      default:
        return;
    }
    
    setModalInfo({ title, content });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome back, {currentUser?.firstName || currentUser?.username}!</h1>
        <p>Here's an overview of your portfolio and market trends.</p>
      </WelcomeSection>

      <PortfolioOverview>
        <PortfolioValue>
          <h2>Portfolio Value</h2>
          <ValueAmount>{formatCurrency(portfolio?.totalValue || 0)}</ValueAmount>
          <ProfitLoss positive={portfolioStats?.totalProfitLoss >= 0}>
            {portfolioStats?.totalProfitLoss >= 0 ? '↑' : '↓'} 
            {formatCurrency(Math.abs(portfolioStats?.totalProfitLoss || 0))} 
            ({Math.abs(portfolioStats?.profitLossPercentage || 0).toFixed(2)}%)
          </ProfitLoss>
        </PortfolioValue>

        <TimeframeSelector>
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
          <TimeframeButton 
            active={timeframe === 'all'} 
            onClick={() => handleTimeframeChange('all')}
          >
            ALL
          </TimeframeButton>
        </TimeframeSelector>

        <ChartContainer>
          <Line data={chartData} options={chartOptions} />
        </ChartContainer>
      </PortfolioOverview>

      <StatsGrid>
        <StatsCard 
          title="Cash Balance" 
          value={formatCurrency(portfolio?.cashBalance || 0)} 
          icon="💰"
          onClick={() => handleCardClick('cash')}
        />
        <StatsCard 
          title="Assets Value" 
          value={formatCurrency(portfolioStats?.assetsValue || 0)} 
          icon="📈"
          onClick={() => handleCardClick('assets')}
        />
        <StatsCard 
          title="Total Orders" 
          value={portfolioStats?.totalOrders || 0} 
          icon="🔄"
          onClick={() => handleCardClick('orders')}
        />
        <StatsCard 
          title="Profit/Loss" 
          value={formatCurrency(portfolioStats?.totalProfitLoss || 0)} 
          icon={portfolioStats?.totalProfitLoss >= 0 ? "✅" : "❌"}
          highlight={portfolioStats?.totalProfitLoss >= 0 ? 'positive' : 'negative'}
          onClick={() => handleCardClick('profit')}
        />
      </StatsGrid>

      <SectionTitle>Top Assets</SectionTitle>
      <AssetsGrid>
        {topAssets.map(asset => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </AssetsGrid>

      <SectionTitle>Recent Orders</SectionTitle>
      <RecentOrdersTable orders={recentOrders} />
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  p {
    color: ${({ theme }) => theme.secondary};
  }
`;

const PortfolioOverview = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const PortfolioValue = styled.div`
  margin-bottom: 20px;
  
  h2 {
    font-size: 16px;
    color: ${({ theme }) => theme.secondary};
    margin-bottom: 8px;
  }
`;

const ValueAmount = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProfitLoss = styled.div`
  font-size: 16px;
  color: ${({ theme, positive }) => positive ? theme.positive : theme.negative};
`;

const TimeframeSelector = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 10px;
`;

const TimeframeButton = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  color: ${({ theme, active }) => active ? theme.primary : theme.text};
  background-color: ${({ theme, active }) => active ? theme.primaryHover + '20' : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover + '10'};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  padding: 20px;
  text-align: center;
  font-size: 16px;
`;

export default Dashboard;

// Add these styled components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.secondary};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  line-height: 1.5;
`;