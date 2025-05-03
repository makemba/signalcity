import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface NoiseData {
  timestamp: string;
  decibels: number;
}

interface NoiseHistoryProps {
  data: NoiseData[];
}

const NoiseHistory: React.FC<NoiseHistoryProps> = ({ data }) => {
  const [sliderValue, setSliderValue] = useState([3]);
  const [timeScale, setTimeScale] = useState<"hour" | "day" | "week">("day");
  const [filteredData, setFilteredData] = useState<NoiseData[]>([]);
	const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const now = new Date();
    let startTime: Date;

    switch (timeScale) {
      case "hour":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
    }

    const filtered = data.filter(item => new Date(item.timestamp) >= startTime);
    setFilteredData(filtered);
  }, [data, timeScale]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  const handleTimeScaleChange = (value: "hour" | "day" | "week") => {
    setTimeScale(value);
  };

  return (
    <Card className="col-span-4 lg:col-span-1 shadow-md">
      <CardHeader>
        <CardTitle>Historique du bruit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="timeScale" className="text-sm font-medium">
              Échelle de temps:
            </label>
            <Select onValueChange={handleTimeScaleChange}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Dernière heure</SelectItem>
                <SelectItem value="day">Dernier jour</SelectItem>
                <SelectItem value="week">Dernière semaine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="chartType" className="text-sm font-medium">
              Type de graphique:
            </label>
            <Select onValueChange={setChartType}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Ligne</SelectItem>
                <SelectItem value="bar">Barres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="slider" className="text-sm font-medium block">
              Seuil de bruit ({sliderValue[0]} dB):
            </label>
            <Slider
              id="slider"
              defaultValue={sliderValue}
              max={120}
              step={1}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="decibels" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              ) : (
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="decibels" fill="#8884d8" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoiseHistory;
