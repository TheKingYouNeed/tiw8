import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <div className="logo-container">
        <a href="https://fr.wikipedia.org/wiki/TypeScript" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
            className="logo"
            alt="Logo TypeScript"
            style={{ height: '100px' }}
          />
        </a>
        <a href="https://fr.wikipedia.org/wiki/React_(biblioth%C3%A8que_JavaScript)" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            className="logo react"
            alt="Logo React"
            style={{ height: '100px' }}
          />
        </a>
      </div>
        
      <h1 className="title">TP1 - Dahmani Mohammed</h1>
        
      <div className="card">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Nombre de clics : {count}
        </button>
        <p className="mt-4 text-gray-300">
          Modifiez <code className="bg-gray-800 px-2 py-1 rounded text-white">src/App.tsx</code> puis enregistrez pour voir les changements en temps réel (HMR).
        </p>
      </div>
        
      <p className="read-the-docs">
        Cliquez sur les logos pour en savoir plus sur TypeScript et React.
      </p>
        
      <div className="project-info">
        <h2>À propos du projet</h2>
        <p>
          Ce projet a été développé dans le cadre du module TIW8. Il illustre l'utilisation d'un front-end React avec un back-end Node/Express, en TypeScript.
        </p>
        <ul className="feature-list">
          <li>⚡ Utilise Vite pour un développement ultra-rapide</li>
          <li>⚛️ React pour une interface réactive</li>
          <li>🧑‍💻 Auteur : Dahmani Mohammed</li>
        </ul>
      </div>
    </div>
  )
}

export default App
