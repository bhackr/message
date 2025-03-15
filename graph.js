import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'recharts';

const BinaryTextGraph = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Sample data for the graph
  useEffect(() => {
    // Create data for visualization
    const generateData = () => {
      // Sample binary conversion patterns
      const binaryPatterns = [
        { char: 'A', binary: '01000001', decimal: 65 },
        { char: 'B', binary: '01000010', decimal: 66 },
        { char: 'C', binary: '01000011', decimal: 67 },
        { char: '1', binary: '00110001', decimal: 49 },
        { char: '2', binary: '00110010', decimal: 50 },
        { char: '#', binary: '00100011', decimal: 35 },
        { char: 'a', binary: '01100001', decimal: 97 },
        { char: 'b', binary: '01100010', decimal: 98 },
        { char: 'c', binary: '01100011', decimal: 99 },
        { char: 'space', binary: '00100000', decimal: 32 },
      ];
      
      return {
        labels: binaryPatterns.map(item => item.char),
        datasets: [
          {
            label: 'ASCII Decimal Value',
            data: binaryPatterns.map(item => item.decimal),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            yAxisID: 'y',
          }
        ]
      };
    };
    
    setData(generateData());
    setLoading(false);
  }, []);
  
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'ASCII Binary Representation',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const char = context.chart.data.labels[index];
            const decimal = context.raw;
            const binary = decimal.toString(2).padStart(8, '0');
            return [
              `Character: ${char}`,
              `Decimal: ${decimal}`,
              `Binary: ${binary}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'ASCII Decimal Value'
        }
      },
    },
  };

  if (loading) {
    return <div className="p-4 text-center">Loading graph data...</div>;
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-center mb-4">ASCII Binary Relationship</h2>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <h3 className="font-bold mb-2">How Binary-Text Conversion Works:</h3>
        <p>The converter processes text in these steps:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Each character is converted to its ASCII/Unicode decimal value</li>
          <li>The decimal value is then represented as an 8-bit binary string</li>
          <li>Hashtags (starting with #) are preserved without conversion</li>
          <li>Spaces between binary groups are visual separators and not part of the data</li>
          <li>Only encoded spaces (00100000) appear in the text output</li>
        </ol>
      </div>
    </div>
  );
};

export default BinaryTextGraph;