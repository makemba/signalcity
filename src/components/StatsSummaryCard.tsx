
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
          <Icon className="w-full h-full" />
        </div>
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${bgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{label}</p>
            <div className="flex items-baseline gap-2">
              <motion.p 
                className="text-2xl font-bold"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {value}
              </motion.p>
              {change && (
                <motion.span 
                  className={`text-sm ${change.increase ? 'text-green-500' : 'text-red-500'}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {change.increase ? '+' : '-'}{Math.abs(change.value)}%
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
