import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée après le chargement du composant
    setIsVisible(true);
  }, []);

  return (
    <header className={`flex flex-col items-center justify-center py-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-4xl font-bold mb-8 text-center text-white">TP1 - Dahmani Mohammed</h1>
      
      <div className="flex justify-center items-center space-x-12">
        <a 
          href="https://fr.wikipedia.org/wiki/TypeScript" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
            className="h-24 w-24 object-contain"
            alt="Logo TypeScript"
          />
        </a>
        <a 
          href="https://fr.wikipedia.org/wiki/React_(biblioth%C3%A8que_JavaScript)" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            className="h-24 w-24 object-contain animate-spin-slow"
            alt="Logo React"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
