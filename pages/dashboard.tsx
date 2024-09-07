import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MyBarChart from '../components/BarChart'; 

interface CSVRow {
  EXTRACT_DATE: string;
  EXPECTED_HOURS: number;
  TOTAL_HOURS_COMPULSORY: number;
  TOTAL_HOURS_VOLUNTARY: number;
}

interface Stats {
  expectedHoursMean: number;
  totalHoursCompulsoryMean: number;
  totalHoursVoluntaryMean: number;
  expectedHoursMedian: number;
  totalHoursCompulsoryMedian: number;
  totalHoursVoluntaryMedian: number;
  expectedHoursStdDev: number;
  totalHoursCompulsoryStdDev: number;
  totalHoursVoluntaryStdDev: number;
}

const calculateStats = (data: CSVRow[]): Stats => {
  const expectedHours = data.map(row => row.EXPECTED_HOURS);
  const totalHoursCompulsory = data.map(row => row.TOTAL_HOURS_COMPULSORY);
  const totalHoursVoluntary = data.map(row => row.TOTAL_HOURS_VOLUNTARY);

  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  const standardDeviation = (arr: number[]) => {
    const meanValue = mean(arr);
    return Math.sqrt(arr.map(x => Math.pow(x - meanValue, 2)).reduce((a, b) => a + b) / arr.length);
  };

  return {
    expectedHoursMean: mean(expectedHours),
    totalHoursCompulsoryMean: mean(totalHoursCompulsory),
    totalHoursVoluntaryMean: mean(totalHoursVoluntary),
    expectedHoursMedian: median(expectedHours),
    totalHoursCompulsoryMedian: median(totalHoursCompulsory),
    totalHoursVoluntaryMedian: median(totalHoursVoluntary),
    expectedHoursStdDev: standardDeviation(expectedHours),
    totalHoursCompulsoryStdDev: standardDeviation(totalHoursCompulsory),
    totalHoursVoluntaryStdDev: standardDeviation(totalHoursVoluntary),
  };
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/data.csv')
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse<CSVRow>(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formattedData = result.data.map((row) => ({
              ...row,
              EXPECTED_HOURS: parseFloat(row.EXPECTED_HOURS) || 0,
              TOTAL_HOURS_COMPULSORY: parseFloat(row.TOTAL_HOURS_COMPULSORY) || 0,
              TOTAL_HOURS_VOLUNTARY: parseFloat(row.TOTAL_HOURS_VOLUNTARY) || 0,
            }));
            setData(formattedData);
            setStats(calculateStats(formattedData));
          },
          error: (err) => console.error(err as Error),
        });
      });
  }, []);

  const filteredData = data.filter((row) =>
    row.EXTRACT_DATE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="Search by date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        <h2>Descriptive Statistics</h2>
        {stats ? (
          <>
            <p>Average Expected Hours: {stats.expectedHoursMean.toFixed(2)}</p>
            <p>Average Compulsory Hours: {stats.totalHoursCompulsoryMean.toFixed(2)}</p>
            <p>Average Voluntary Hours: {stats.totalHoursVoluntaryMean.toFixed(2)}</p>
            <p>Median Expected Hours: {stats.expectedHoursMedian.toFixed(2)}</p>
            <p>Median Compulsory Hours: {stats.totalHoursCompulsoryMedian.toFixed(2)}</p>
            <p>Median Voluntary Hours: {stats.totalHoursVoluntaryMedian.toFixed(2)}</p>
            <p>Standard Deviation of Expected Hours: {stats.expectedHoursStdDev.toFixed(2)}</p>
            <p>Standard Deviation of Compulsory Hours: {stats.totalHoursCompulsoryStdDev.toFixed(2)}</p>
            <p>Standard Deviation of Voluntary Hours: {stats.totalHoursVoluntaryStdDev.toFixed(2)}</p>
          </>
        ) : (
          <p>Loading statistics...</p>
        )}
      </div>
      <MyBarChart data={filteredData} />
      {/* Add other charts here */}
    </div>
  );
};

export default Dashboard;
