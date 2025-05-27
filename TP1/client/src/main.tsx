import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
