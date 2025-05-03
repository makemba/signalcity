
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Facebook, Twitter, Instagram, Globe } from "lucide-react";
import Logo from "./Logo";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12 w-full mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo isFooter={true} />
            <p className="text-gray-300 text-sm leading-relaxed">
              La plateforme officielle de signalement des incidents pour le Congo-Brazzaville.
              Ensemble pour une communauté plus sûre et mieux informée.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors p-2 bg-gray-700 rounded-full">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors p-2 bg-gray-700 rounded-full">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors p-2 bg-gray-700 rounded-full">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-blue-400 mr-0 group-hover:mr-2"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/signaler" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-blue-400 mr-0 group-hover:mr-2"></span>
                  Signaler un incident
                </Link>
              </li>
              <li>
                <Link to="/noise-analysis" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-blue-400 mr-0 group-hover:mr-2"></span>
                  Analyse sonore
                </Link>
              </li>
              <li>
                <Link to="/statistics" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-blue-400 mr-0 group-hover:mr-2"></span>
                  Statistiques
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-0 group-hover:w-2 transition-all duration-300 h-[2px] bg-blue-400 mr-0 group-hover:mr-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Partenaires</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
                Ministère de l'Intérieur
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
                Police Nationale
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
                Services Municipaux
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
                Congo Télécom
              </li>
              <li className="text-gray-300 flex items-center">
                <span className="w-1 h-1 rounded-full bg-blue-400 mr-2"></span>
                Agence Nationale de Sécurité
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
            <address className="not-italic space-y-3 text-gray-300">
              <p className="flex items-center group">
                <div className="p-2 bg-gray-700 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>123 Avenue de l'Indépendance, Brazzaville</span>
              </p>
              <p className="flex items-center group">
                <div className="p-2 bg-gray-700 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <span>+242 06 123 4567</span>
              </p>
              <p className="flex items-center group">
                <div className="p-2 bg-gray-700 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contact@reporthelper.cg</span>
              </p>
              <p className="flex items-center group">
                <div className="p-2 bg-gray-700 rounded-full mr-3 group-hover:bg-blue-600 transition-colors">
                  <Globe className="h-4 w-4" />
                </div>
                <span>www.reporthelper.cg</span>
              </p>
            </address>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Report Helper Hub. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
