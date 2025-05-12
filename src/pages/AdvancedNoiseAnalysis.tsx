
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
import { useTranslation } from 'react-i18next';

export default function AdvancedNoiseAnalysis() {
  const [activeTab, setActiveTab] = useState("live");
  const { t } = useTranslation();
  
  // Sample noise history data
  const noiseHistoryData = [
    { date: "Lun", level: 45 },
    { date: "Mar", level: 52 },
    { date: "Mer", level: 49 },
    { date: "Jeu", level: 63 },
    { date: "Ven", level: 58 },
    { date: "Sam", level: 72 },
    { date: "Dim", level: 47 },
  ];
  
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
      
      toast.success(t('export.success'));
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error(t('export.error'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          {t('noiseAnalysis.advanced.title')}
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
                title: t('noiseAnalysis.shareTitle'),
                text: t('noiseAnalysis.shareText'),
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success(t('share.linkCopied'));
              });
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t('common.share')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t('noiseAnalysis.liveTab')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('noiseAnalysis.historyTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          <Card className="p-6">
            <NoiseAnalyzer onNoiseLevel={(level) => console.log('Niveau:', level)} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="p-6">
            <NoiseHistory data={noiseHistoryData} title={t('noiseAnalysis.historyTitle')} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
