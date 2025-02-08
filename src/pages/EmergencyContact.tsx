
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Shield, Heart, FirstAid, Siren, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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

export default function EmergencyContact() {
  const emergencyNumbers = [
    { 
      name: "Police Secours", 
      number: "17", 
      icon: Shield,
      description: "Pour toute situation nécessitant l'intervention immédiate de la police"
    },
    { 
      name: "SAMU", 
      number: "15", 
      icon: Heart,
      description: "Pour toute urgence médicale"
    },
    { 
      name: "Pompiers", 
      number: "18", 
      icon: FirstAid,
      description: "Pour les incendies, accidents et situations de danger"
    },
    { 
      name: "Numéro d'urgence européen", 
      number: "112", 
      icon: Phone,
      description: "Numéro unique d'urgence européen, disponible gratuitement partout dans l'UE"
    },
  ];

  const additionalServices = [
    {
      name: "Violence conjugale",
      number: "3919",
      description: "Écoute, information et orientation pour les femmes victimes de violences",
      available: "7j/7, 24h/24"
    },
    {
      name: "Protection des enfants en danger",
      number: "119",
      description: "Pour signaler des situations d'enfants en danger ou en risque de danger",
      available: "7j/7, 24h/24"
    },
    {
      name: "Urgences sociales",
      number: "115",
      description: "Pour toute personne sans abri ou en difficulté sociale",
      available: "7j/7, 24h/24"
    }
  ];

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-2">En cas d'urgence immédiate</h2>
              <p className="text-red-600">
                Si vous êtes en danger immédiat ou si vous êtes témoin d'une situation d'urgence, 
                contactez directement les services d'urgence. Ne perdez pas de temps.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          variants={containerVariants}
        >
          {emergencyNumbers.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.number} variants={itemVariants}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <p className="text-2xl font-bold text-primary mt-1">{service.number}</p>
                      <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `tel:${service.number}`}
                      className="flex-shrink-0"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mt-8 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="text-xl font-semibold">Autres services d'assistance</h3>
            </div>
            <div className="space-y-6">
              {additionalServices.map((service) => (
                <div key={service.number} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-lg">{service.name}</h4>
                      <p className="text-xl font-semibold text-primary mt-1">{service.number}</p>
                      <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Disponible : {service.available}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = `tel:${service.number}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-blue-50">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-700">Points d'accueil d'urgence</h3>
                <p className="text-sm text-blue-600 mt-2">
                  En plus des numéros d'urgence, vous pouvez vous rendre directement aux services d'urgence 
                  des hôpitaux les plus proches ou aux commissariats de police.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
