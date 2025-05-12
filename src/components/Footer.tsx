
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: t('footer.about'),
      links: [
        { label: t('footer.mission'), href: "/mission" },
        { label: t('footer.team'), href: "/equipe" },
        { label: t('footer.partners'), href: "/partenaires" },
        { label: t('footer.faq'), href: "/faq" }
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { label: t('footer.reports'), href: "/report-incident" },
        { label: t('noiseAnalysis'), href: "/noise-analysis" },
        { label: t('footer.statistics'), href: "/statistics" },
        { label: t('footer.emergencyContact'), href: "/emergency-contact" }
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.helpCenter'), href: "/support" },
        { label: t('footer.contact'), href: "/contact" },
        { label: t('footer.legalNotice'), href: "/mentions-legales" },
        { label: t('footer.privacy'), href: "/confidentialite" }
      ]
    }
  ];

  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const contactInfo = [
    { Icon: Mail, info: "contact@reporthelperhub.com" },
    { Icon: Phone, info: "+33 (0)1 23 45 67 89" },
    { Icon: MapPin, info: "123 Avenue de la République, 75011 Paris" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-950 text-white" role="contentinfo">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Logo isFooter size="md" className="mb-4" />
            <p className="text-blue-100 mt-4 max-w-md">
              Report Helper Hub est une plateforme dédiée à simplifier le processus de signalement 
              et d'analyse des incidents, offrant des solutions intelligentes pour améliorer 
              la sécurité et le bien-être communautaire.
            </p>
            <div className="flex space-x-4 mt-6" role="list" aria-label="Réseaux sociaux">
              {socialLinks.map(({ Icon, href, label }) => (
                <a 
                  key={label}
                  href={href}
                  aria-label={label}
                  className="bg-blue-800/40 p-2 rounded-full hover:bg-blue-700/60 transition-colors duration-200 group"
                  role="listitem"
                >
                  <Icon className="h-5 w-5 text-blue-200 group-hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title} role="navigation" aria-labelledby={`footer-heading-${column.title}`}>
              <h3 id={`footer-heading-${column.title}`} className="font-semibold text-lg mb-4 text-white">{column.title}</h3>
              <ul className="space-y-2" role="list">
                {column.links.map((link) => (
                  <li key={link.label} role="listitem">
                    <Link 
                      to={link.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center pt-6">
            <p className="text-blue-300 text-sm">
              © {currentYear} Report Helper Hub. {t('footer.allRightsReserved')}
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-x-8 gap-y-2 text-sm text-blue-300">
              <Link to="/mentions-legales" className="hover:text-white transition-colors duration-200">{t('footer.legalNotice')}</Link>
              <Link to="/confidentialite" className="hover:text-white transition-colors duration-200">{t('footer.privacy')}</Link>
              <Link to="/cookies" className="hover:text-white transition-colors duration-200">{t('footer.cookiesManagement')}</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" role="presentation" />
    </footer>
  );
};

export default Footer;
