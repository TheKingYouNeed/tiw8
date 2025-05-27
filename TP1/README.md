# TP1 - Application React avec Tailwind CSS

## Présentation du Projet

Ce projet a été développé dans le cadre du module TIW8. Il illustre l'utilisation d'un front-end React avec un back-end Node/Express, en TypeScript. L'application présente une interface simple avec des logos, un compteur de clics et des informations sur le projet.

## Structure du Projet

Le projet est organisé en deux parties principales :

### Client (Front-end)

- Développé avec React et TypeScript
- Utilise Vite comme outil de build et serveur de développement
- Intègre Tailwind CSS pour le styling
- Structure en composants (Header, Content, Footer)

### Serveur (Back-end)

- Développé avec Node.js, Express et TypeScript
- Sert l'application React compilée
- Fournit des API pour l'application

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

## Comment exécuter le projet

### Mode Développement

1. **Client** :
   ```
   cd client
   yarn install
   yarn dev
   ```
   L'application sera accessible à l'adresse : http://localhost:5173

2. **Serveur** :
   ```
   cd server
   yarn install
   yarn start
   ```
   Le serveur démarrera sur http://localhost:3000

### Mode Production

1. **Compiler le client** :
   ```
   cd client
   yarn build
   ```
   Cela générera les fichiers statiques dans le dossier `dist`.

2. **Démarrer le serveur** :
   ```
   cd server
   yarn start
   ```
   Le serveur servira les fichiers statiques du client et l'application sera accessible à l'adresse : http://localhost:3000

## Structure des composants

L'application est divisée en plusieurs composants React :

1. **Header** : Affiche le titre et les logos.
2. **Content** : Contient le compteur de clics et les instructions.
3. **Footer** : Affiche les informations de pied de page.

## Dépannage

Si vous rencontrez des erreurs TypeScript lors de la compilation, vous pouvez essayer :

```
yarn build --no-typecheck
```

Pour le développement sans vérification de types :

```
yarn dev --no-typecheck
```

## Auteur

Dahmani Mohammed
