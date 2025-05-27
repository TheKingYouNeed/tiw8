import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
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
        
      <h1>TP1 - Dahmani Mohammed</h1>
        
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Nombre de clics : {count}
        </button>
        <p>
          Modifiez <code>src/App.tsx</code> puis enregistrez pour voir les changements en temps réel (HMR).
        </p>
      </div>
        
      <p className="read-the-docs">
        Cliquez sur les logos pour en savoir plus sur TypeScript et React.
      </p>
        
      <div className="project-info">
        <h2>À propos du projet</h2>
        <p>
          Ce projet a été développé dans le cadre du module TIW8. Il illustre l'utilisation d’un front-end React avec un back-end Node/Express, en TypeScript.
        </p>
        <ul>
          <li>⚡ Utilise Vite pour un développement ultra-rapide</li>
          <li>⚛️ React pour une interface réactive</li>
          <li>🧑‍💻 Auteur : Dahmani Mohammed</li>
        </ul>
        <img
          src="https://miro.medium.com/v2/resize:fit:1200/format:webp/1*_Z_7FeXzTljBN4m5fOljZg.png"
          alt="Aperçu d'une application React"
          style={{ width: '100%', borderRadius: '10px', marginTop: '1rem' }}
        />
      </div>

    </>
  )
}

export default App
