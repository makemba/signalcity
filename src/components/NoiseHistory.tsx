
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface NoiseHistoryProps {
  data: {
    date: string;
    level: number;
  }[];
  title?: string;
}

const NoiseHistory = ({ data, title = "Historique des niveaux sonores" }: NoiseHistoryProps) => {
  // Si aucune donnée n'est fournie, nous utilisons des données factices pour éviter l'erreur
  const displayData = data && data.length > 0 ? data : [
    { date: "Lun", level: 45 },
    { date: "Mar", level: 52 },
    { date: "Mer", level: 49 },
    { date: "Jeu", level: 63 },
    { date: "Ven", level: 58 },
    { date: "Sam", level: 72 },
    { date: "Dim", level: 47 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={displayData}>
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} dB`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.date}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Niveau
                          </span>
                          <span className="font-bold">
                            {payload[0].value} dB
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#0ea5e9"
              strokeWidth={2}
              activeDot={{
                r: 6,
                style: { fill: "#0ea5e9", opacity: 0.8 },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NoiseHistory;
