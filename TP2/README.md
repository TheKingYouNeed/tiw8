# TP2 - Application Q&R Multi-Surface avec React et Node.js

## Objectif

Ce projet est une application web de questions-réponses multi-dispositifs développée avec React et TypeScript. L'application permet la gestion interactive d'événements et de questions en temps réel, avec une synchronisation complète entre différents dispositifs et la reconnaissance de gestes sur appareils mobiles.

## Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation

```bash
# Installation des dépendances du client
cd client
npm install

# Installation des dépendances du serveur
cd ../server
npm install
```

### Démarrage en mode développement

```bash
# Démarrer le serveur
cd server
yarn dev

# Dans un autre terminal, démarrer le client
cd client
yarn dev
```

### Démarrage sur réseau local

Pour accéder à l'application depuis d'autres appareils sur votre réseau local, utilisez le script fourni :

```bash
# À la racine du projet
./start-network.bat
```

Ce script affichera l'adresse IP de votre machine et les URLs pour accéder à l'application depuis d'autres appareils.

## Fonctionnalités principales

### 1. Gestion des événements

#### Affichage des événements
- Accédez à la liste des événements disponibles à l'adresse `/events`
- Chaque événement affiche son titre et sa description

#### Création d'événements
- Utilisez le formulaire pour créer un nouvel événement
- Renseignez un titre et une description pour l'événement

#### Comment tester :
- Ouvrez l'application et naviguez vers la page d'accueil
- Cliquez sur "Créer un nouvel événement"
- Remplissez le formulaire et soumettez-le
- Vérifiez que le nouvel événement apparaît dans la liste

### 2. Gestion des questions

#### Affichage des questions
- Sélectionnez un événement pour voir la liste de ses questions
- Chaque question affiche son titre, son contenu, son auteur et le nombre de votes

#### Création de questions
- Utilisez le formulaire pour ajouter une nouvelle question à un événement
- Renseignez votre nom, le titre et le contenu de la question

#### Vote sur les questions
- Cliquez sur le bouton "Upvote" pour voter pour une question
- Le nombre de votes est mis à jour en temps réel sur tous les appareils connectés

#### Comment tester :
- Sélectionnez un événement dans la liste
- Ajoutez une nouvelle question en remplissant le formulaire
- Cliquez sur une question pour voir ses détails
- Votez pour une question et observez l'augmentation du compteur

### 3. Navigation entre questions

#### Navigation par boutons
- Utilisez les boutons "Précédent" et "Suivant" pour naviguer entre les questions
- L'URL est mise à jour pour refléter la question actuelle

#### Navigation par gestes (sur mobile)
- Sur un appareil mobile, utilisez le canvas pour dessiner des gestes
- Faites un geste de gauche à droite pour passer à la question suivante
- Faites un geste de droite à gauche pour revenir à la question précédente

#### Comment tester :
- Ouvrez les détails d'une question
- Utilisez les boutons de navigation pour passer d'une question à l'autre
- **Pour tester la fonctionnalité de balayage** :
  - Connectez-vous à l'application depuis un téléphone mobile en utilisant l'URL réseau (ex: http://192.168.x.x:5173)
  - Accédez à un événement et ouvrez une question
  - Utilisez le canvas de gestes en bas de l'écran pour effectuer un balayage horizontal
  - Faites un geste de gauche à droite pour passer à la question suivante
  - Faites un geste de droite à gauche pour revenir à la question précédente

### 4. Mode administrateur

#### Accès au mode administrateur
- Accédez au mode administrateur via l'URL `/admin/event/:eventId`
- Le mode administrateur est indiqué par un badge bleu "Mode Administrateur"

#### Fonctionnalités administrateur
- Suppression de questions
- Options pour modifier ou mettre en avant des questions

#### Comment tester :
- Modifiez l'URL pour inclure `/admin/` avant `/event/:eventId`
- Vérifiez que le badge "Mode Administrateur" est affiché
- Testez les fonctionnalités de suppression de questions

### 5. Synchronisation multi-dispositifs

#### Mise à jour en temps réel
- Toutes les actions (création d'événements, ajout de questions, votes) sont synchronisées en temps réel
- Les modifications effectuées sur un appareil sont immédiatement visibles sur tous les autres appareils connectés

#### Comment tester :
- Ouvrez l'application sur deux appareils ou dans deux onglets différents
- Effectuez une action sur un appareil (ajout de question, vote, etc.)
- Vérifiez que la modification apparaît sur l'autre appareil sans rafraîchissement

### 6. Adaptation aux dispositifs mobiles

#### Interface responsive
- L'interface s'adapte automatiquement à la taille de l'écran
- Version mobile optimisée avec des contrôles adaptés aux écrans tactiles

#### Mode plein écran
- Sur mobile, un bouton permet de passer en mode plein écran
- Idéal pour les présentations ou l'utilisation sur tablette

#### Comment tester :
- Ouvrez l'application sur un appareil mobile ou redimensionnez la fenêtre du navigateur
- Vérifiez que l'interface s'adapte correctement
- Sur mobile, utilisez le bouton "Toggle Fullscreen" pour passer en mode plein écran

## Architecture technique

### Frontend
- React avec TypeScript
- Redux pour la gestion d'état
- Socket.IO pour la communication en temps réel
- OneDollar pour la reconnaissance de gestes
- Tailwind CSS pour le styling

### Backend
- Node.js avec Express
- Socket.IO pour la communication bidirectionnelle
- TypeScript pour la sécurité du typage

## Résolution des problèmes courants

### L'application ne fonctionne pas sur le réseau local
- Vérifiez que votre pare-feu autorise les connexions sur les ports 3000 et 5173
- Utilisez le script `start-network.bat` qui configure correctement les adresses IP
- Assurez-vous que tous les appareils sont connectés au même réseau

### Les gestes ne sont pas reconnus sur mobile
- Essayez de faire des gestes plus lents et plus précis
- Assurez-vous de faire un geste horizontal clair (gauche à droite ou droite à gauche)
- Vérifiez que vous utilisez bien un appareil tactile ou avec stylet
- Assurez-vous d'être connecté depuis un téléphone mobile et non depuis un émulateur ou un navigateur de bureau redimensionné
- Vérifiez que le canvas de gestes est bien visible en bas de l'écran sur la page de détail d'une question

### Les mises à jour en temps réel ne fonctionnent pas
- Vérifiez votre connexion internet
- Assurez-vous que le serveur est bien démarré
- Essayez de rafraîchir la page pour rétablir la connexion WebSocket
