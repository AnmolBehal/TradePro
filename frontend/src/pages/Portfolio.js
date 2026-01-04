import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { getUserPortfolio, getPortfolioAssets } from '../services/portfolioService';
import Loader from '../components/common/Loader';
import AssetAllocation from '../components/portfolio/AssetAllocation';
import PortfolioTable from '../components/portfolio/PortfolioTable';
import { formatCurrency } from '../utils/formatters';
import { getPortfolioStats } from '../services/portfolioService';

const Portfolio = () => {
  const { currentUser } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioAssets, setPortfolioAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioStats, setPortfolioStats] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch portfolio summary
        const portfolioData = await getUserPortfolio();
        setPortfolio(portfolioData);

        // Fetch portfolio assets
        const assetsData = await getPortfolioAssets();
        setPortfolioAssets(assetsData);
        
        // Fetch portfolio stats to get invested amount
        const statsData = await getPortfolioStats();
        setPortfolioStats(statsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data. Please try again.');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PortfolioContainer>
      <PortfolioHeader>
        <h1>Your Portfolio</h1>
        <p>Track and manage your investments</p>
      </PortfolioHeader>

      <PortfolioSummary>
        <SummaryCard>
          <SummaryTitle>Total Value</SummaryTitle>
          <SummaryValue>{formatCurrency(portfolio?.totalValue || 0)}</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryTitle>Cash Balance</SummaryTitle>
          <SummaryValue>{formatCurrency(portfolio?.cashBalance || 0)}</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryTitle>Invested Amount</SummaryTitle>
          <SummaryValue>{formatCurrency(portfolioStats?.totalInvested || 0)}</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryTitle>Total Return</SummaryTitle>
          <SummaryValue profit={portfolio?.totalReturn >= 0}>
            {portfolio?.totalReturn >= 0 ? '+' : ''}
            {formatCurrency(portfolio?.totalReturn || 0)}
            <ReturnPercentage profit={portfolio?.totalReturnPercentage >= 0}>
              ({portfolio?.totalReturnPercentage >= 0 ? '+' : ''}
              {(portfolio?.totalReturnPercentage || 0).toFixed(2)}%)
            </ReturnPercentage>
          </SummaryValue>
        </SummaryCard>
      </PortfolioSummary>

      <PortfolioContent>
        <AllocationSection>
          <SectionTitle>Asset Allocation</SectionTitle>
          <AssetAllocation assets={portfolioAssets} />
        </AllocationSection>

        <AssetsSection>
          <SectionTitle>Your Assets</SectionTitle>
          <PortfolioTable assets={portfolioAssets} />
        </AssetsSection>
      </PortfolioContent>
    </PortfolioContainer>
  );
};

// Styled components
const PortfolioContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PortfolioHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    margin-bottom: 5px;
    color: ${({ theme }) => theme.text};
  }
  
  p {
    color: ${({ theme }) => theme.secondary};
  }
`;

const PortfolioSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 10px;
`;

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ profit, theme }) => profit ? theme.success : profit === false ? theme.error : theme.text};
  display: flex;
  align-items: baseline;
  gap: 5px;
`;

const ReturnPercentage = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: ${({ profit, theme }) => profit ? theme.success : theme.error};
`;

const PortfolioContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AllocationSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AssetsSection = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  padding: 20px;
  text-align: center;
  font-size: 16px;
`;

export default Portfolio;