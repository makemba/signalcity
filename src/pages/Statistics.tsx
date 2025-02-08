import { Card } from "@/components/ui/card";
import StatsSummary from "@/components/StatsSummary";
import IncidentTrends from "@/components/IncidentTrends";
import CategoryFilter from "@/components/CategoryFilter";
import AdvancedFilters from "@/components/AdvancedFilters";
import TrendAnalysis from "@/components/TrendAnalysis";
import HotspotPredictor from "@/components/HotspotPredictor";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import PriorityCalculator from "@/components/PriorityCalculator";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import { Incident } from "@/types/incident";
import { motion } from "framer-motion";

const mockIncidents: Incident[] = [
  {
    id: 1,
    categoryId: "pothole",
    date: "2024-02-20",
    status: "RESOLVED",
    resolvedDate: "2024-02-22",
    location: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 2,
    categoryId: "lighting",
    date: "2024-02-19",
    status: "IN_PROGRESS",
    location: { lat: 48.8576, lng: 2.3532 }
  },
  {
    id: 3,
    categoryId: "garbage",
    date: "2024-02-18",
    status: "PENDING",
    location: { lat: 48.8586, lng: 2.3542 }
  }
];

const mockFeedback = [
  { incidentId: 1, rating: 4, date: "2024-02-20" },
  { incidentId: 2, rating: 5, date: "2024-02-19" },
  { incidentId: 3, rating: 3, date: "2024-02-18" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Statistics() {
  console.log("Statistics page rendered");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
          variants={itemVariants}
        >
          Statistiques et Analyses
        </motion.h1>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <StatsSummary />
          <IncidentTrends />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          <Card className="p-4 hover:shadow-lg transition-all duration-300">
            <CategoryFilter />
            <AdvancedFilters />
          </Card>
          <Card className="p-4 lg:col-span-2 hover:shadow-lg transition-all duration-300">
            <TrendAnalysis incidents={mockIncidents} />
          </Card>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <HotspotPredictor incidents={mockIncidents} />
          <ResolutionTimeAnalyzer incidents={mockIncidents} />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <PriorityCalculator incidents={mockIncidents} />
          <SatisfactionAnalyzer feedback={mockFeedback} />
        </motion.div>
      </motion.div>
    </div>
  );
}
