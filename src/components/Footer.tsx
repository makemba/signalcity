
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import Logo from "./Logo";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8 w-full mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo isFooter={true} />
            <p className="text-gray-300 text-sm">
              La plateforme officielle de signalement des incidents pour le Congo-Brazzaville.
              Ensemble pour une communauté plus sûre et mieux informée.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/signaler" className="text-gray-300 hover:text-white transition-colors">Signaler un incident</Link></li>
              <li><Link to="/noise-analysis" className="text-gray-300 hover:text-white transition-colors">Analyse sonore</Link></li>
              <li><Link to="/statistics" className="text-gray-300 hover:text-white transition-colors">Statistiques</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Partenaires</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Ministère de l'Intérieur</li>
              <li className="text-gray-300">Police Nationale</li>
              <li className="text-gray-300">Services Municipaux</li>
              <li className="text-gray-300">Congo Télécom</li>
              <li className="text-gray-300">Agence Nationale de Sécurité</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic space-y-2 text-gray-300">
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Avenue de l'Indépendance, Brazzaville</span>
              </p>
              <p className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                <span>+242 06 123 4567</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@reporthelper.cg</span>
              </p>
              <p className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span>www.reporthelper.cg</span>
              </p>
            </address>
          </div>
        </div>
        
        <Separator className="my-6 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Report Helper Hub. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
