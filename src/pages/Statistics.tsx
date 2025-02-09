
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: incidents = [], isLoading: isLoadingIncidents } = useQuery({
    queryKey: ["incidents-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Incident[];
    },
  });

  const { data: feedback = [], isLoading: isLoadingFeedback } = useQuery({
    queryKey: ["feedback-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingIncidents || isLoadingFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <TrendAnalysis incidents={incidents} />
          </Card>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <HotspotPredictor incidents={incidents} />
          <ResolutionTimeAnalyzer incidents={incidents} />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <PriorityCalculator incidents={incidents} />
          <SatisfactionAnalyzer feedback={feedback} />
        </motion.div>
      </motion.div>
    </div>
  );
}
