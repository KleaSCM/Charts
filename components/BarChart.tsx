import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    EXTRACT_DATE: string;
    EXPECTED_HOURS: number;
    TOTAL_HOURS_COMPULSORY: number;
    TOTAL_HOURS_VOLUNTARY: number;
  }[];
}

const MyBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="EXTRACT_DATE" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="EXPECTED_HOURS" fill="#8884d8" />
        <Bar dataKey="TOTAL_HOURS_COMPULSORY" fill="#82ca9d" />
        <Bar dataKey="TOTAL_HOURS_VOLUNTARY" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyBarChart;
