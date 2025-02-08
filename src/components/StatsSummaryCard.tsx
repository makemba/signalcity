
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  change?: {
    value: number;
    increase: boolean;
  };
  color: string;
  bgColor: string;
}

export default function StatsSummaryCard({
  icon: Icon,
  label,
  value,
  change,
  color,
  bgColor,
}: StatsSummaryCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <span className={`text-sm ${change.increase ? 'text-green-500' : 'text-red-500'}`}>
                {change.increase ? '+' : '-'}{Math.abs(change.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
