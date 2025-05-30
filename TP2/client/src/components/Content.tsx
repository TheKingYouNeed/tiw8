import React, { useState, useEffect } from 'react';

const Content: React.FC = () => {
  const [count, setCount] = useState(0);
  const [animateButton, setAnimateButton] = useState(false);
  const [animateSections, setAnimateSections] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Animation d'entrée décalée pour les sections
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateSections(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Animation du bouton lors du clic
  const handleClick = () => {
    setAnimateButton(true);
    setCount((count) => count + 1);
    setTimeout(() => setAnimateButton(false), 300);
  };

  return (
    <main className="flex flex-col items-center max-w-4xl mx-auto px-4 py-6">
      <div 
        className={`card bg-gray-800 rounded-xl shadow-xl p-8 w-full mb-10 transform transition-all duration-500 ${animateSections ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <button 
          onClick={handleClick}
          className={`px-6 py-3 bg-primary-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-primary-700 transition-all ${animateButton ? 'scale-95 bg-primary-700' : 'scale-100'}`}
        >
          Nombre de clics : {count}
        </button>
        <p className="mt-4 text-gray-300">
          Modifiez <code className="bg-gray-700 px-1 py-0.5 rounded">src/components/Content.tsx</code> puis enregistrez pour voir les changements en temps réel (HMR).
        </p>
      </div>
      
      <p className="read-the-docs mt-4 text-center text-gray-400 italic">
        Cliquez sur les logos pour en savoir plus sur TypeScript et React.
      </p>
      
      <div 
        className={`project-info mt-8 w-full bg-gray-800 rounded-xl shadow-xl p-8 transform transition-all duration-700 delay-300 ${animateSections ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <h2 className="text-2xl font-bold text-white mb-4">À propos du projet</h2>
        <p className="text-gray-300 leading-relaxed">
          Ce projet a été développé dans le cadre du module TIW8. Il illustre l'utilisation d'un front-end React avec un back-end Node/Express, en TypeScript.
        </p>
        <ul className="my-6 space-y-2">
          <li className="flex items-center text-gray-300 hover:text-primary-400 transition-colors">
            <span className="mr-2 text-xl">⚡</span> Utilise Vite pour un développement ultra-rapide
          </li>
          <li className="flex items-center text-gray-300 hover:text-primary-400 transition-colors">
            <span className="mr-2 text-xl">⚛️</span> React pour une interface réactive
          </li>
          <li className="flex items-center text-gray-300 hover:text-primary-400 transition-colors">
            <span className="mr-2 text-xl">🧑‍💻</span> Auteur : Dahmani Mohammed
          </li>
        </ul>
        <div 
          className="relative overflow-hidden rounded-lg mt-6 group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src="https://miro.medium.com/v2/resize:fit:1200/format:webp/1*_Z_7FeXzTljBN4m5fOljZg.png"
            alt="Aperçu d'une application React"
            className={`w-full rounded-lg transition-transform duration-700 ${isHovering ? 'scale-105' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white p-4">Interface React moderne avec TypeScript</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Content;
