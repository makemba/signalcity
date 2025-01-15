import { Facebook, Github, Linkedin, Twitter, Copyright } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400">
              Report Helper Hub vous aide à signaler et suivre les incidents dans votre communauté.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signaler" className="text-gray-400 hover:text-white transition-colors">
                  Signaler un incident
                </Link>
              </li>
              <li>
                <Link to="/analyse-sonore" className="text-gray-400 hover:text-white transition-colors">
                  Analyse sonore
                </Link>
              </li>
              <li>
                <Link to="/urgence" className="text-gray-400 hover:text-white transition-colors">
                  Contact d'urgence
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@reporthelper.hub</li>
              <li>Tél: +33 (0)1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center text-gray-400">
            <Copyright className="h-4 w-4 mr-2" />
            <span>{new Date().getFullYear()} Report Helper Hub. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;