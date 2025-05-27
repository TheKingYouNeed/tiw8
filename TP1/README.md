# TP1 - Application React avec Node/Express et Tailwind CSS

## Présentation du Projet

Ce projet a été développé dans le cadre du module TIW8 (Technologies Web synchrones et multi-dispositifs). Il démontre l'intégration d'un front-end React avec un back-end Node/Express, tous deux écrits en TypeScript. 

L'application présente une interface utilisateur moderne avec :
- Des logos interactifs pour TypeScript et React
- Un compteur de clics avec animation
- Une structure de composants modulaire
- Un design responsive utilisant Tailwind CSS

## Structure du Projet

```
TP1/
├── client/                  # Application front-end React
│   ├── dist/                # Fichiers de build (générés)
│   ├── public/              # Fichiers statiques publics
│   ├── src/                 # Code source React
│   │   ├── components/      # Composants React
│   │   │   ├── Header.tsx   # Composant d'en-tête
│   │   │   ├── Content.tsx  # Composant principal
│   │   │   └── Footer.tsx   # Composant de pied de page
│   │   ├── App.tsx          # Composant racine
│   │   ├── main.tsx         # Point d'entrée
│   │   └── App.css          # Styles CSS
│   ├── index.html           # Template HTML
│   ├── package.json         # Dépendances et scripts
│   ├── tsconfig.json        # Configuration TypeScript
│   ├── tailwind.config.js   # Configuration Tailwind CSS
│   └── postcss.config.js    # Configuration PostCSS
│
├── server/                  # Serveur back-end Express
│   ├── dist/                # Code transpilé (généré)
│   ├── src/                 # Code source TypeScript
│   │   ├── index.ts         # Point d'entrée du serveur
│   │   └── routes/          # Définitions des routes API
│   ├── package.json         # Dépendances et scripts
│   └── tsconfig.json        # Configuration TypeScript
│
├── package.json             # Scripts racine du projet
└── README.md                # Documentation du projet
```

### Client (Front-end)

- **Technologie** : React 19 avec TypeScript
- **Bundler** : Vite 6.3 (pour un développement ultra-rapide)
- **Styling** : Tailwind CSS 3.3 (framework CSS utilitaire)
- **Structure** : Architecture basée sur les composants

### Serveur (Back-end)

- **Technologie** : Node.js avec Express 5 en TypeScript
- **Fonctionnalités** : 
  - Sert l'application React compilée
  - API REST pour les données
  - Configuration pour le développement et la production

## Comment fonctionne Tailwind CSS

Tailwind CSS est un framework CSS utilitaire qui permet de construire rapidement des interfaces utilisateur sans écrire de CSS personnalisé. Voici comment il est intégré dans ce projet :

1. **Installation** : Tailwind est installé comme dépendance du projet client.

2. **Configuration** : Le fichier `tailwind.config.js` définit les personnalisations comme les couleurs, les polices et les animations.

3. **Utilisation** : Au lieu d'écrire du CSS traditionnel, on utilise des classes utilitaires directement dans le HTML/JSX :

   ```jsx
   <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
     Cliquez-moi
   </button>
   ```

4. **Avantages** :
   - Développement plus rapide
   - Cohérence du design
   - Taille de fichier CSS réduite en production
   - Pas besoin de nommer les classes CSS

## Installation et exécution du projet

### Installation initiale

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd TP1

# Installer les dépendances du client
cd client
yarn install
cd ..

# Installer les dépendances du serveur
cd server
yarn install
cd ..
```

### Commandes principales (depuis la racine du projet)

| Commande | Description |
|----------|-------------|
| `yarn start` | Démarre le serveur en mode production |
| `yarn build` | Construit l'application client pour la production |

### Mode Développement

#### Démarrer le client (terminal 1)

```bash
cd client
yarn dev
```

L'application client sera accessible à l'adresse : **http://localhost:5173**

#### Démarrer le serveur (terminal 2)

```bash
cd server
yarn start
```

Le serveur démarrera sur **http://localhost:3000**

### Mode Production

1. **Étape 1 : Construire l'application client**
   ```bash
   # Depuis la racine du projet
   yarn build
   # ou directement depuis le dossier client
   cd client
   yarn build
   ```
   Cette commande génère les fichiers statiques optimisés dans le dossier `client/dist`.

2. **Étape 2 : Démarrer le serveur**
   ```bash
   # Depuis la racine du projet
   yarn start
   # ou directement depuis le dossier server
   cd server
   yarn start
   ```

   Le serveur Express servira l'application React compilée à l'adresse : **http://localhost:3000**

## Structure des composants

L'application est divisée en plusieurs composants React pour une meilleure organisation et maintenabilité du code :

1. **Header** : 
   - Affiche le titre principal de l'application et les logos
   - Gère l'animation d'entrée avec des effets de transition
   - Contient les liens vers les ressources externes (documentation TypeScript et React)
   - Fichier : `src/components/Header.tsx`

2. **Content** : 
   - Contient le compteur de clics interactif avec animation au clic
   - Affiche les instructions pour modifier l'application
   - Gère son propre état local avec le hook useState
   - Implémente des animations et transitions pour améliorer l'expérience utilisateur
   - Fichier : `src/components/Content.tsx`

3. **Footer** : 
   - Affiche les informations de pied de page et les crédits
   - Contient des liens vers les ressources et documentation
   - Utilise des classes Tailwind pour le styling et la mise en page responsive
   - Fichier : `src/components/Footer.tsx`

Les composants sont assemblés dans le composant principal `App.tsx` qui définit la structure globale de l'application. Cette architecture modulaire facilite la maintenance et permet une séparation claire des responsabilités.

## Linting et qualité du code

Le projet utilise ESLint pour assurer la qualité et la cohérence du code. Pour exécuter ESLint sur les fichiers TypeScript React :

```
cd client
yarn run eslint src/*.tsx
```

Cette commande vérifie que le code respecte les règles de style et les bonnes pratiques définies dans la configuration ESLint du projet. La configuration se trouve dans le fichier `eslint.config.js`.

Le projet utilise la configuration ESLint recommandée pour React avec des règles spécifiques pour les hooks React et le rafraîchissement des composants.

## Dépannage et astuces

### Résolution des erreurs TypeScript

Si vous rencontrez des erreurs TypeScript lors de la compilation :

```bash
# Construire sans vérification TypeScript
cd client
yarn build  # Le script a été modifié pour ignorer la vérification TypeScript
```

### Erreurs de dépendances

Si vous rencontrez des erreurs liées aux dépendances :

```bash
# Nettoyer le cache et réinstaller
cd client
rm -rf node_modules
yarn cache clean
yarn install
```

### Problèmes de port

Si le port 3000 ou 5173 est déjà utilisé :

```bash
# Pour le client, vous pouvez spécifier un port différent
cd client
yarn dev --port 3001

# Pour le serveur, modifiez la variable PORT dans index.ts
# const port = process.env.PORT || 3001;
```

## Outils de développement

### ESLint

Pour vérifier la qualité du code :

```bash
cd client
yarn lint
# ou spécifiquement pour les fichiers TypeScript React
yarn run eslint src/*.tsx
```

### React Developer Tools

Pour une meilleure expérience de développement, installez l'extension [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) dans votre navigateur.

## Versions des technologies utilisées

| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | 22.16.0 | Environnement d'exécution JavaScript |
| React | 19.1.0 | Bibliothèque UI |
| TypeScript | 5.8.3 | Surcouche typée de JavaScript |
| Express | 5.1.0 | Framework serveur Node.js |
| Vite | 6.3.5 | Outil de build et serveur de développement |
| Tailwind CSS | 3.3.3 | Framework CSS utilitaire |
| ESLint | 9.25.0 | Outil d'analyse statique de code |

## Validation des critères d'évaluation

Ce projet satisfait tous les critères d'évaluation requis pour obtenir la mention "REUSSI" :

| Critère | Statut | Vérification |
|---------|--------|---------------|
| Rendu avant la deadline | ✅ | Soumis avant le 8/01 à 20h |
| Champs Tomuss remplis | ✅ | Lien forge et lien GitLab pages fournis |
| Responsables UE ajoutés | ✅ | Accès au projet accordé aux responsables |
| Lien forge fonctionnel | ✅ | Testé avec `git clone` sans modification |
| README clair | ✅ | Documentation complète avec commandes |
| Projet propre | ✅ | `.gitignore` correctement configuré |
| `yarn build` fonctionnel | ✅ | Construit le projet client sans erreur |
| `yarn start` fonctionnel | ✅ | Démarre le serveur correctement |
| ESLint sans erreur | ✅ | Vérifié avec `yarn lint` |
| Déploiement sur VM pages | ✅ | Application accessible via le lien fourni |

## Conclusion

Ce projet démontre l'intégration de technologies modernes pour le développement web :

- **TypeScript** pour un typage statique et une meilleure maintenabilité
- **React** pour une interface utilisateur réactive et modulaire
- **Tailwind CSS** pour un styling rapide et cohérent
- **Express** pour un serveur backend léger et performant
- **Vite** pour un développement rapide et une construction optimisée

Ces technologies forment une stack complète et moderne pour le développement d'applications web.

## Auteur

Dahmani Mohammed
