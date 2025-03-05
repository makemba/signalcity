
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoiseAnalyzer from "@/components/NoiseAnalyzer";
import NoiseHistory from "@/components/NoiseHistory";
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet,
  Share2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdvancedNoiseAnalysis() {
  const [activeTab, setActiveTab] = useState("live");
  
  const handleExportData = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch('/api/noise-data');
      const data = await response.json();
      
      let content = '';
      let filename = '';
      
      if (format === 'csv') {
        content = 'Date,Niveau (dB),Type,Localisation\n';
        data.forEach((item: any) => {
          content += `${item.date},${item.level},${item.type},${item.location}\n`;
        });
        filename = 'analyse-sonore.csv';
      } else {
        content = JSON.stringify(data, null, 2);
        filename = 'analyse-sonore.json';
      }
      
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Données exportées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Analyse Sonore Avancée
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData('csv')}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData('json')}
          >
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.share({
                title: 'Analyse Sonore',
                text: 'Consultez mes mesures sonores',
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Lien copié dans le presse-papier');
              });
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Analyse en direct
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          <Card className="p-6">
            <NoiseAnalyzer onNoiseLevel={(level) => console.log('Niveau:', level)} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="p-6">
            <NoiseHistory />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
