# Application Q&R - TP2 TIW8

## Guide des fonctionnalités

Ce guide vous explique comment tester les différentes fonctionnalités de l'application de questions-réponses développée pour le TP2 du module TIW8.

> **Note importante :** Assurez-vous que le serveur et le client sont en cours d'exécution avant de tester les fonctionnalités.

## Architecture SPA (Single-Page Application)

### 1. Application React avec TypeScript
- Naviguez entre les différentes vues sans rechargement de page
- Observez la mise à jour fluide de l'URL dans la barre d'adresse

### 2. Composants UI modulaires
- Examinez la structure des composants dans le dossier `client/src/components/`
- Notez comment chaque composant (toolbar, event panel, question cards) est réutilisable

### 3. Structure statique avec données dynamiques
- Créez un nouvel événement et observez comment l'interface se met à jour sans rechargement

## Gestion des événements

### 1. Affichage de la liste des événements
- Accédez à `http://localhost:5173/events` pour voir la liste des événements

### 2. Sélection d'un événement
- Cliquez sur un événement dans la liste pour voir ses questions
- Notez comment l'URL change pour refléter l'événement sélectionné (`/event/:eventId`)

### 3. Ajout de nouveaux événements
- Cliquez sur "Créer un nouvel événement"
- Remplissez le formulaire et soumettez-le
- Vérifiez que le nouvel événement apparaît dans la liste

## Gestion des questions

### 1. Affichage des questions
- Sélectionnez un événement pour voir ses questions

### 2. Ajout de nouvelles questions
- Dans la vue d'un événement, utilisez le formulaire pour ajouter une nouvelle question
- Vérifiez que la nouvelle question apparaît dans la liste

### 3. Vote sur les questions
- Cliquez sur les boutons de vote (↑/↓) sur une question
- Observez le changement du nombre de votes

## Flux de données inversé

### 1. Notification des composants parents
- Effectuez une action dans un composant enfant (par exemple, voter sur une question)
- Observez comment cette action est propagée aux composants parents

### 2. Utilisation de Redux pour le flux de données
- Ouvrez les outils de développement Redux (extension navigateur)
- Observez l'état `currentEvent` et `currentQuestion` se mettre à jour lors de vos interactions

## Routage basé sur les URL

### 1. Mode administrateur
- Accédez à `http://localhost:5173/admin/event/:eventId`
- Connectez-vous avec les identifiants administrateur (mot de passe: admin123)
- Vérifiez que vous avez accès aux fonctionnalités d'administration

### 2. Accès direct aux événements
- Accédez directement à `http://localhost:5173/event/:eventId`
- Vérifiez que l'événement spécifique est chargé

### 3. Accès direct aux questions
- Accédez à `http://localhost:5173/event/:eventId/question/:questionId`
- Vérifiez que la question spécifique est affichée

### 4. Navigation entre questions
- Utilisez les flèches "‹" et "›" pour naviguer entre les questions
- Observez le changement d'URL et la mise à jour de l'interface

## État global avec Redux Toolkit

### 1. Store Redux
- Ouvrez les outils de développement Redux
- Examinez la structure du store et les différents états

### 2. Actions typées
- Effectuez différentes actions (sélection d'événement, vote, etc.)
- Observez les actions dispatched dans les outils Redux

### 3. Hooks React-Redux
- Examinez le code source pour voir l'utilisation de `useSelector` et `useDispatch`

## Middleware

### 1. Logger
- Ouvrez la console du navigateur
- Effectuez différentes actions et observez les logs détaillés (état précédent, action, état suivant)

### 2. Propagateur WebSocket
- Ouvrez l'application dans deux onglets ou navigateurs différents
- Effectuez une action dans un onglet et observez la synchronisation dans l'autre

## Synchronisation multi-dispositifs en temps réel

### 1. Diffusion des actions
- Ouvrez l'application sur plusieurs appareils connectés au même réseau
- Effectuez des modifications sur un appareil et observez la mise à jour en temps réel sur les autres

### 2. Mise à jour instantanée
- Créez une question sur un appareil
- Vérifiez qu'elle apparaît immédiatement sur les autres appareils

### 3. Configuration réseau pour utilisation sur réseau WiFi interne
- Nous avons modifié la configuration pour utiliser l'adresse IP de l'hôte actuel au lieu de localhost
- Cette modification permet d'accéder à l'application depuis n'importe quel appareil sur le même réseau WiFi
- Le code dans `socketMiddleware.ts` utilise `window.location.hostname` pour détecter automatiquement l'adresse IP
- Pour tester sur plusieurs appareils, connectez-les au même réseau WiFi et accédez à l'application via l'adresse IP du serveur

## Design adaptatif

### 1. Mise en page adaptative
- Redimensionnez la fenêtre du navigateur ou utilisez les outils de développement pour simuler différents appareils
- Observez comment l'interface s'adapte aux différentes tailles d'écran

### 2. Mode plein écran
- Cliquez sur le bouton de plein écran dans l'interface
- Vérifiez que l'application s'affiche correctement en plein écran

## Canvas et reconnaissance de gestes

### 1. Dessin à main levée
- Dans la vue d'un événement, utilisez le canvas pour dessiner
- Essayez de dessiner les gestes "‹" et "›"

### 2. Reconnaissance de gestes
- Dessinez le geste "‹" pour naviguer vers la question précédente
- Dessinez le geste "›" pour naviguer vers la question suivante
- Vérifiez que la navigation fonctionne correctement après la reconnaissance du geste

> **Astuce :** Pour de meilleurs résultats, dessinez les gestes d'un seul trait continu et essayez de les faire ressembler autant que possible aux symboles "‹" et "›".

---

Application Q&R - TP2 TIW8 - Dahmani Mohammed
