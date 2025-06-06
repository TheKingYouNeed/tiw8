# Transfert de fichiers WebRTC

## Présentation
J'ai développé une application de transfert de fichiers pair à pair basée sur WebRTC. Elle permet d'envoyer directement des fichiers entre navigateurs sans nécessiter de serveur intermédiaire pour les données. L'application utilise les canaux de données WebRTC pour des transferts de fichiers directs et sécurisés entre appareils.

## Fonctionnalités
- Interface utilisateur simple et intuitive
- Prise en charge du glisser-déposer
- Indicateurs de progression pour les transferts de fichiers
- Sélection et transfert multi-fichiers
- Fonctionne sur tous les appareils d'un réseau local
- Aucune limitation de taille de fichier imposée par les serveurs (contraintes de mémoire du navigateur toutefois)

## Conception technique
L'application utilise plusieurs technologies clés :

- **WebRTC** - Pour la communication directe entre homologues
- **WebSockets** - Pour la signalisation initiale entre homologues
- **Node.js** - Pour le serveur de signalisation léger
- **API Fichier HTML5** - Pour la gestion des fichiers dans le navigateur

## Améliorations futures prévues
- Prise en charge des fichiers volumineux grâce à la lecture segmentée des fichiers via file.slice()
- Prise en charge du stockage persistant via IndexedDB ou similaire
- Amélioration de la gestion des erreurs et de la stabilité de la connexion
- Améliorations de l'interface utilisateur et de l'expérience utilisateur, notamment le mode sombre
- Chiffrement de bout en bout pour une sécurité renforcée

## Installation et configuration

### Prérequis
- Node.js installé sur votre ordinateur
- Navigateur web compatible WebRTC (Chrome, Firefox, Safari, Edge)

### Étape 1 : Installer les dépendances
Accédez au répertoire racine du projet et installez les dépendances :
```
npm install
```

Installez également les dépendances dans le répertoire node-server :
```
cd node-server
npm install
```

### Étape 2 : Démarrer le serveur de signalisation
Depuis le répertoire node-server, démarrez le serveur de signalisation WebSocket :
```
node server.js
```
Vous devriez voir : « Serveur démarré… »

### Étape 3 : Démarrer le serveur HTTP
Ouvrez un nouveau terminal, accédez au répertoire racine du projet et démarrez le serveur HTTP :
```
http-server -c-1 . -p 8000
```

## Utilisation

### Pour tester un même appareil
1. Ouvrez deux fenêtres de navigateur à l'adresse http://localhost:8000
2. Chaque fenêtre affichera un code unique.
3. Dans une fenêtre, saisissez le code de l'autre fenêtre et cliquez sur « Se connecter ».
4. Une fois connecté, sélectionnez les fichiers à transférer et cliquez sur « Démarrer l'envoi ».

### Pour tester différents appareils sur le même réseau
1. Trouvez l'adresse IP de l'ordinateur qui exécute les serveurs.
2. Sur les autres appareils, accédez à http://[VOTRE_ADRESSE_IP]:8000
3. Si la connexion ne fonctionne pas automatiquement, modifiez js/client.js :
- Trouvez cette ligne : `var connection = new WebSocket('ws://' + ip + ':8888');`
- Remplacez par : `var connection = new WebSocket('ws://[VOTRE_ADRESSE_IP]:8888');`