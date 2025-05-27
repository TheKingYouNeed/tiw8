import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const [hoverLink, setHoverLink] = useState<string | null>(null);

  useEffect(() => {
    // Animation d'entrée avec délai pour le footer
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer 
      className={`mt-16 p-6 bg-gray-800 text-white text-center rounded-t-xl shadow-lg transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Contact</h3>
            <p className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
              <a href="mailto:dahmani.mohammed@example.com" className="hover:underline">
                dahmani.mohammed@example.com
              </a>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Liens</h3>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transform transition-all duration-300 ${hoverLink === 'github' ? 'text-primary-400 scale-110' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverLink('github')}
                onMouseLeave={() => setHoverLink(null)}
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transform transition-all duration-300 ${hoverLink === 'linkedin' ? 'text-primary-400 scale-110' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverLink('linkedin')}
                onMouseLeave={() => setHoverLink(null)}
              >
                LinkedIn
              </a>
              <a 
                href="#" 
                className={`transform transition-all duration-300 ${hoverLink === 'portfolio' ? 'text-primary-400 scale-110' : 'text-gray-300'}`}
                onMouseEnter={() => setHoverLink('portfolio')}
                onMouseLeave={() => setHoverLink(null)}
              >
                Portfolio
              </a>
            </div>
          </div>
          
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Technologies</h3>
            <p className="text-sm text-gray-300">React • TypeScript • Tailwind CSS • Express</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm">© {currentYear} - Dahmani Mohammed - TP1 TIW8</p>
          <p className="text-xs mt-2 text-gray-400">Développé avec React et TypeScript</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
