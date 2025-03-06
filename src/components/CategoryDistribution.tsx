
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { FileBarChart, Loader2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const CategoryDistribution = () => {
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['category-distribution'],
    queryFn: async () => {
      const { data: incidents, error: incidentsError } = await supabase
        .from('incidents')
        .select('category_id');

      if (incidentsError) throw incidentsError;

      // Count occurrences of each category
      const categoryCounts: Record<string, number> = {};
      incidents.forEach(incident => {
        const category = incident.category_id || 'non-classifié';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      // Transform into array for chart
      return Object.entries(categoryCounts).map(([name, value]) => ({ 
        name, 
        value,
        // Get readable category name
        label: name === 'non-classifié' ? 'Non classifié' : 
          name === 'noise' ? 'Nuisance sonore' :
          name === 'environment' ? 'Environnement' :
          name === 'security' ? 'Sécurité' :
          name === 'infrastructure' ? 'Infrastructure' :
          name === 'health' ? 'Santé' :
          name === 'other' ? 'Autre' : name
      }));
    },
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques par catégorie",
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger la distribution par catégorie",
          variant: "destructive",
        });
      }
    }
  });

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileBarChart className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Distribution par catégorie</h3>
      </div>
      
      {!categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 min-h-[200px]">
          <p>Aucune donnée disponible pour l'analyse par catégorie</p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} incidents`, 'Nombre']} />
              <Legend formatter={(value) => {
                const category = categories.find(cat => cat.name === value);
                return category?.label || value;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default CategoryDistribution;
