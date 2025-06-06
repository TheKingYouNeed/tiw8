// Importation du module WebSocket et création d’un serveur WebSocket sur le port 8888
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8888 }),
    users = {}; // Dictionnaire pour stocker les utilisateurs connectés, indexés par leur code unique

// Quand un client se connecte au serveur WebSocket
wss.on('connection', function (connection) {

  // Quand le client envoie un message
  connection.on('message', function (message) {
    var data;

    // On tente de parser le message JSON reçu
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log("Error parsing JSON"); // Erreur si le message n'est pas un JSON valide
      data = {};
    }

    // Traitement en fonction du type du message reçu
    switch (data.type) {
      case "login":
        // Génère un code unique pour l'utilisateur
        var code = generateCode();
        while(users[code])  // Vérifie que le code n'existe pas déjà
          code = generateCode();

        data.name = code;
        console.log("User logged in as", data.name);

        // On associe le code à la connexion
        users[data.name] = connection;
        connection.name = data.name;

        // On envoie une réponse de confirmation au client
        sendTo(connection, {
          type: "login",
          code: data.name,
          success: true
        });
        break;

      case "offer":
        // Un utilisateur envoie une offre WebRTC à un autre
        console.log("Sending offer to", data.name);   
        var conn = users[data.name]; // Récupère la connexion du destinataire

        if (conn != null) {
          connection.otherName = data.name; // Enregistre le nom du destinataire pour la déconnexion
          sendTo(conn, {
            type: "offer",
            offer: data.offer,
            name: connection.name
          });
        }
        break;

      case "answer":
        // Un utilisateur répond à une offre WebRTC
        console.log("Sending answer to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          connection.otherName = data.name;
          sendTo(conn, {
            type: "answer",
            answer: data.answer
          });
        }
        break;

      case "candidate":
        // Envoie d’un ICE candidate pour établir la connexion WebRTC
        console.log("Sending candidate to", data.name);
        var conn = users[data.name];

        if (conn != null) {
          sendTo(conn, {
            type: "candidate",
            candidate: data.candidate
          });
        }
        break;

      case "leave":
        // Un utilisateur veut quitter la session
        console.log("Disconnecting user from", data.name);
        var conn = users[data.name];
        conn.otherName = null;

        if (conn != null) {
          sendTo(conn, {
            type: "leave"
          });
        }
        break;

      default:
        // Message inconnu ou non supporté
        sendTo(connection, {
          type: "error",
          message: "Unrecognized command: " + data.type
        });
        break;
    }
  });

  // Quand le client ferme la connexion WebSocket
  connection.on('close', function () {
    if (connection.name) {
      delete users[connection.name]; // Supprime l'utilisateur du registre

      if (connection.otherName) {
        // Notifie l'autre utilisateur de la déconnexion
        console.log("Disconnecting user from", connection.otherName);
        var conn = users[connection.otherName];
        
        if (conn != null) {
          conn.otherName = null;
          sendTo(conn, {
            type: "leave"
          });
        }
      }
    }
  });
});

// Fonction utilitaire pour envoyer un message à un client WebSocket
function sendTo(conn, message) {
  conn.send(JSON.stringify(message)); // Sérialise l'objet en JSON avant l'envoi
}

// Log quand le serveur est prêt à recevoir des connexions
wss.on('listening', function () {
    console.log("Server started...");
});

// Génère un code unique aléatoire de 5 caractères (A-Z, 0-9)
function generateCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
