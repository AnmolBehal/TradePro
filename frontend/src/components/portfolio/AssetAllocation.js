import React from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const AssetAllocation = ({ assets }) => {
  if (!assets || assets.length === 0) {
    return <EmptyState>No assets in portfolio</EmptyState>;
  }

  // Group assets by type
  const assetsByType = assets.reduce((acc, asset) => {
    const type = asset.type || 'Other';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += asset.value;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = {
    labels: Object.keys(assetsByType),
    datasets: [
      {
        data: Object.values(assetsByType),
        backgroundColor: [
          '#3b82f6', // blue
          '#10b981', // green
          '#f59e0b', // yellow
          '#ef4444', // red
          '#8b5cf6', // purple
          '#ec4899', // pink
          '#6366f1', // indigo
          '#14b8a6', // teal
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
          color: '#888',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  // Calculate total value
  const totalValue = Object.values(assetsByType).reduce((a, b) => a + b, 0);

  return (
    <AllocationContainer>
      <ChartContainer>
        <Doughnut data={chartData} options={chartOptions} />
        <CenterText>
          <TotalLabel>Total</TotalLabel>
          <TotalValue>{formatCurrency(totalValue)}</TotalValue>
        </CenterText>
      </ChartContainer>
      
      <AllocationList>
        {Object.entries(assetsByType).map(([type, value], index) => {
          const percentage = ((value / totalValue) * 100).toFixed(1);
          return (
            <AllocationItem key={type}>
              <AllocationColor color={chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length]} />
              <AllocationDetails>
                <AllocationTypeRow>
                  <AllocationType>{type}</AllocationType>
                  <AllocationPercentage>{percentage}%</AllocationPercentage>
                </AllocationTypeRow>
                <AllocationValue>{formatCurrency(value)}</AllocationValue>
              </AllocationDetails>
            </AllocationItem>
          );
        })}
      </AllocationList>
    </AllocationContainer>
  );
};

const AllocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 250px;
  margin: 0 auto;
  width: 100%;
  max-width: 250px;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const TotalLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 5px;
`;

const TotalValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const AllocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AllocationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AllocationColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${({ color }) => color};
`;

const AllocationDetails = styled.div`
  flex: 1;
`;

const AllocationTypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AllocationType = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const AllocationPercentage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondary};
`;

const AllocationValue = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.secondary};
  font-size: 14px;
`;

export default AssetAllocation;