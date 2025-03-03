
import IncidentForm from "@/components/IncidentForm";
import { AlertTriangle, Clock, MapPin, Shield, Volume2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import ChatWidget from "@/components/ChatWidget";
import { motion } from "framer-motion";

export default function ReportIncident() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section avec animation */}
      <section className="relative py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
        </div>
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-600/20 blur-3xl rounded-full -mr-20 -mb-20" />
        <div className="absolute left-0 top-0 w-60 h-60 bg-blue-400/20 blur-3xl rounded-full -ml-10 -mt-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Logo />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-4 drop-shadow-md"
          >
            Signaler un incident
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Aidez-nous à améliorer votre quartier en signalant rapidement tout problème
          </motion.p>
        </div>
      </section>

      {/* Section des catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="shadow-xl border-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Catégories d'incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryFilter />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features Section avec animation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
            <motion.div variants={item}>
              <Feature
                icon={Clock}
                title="Rapide et simple"
                description="Signalez un incident en quelques clics"
                color="text-green-500"
                bgColor="bg-green-50"
                borderColor="border-green-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <Feature
                icon={MapPin}
                title="Géolocalisation"
                description="Localisation automatique précise"
                color="text-blue-500"
                bgColor="bg-blue-50"
                borderColor="border-blue-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <Feature
                icon={Shield}
                title="Suivi efficace"
                description="Traitement prioritaire par nos équipes"
                color="text-purple-500"
                bgColor="bg-purple-50"
                borderColor="border-purple-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <Feature
                icon={Volume2}
                title="Analyse sonore"
                description="Mesure automatique des décibels"
                color="text-red-500"
                bgColor="bg-red-50"
                borderColor="border-red-100"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Form Section avec animations */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <Card className="shadow-xl border-none bg-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-blue-600/20 blur-3xl rounded-full" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Formulaire de signalement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Instructions */}
            <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Comment signaler un incident ?
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  Activez la géolocalisation ou saisissez l'adresse
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Sélectionnez la catégorie qui correspond le mieux
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  Décrivez le problème rencontré
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  Ajoutez une photo si possible
                </motion.li>
              </ol>
            </div>

            {/* Alert for important information */}
            <Alert variant="destructive" className="mb-8 bg-red-50 border border-red-200 text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 font-semibold">Information importante</AlertTitle>
              <AlertDescription className="text-red-700">
                En cas d'urgence, contactez directement les services d'urgence appropriés
                (15, 17, 18, 112).
              </AlertDescription>
            </Alert>

            <IncidentForm />
          </CardContent>
        </Card>
      </motion.div>

      <ChatWidget />
      
      <Footer />
    </div>
  );
}

// Feature component with animation
function Feature({ 
  icon: Icon, 
  title, 
  description,
  color,
  bgColor,
  borderColor
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border ${borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className={`p-3 ${bgColor} rounded-full mb-4 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
