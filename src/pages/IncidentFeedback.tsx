
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DashboardShell } from '@/components/DashboardShell';
import { Feedback } from '@/types/incident';

export default function IncidentFeedback() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [incidentDetails, setIncidentDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Évaluation de l\'incident | Incident Signal';
    
    const fetchIncidentDetails = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setIncidentDetails(data);
      } catch (error) {
        console.error('Error fetching incident:', error);
        toast.error('Impossible de charger les détails de l\'incident');
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncidentDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.warning('Veuillez attribuer une note');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const feedbackData: Omit<Feedback, 'id'> = {
        incidentId: Number(id),
        rating,
        comment: comment.trim() || undefined,
        date: new Date().toISOString(),
        userId: user?.id,
        resolved: true
      };
      
      const { error } = await supabase
        .from('incident_feedback')
        .insert(feedbackData);
        
      if (error) throw error;
      
      toast.success('Votre évaluation a été enregistrée');
      
      // Update incident status if needed
      if (incidentDetails && incidentDetails.status !== 'RESOLVED') {
        await supabase
          .from('incidents')
          .update({ status: 'RESOLVED', resolved_date: new Date().toISOString() })
          .eq('id', id);
      }
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Évaluer la résolution de l'incident
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center">
                  <div className="inline-block animate-spin mr-2">
                    <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p>Chargement...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {incidentDetails && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Incident #{incidentDetails.id}</h3>
                      <p className="text-sm text-gray-700">{incidentDetails.description || 'Pas de description'}</p>
                      <p className="text-xs text-gray-500 mt-2">Signalé le {new Date(incidentDetails.created_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-medium mb-4">Comment évaluez-vous la résolution de cet incident ?</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.button
                          key={value}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          className="focus:outline-none"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHoveredRating(value)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            size={32}
                            className={
                              (hoveredRating ? value <= hoveredRating : value <= rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        </motion.button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {rating === 1 && 'Très insatisfait'}
                      {rating === 2 && 'Insatisfait'}
                      {rating === 3 && 'Neutre'}
                      {rating === 4 && 'Satisfait'}
                      {rating === 5 && 'Très satisfait'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Commentaires (facultatif)</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Partagez votre expérience concernant la résolution de cet incident..."
                      className="h-32 resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || rating === 0}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer mon évaluation
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
