
import { Facebook, Twitter, Linkedin, Link, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialShareButtonsProps {
  incidentId: number;
  incidentTitle?: string;
  className?: string;
  compact?: boolean;
}

export default function SocialShareButtons({ incidentId, incidentTitle, className, compact = false }: SocialShareButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/tickets/${incidentId}`;
  const title = incidentTitle || `Incident #${incidentId}`;
  const text = `Consultez cet incident: ${title}`;
  
  const shareData = {
    title: 'Incident Signal',
    text,
    url
  };
  
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Succès",
          description: "Contenu partagé avec succès",
        });
      } else {
        setIsExpanded(!isExpanded);
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      setIsExpanded(!isExpanded);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
      setTimeout(() => setIsExpanded(false), 500);
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    });
  };
  
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setTimeout(() => setIsExpanded(false), 500);
  };
  
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setTimeout(() => setIsExpanded(false), 500);
  };
  
  const shareLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    setTimeout(() => setIsExpanded(false), 500);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={handleNativeShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 right-0 mt-2 bg-white shadow-lg rounded-lg p-2 flex space-x-1"
            >
              <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-50 text-blue-500 hover:bg-blue-100" onClick={shareFacebook}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-sky-50 text-sky-500 hover:bg-sky-100" onClick={shareTwitter}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={shareLinkedin}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={copyToClipboard}>
                <Link className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium">Partager cet incident</p>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-blue-50 text-blue-500 hover:bg-blue-100" onClick={shareFacebook}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          <Button variant="outline" className="bg-sky-50 text-sky-500 hover:bg-sky-100" onClick={shareTwitter}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={shareLinkedin}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button variant="outline" onClick={copyToClipboard}>
            <Link className="h-4 w-4 mr-2" />
            Copier
          </Button>
        </div>
      </div>
    </div>
  );
}
