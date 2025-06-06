// Variables globales pour gérer la connexion WebRTC
var name,                     // Stocke le code unique de l'utilisateur
    connectedUser,            // Stocke le code de l'utilisateur connecté
    isInitiator = false,      // Booléen indiquant si on est à l'origine de la connexion
    yourConnection,           // Objet RTCPeerConnection
    dataChannel,              // Canal de données pour l'échange de fichiers
    currentFile,              // Fichier en cours de transfert
    currentFileSize,          // Taille du fichier en cours
    currentFileMeta;          // Métadonnées du fichier

// 1) Connexion au serveur de signaling (WebSocket)
var ip = window.location.hostname;  // Récupère l'IP du serveur depuis l'URL
console.log(ip);

// Crée la connexion WebSocket vers le serveur
// Note: L'IP doit être celle de la machine hébergeant le serveur
var connection = new WebSocket('ws://' + ip + ':8888');

// Pour se connecter depuis un autre PC : http://[IP_PC1]:8000

// Callback appelé quand la connexion WebSocket est établie
connection.onopen = function () {
  console.log("🔗 Connected to signaling server");
  send({ type: "login" });  // Envoie une demande de login au serveur
};

// Callback pour gérer les messages reçus du serveur
connection.onmessage = function (message) {
  console.log("📨 Got message", message.data);
  var data = JSON.parse(message.data);  // Parse le message JSON

  // Traite le message selon son type
  switch (data.type) {
    case "login":
      onLogin(data);      // Réponse à la connexion
      break;
    case "offer":
      onOffer(data.offer, data.name);  // Offre de connexion WebRTC
      break;
    case "answer":
      onAnswer(data.answer);           // Réponse à l'offre
      break;
    case "candidate":
      onCandidate(data.candidate);     // Candidat ICE
      break;
    case "leave":
      onLeave();                       // Déconnexion
      break;
    default:
      break;
  }
};

// Callback pour gérer les erreurs de connexion WebSocket
connection.onerror = function (err) {
  console.error("⚠ Got error", err);
};

// Envoi JSON via WebSocket
function send(message) {
  // Ajoute le nom de l'utilisateur connecté si disponible
  if (connectedUser) {
    message.name = connectedUser;
  }
  // Envoie le message stringifié
  connection.send(JSON.stringify(message));
}

// 2) Traitement de la réponse "login" du serveur
function onLogin(data) {
  name = data.code;  // Récupère le code unique
  $("#yourCode").text(name);  // Affiche le code dans l'UI
  console.log("🔑 Logged in as", name);
  startConnection();  // Initialise la connexion WebRTC
}

// 3) Initialisation de la PeerConnection WebRTC
function startConnection() {
  // Vérifie la compatibilité WebRTC
  if (!hasRTCPeerConnection()) {
    alert("Sorry, your browser does not support WebRTC.");
    return;
  }

  console.log("📡 Starting WebRTC peer connection");

  // Configuration des serveurs ICE (STUN/TURN)
  var configuration = {
    iceServers: [
      { url: "stun:stun.l.google.com:19302" }  // Serveur STUN public de Google
    ]
  };

  // Crée la connexion peer-to-peer
  yourConnection = new RTCPeerConnection(configuration, { optional: [] });

  // a) Gestion des candidats ICE locaux
  yourConnection.onicecandidate = function (event) {
    if (event.candidate) {
      console.log("🧊 ICE candidate generated:", event.candidate);
      send({ type: "candidate", candidate: event.candidate });  // Envoie au pair
    }
  };

  // b) Gestion du DataChannel pour le pair distant
  yourConnection.ondatachannel = function (event) {
    console.log("📥 DataChannel reçu");
    dataChannel = event.channel;
    setupDataChannelHandlers();  // Configure les handlers du canal
  };
}

// 4) Fonction appelée quand on clique sur "Connect"
function connect() {
  var otherDeviceCode = $("#otherDeviceCode").val();
  if (!otherDeviceCode) return;  // Vérifie qu'un code a été saisi

  connectedUser = otherDeviceCode;
  isInitiator = true;  // On devient l'initiateur
  console.log("📞 Début de l'offre vers", connectedUser);

  // Crée le DataChannel (côté initiateur seulement)
  dataChannel = yourConnection.createDataChannel("myLabel");
  setupDataChannelHandlers();

  // On crée l’offre WebRTC
  yourConnection.createOffer(
    function (offer) {
      yourConnection.setLocalDescription(offer);
      send({ type: "offer", offer: offer });
    },
    function (error) {
      alert("Error when creating an offer");
    }
  );
}

// Mettre à jour l’UI pour déconnecter
function disconnect() {
  console.log("💔 Envoi d’un leave à", connectedUser);
  send({ type: "leave" });
  onLeave();
}


// 5) Traitement d’une “offer”

function onOffer(offer, name) {
  // je suis le callee
  connectedUser = name;
  isInitiator = false;
  console.log("📨 Offre reçue de", name);

  // Je configure mes handlers avant de générer la réponse
  yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // Je crée la réponse (answer)
  yourConnection.createAnswer(
    function (answer) {
      console.log("📤 Réponse générée vers", connectedUser);
      yourConnection.setLocalDescription(answer);
      send({ type: "answer", answer: answer });
    },
    function (error) {
      alert("Error when creating an answer");
    }
  );
}


// 6) Traitement d’une “answer”

function onAnswer(answer) {
  console.log("📄 Réponse reçue ; définition du remoteDescription");
  yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
}


// 7) Traitement d’une “candidate”

function onCandidate(candidate) {
  console.log("🧊 Ajout d’un ICE candidate reçu");
  yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
}


// 8) Traitement d’un “leave”

function onLeave() {
  console.log("📴 L’autre utilisateur a quitté la connexion");
  connectedUser = null;
  // Ferme et réinitialise la connexion
  if (yourConnection) {
    yourConnection.close();
    yourConnection.onicecandidate = null;
  }
  // On peut recréer PeerConnection si on veut se reconnecter
  startConnection();
}


// 9) Dès que le DataChannel existe (initiateur ou callee), on installe onmessage, onopen, onclose, etc.

function setupDataChannelHandlers() {
  dataChannel.onerror = function (error) {
    console.error("⚠ Data Channel Error:", error);
  };

  dataChannel.onmessage = function (event) {
    try {
      var message = JSON.parse(event.data);
      switch (message.type) {
        case "start":
          currentFile = [];
          currentFileSize = 0;
          currentFileMeta = message.data;
          console.log("📥 Début de la réception de “" + currentFileMeta.name + "” (" + currentFileMeta.size + " octets)");
          break;
        case "end":
          console.log("✅ Tous les chunks reçus pour “" + currentFileMeta.name + "” : reconstitution du fichier");
          saveFile(currentFileMeta, currentFile);
          break;
      }
    } catch (e) {
      // C’est un chunk Base64
      currentFile.push(atob(event.data));
      currentFileSize += currentFile[currentFile.length - 1].length;
      var percentage = Math.floor((currentFileSize / currentFileMeta.size) * 100);
      console.log("🔄 Réception chunk : " + percentage + "%");
      // Si vous aviez une barre HTML : 
      // $("#progress-recv").attr("aria-valuenow", percentage).css("width", percentage + "%");
    }
  };

  dataChannel.onopen = function () {
    console.log("🟢 DataChannel open");
    $("#btn-disconnect").removeAttr("disabled");
    $("#btn-connect").attr("disabled", "disabled")
                     .removeClass("btn-default")
                     .addClass("btn-success")
                     .text("Connected to " + connectedUser);

    $("#otherDeviceCode").val("").attr("disabled", "disabled");
    $("#files-box").removeClass("hidden");
  };

  dataChannel.onclose = function () {
    console.log("🔴 DataChannel closed");
    $("#btn-disconnect").attr("disabled", "disabled");

    $("#btn-connect").removeAttr("disabled")
                     .addClass("btn-default")
                     .removeClass("btn-success")
                     .text("Connect");

    $("#otherDeviceCode").val("").removeAttr("disabled");
    $("#files-box").addClass("hidden");
  };
}


// 10) Envoi du fichier côté expéditeur

var CHUNK_MAX = 160000;
function sendFile(file, fileId) {
  var reader = new FileReader();

  reader.onloadend = function(evt) {
    if (evt.target.readyState !== FileReader.DONE) return;
    var buffer = reader.result,
        start = 0,
        end = 0,
        last = false;

    function sendChunk() {
      end = start + CHUNK_MAX;
      if (end > file.size) {
        end = file.size;
        last = true;
      }
      var pct = Math.floor((end / file.size) * 100);
      $("#file-" + fileId + " .progress-bar")
        .attr("aria-valuenow", pct)
        .css("width", pct + "%");
      dataChannel.send(arrayBufferToBase64(buffer.slice(start, end)));
      console.log("📤 Envoi chunk : " + pct + "%");

      if (last) {
        dataChannel.send(JSON.stringify({ type: "end" }));
        console.log("📤 Tous les chunks ont été envoyés (" + file.name + ")");
        startSending();
        $(".btn-remove-file-" + fileId)
          .removeClass("btn-warning")
          .addClass("btn-success")
          .attr("onclick", "")
          .attr("disabled", "disabled")
          .text("success");
      } else {
        start = end;
        setTimeout(sendChunk, 100);
      }
    }

    // Avant d’envoyer les chunks, on envoie le JSON “start”
    dataChannel.send(JSON.stringify({
      type: "start",
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate
      }
    }));
    console.log("📤 Envoi du message “start” pour", file.name);
    // Puis on commence à envoyer les lumps
    sendChunk();
  };

  reader.readAsArrayBuffer(file);
}


// Fonctions utilitaires

function saveFile(meta, data) {
  var blob = base64ToBlob(data, meta.type);
  console.log("💾 Enregistrement du fichier reçu en tant que :", meta.name);
  saveAs(blob, meta.name);
}

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  for (var i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBlob(b64Data, contentType) {
  contentType = contentType || "";
  var byteArrays = [];
  for (var i = 0; i < b64Data.length; i++) {
    var slice = b64Data[i];
    var byteNumbers = new Array(slice.length);
    for (var n = 0; n < slice.length; n++) {
      byteNumbers[n] = slice.charCodeAt(n);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: contentType });
}
// Fonction utilitaire pour vérifier la compatibilité WebRTC
function hasRTCPeerConnection() {

  // Normalise les préfixes navigateurs
  
  window.RTCPeerConnection = window.RTCPeerConnection ||
                             window.webkitRTCPeerConnection ||
                             window.mozRTCPeerConnection;
  window.RTCSessionDescription = window.RTCSessionDescription ||
                                 window.webkitRTCSessionDescription ||
                                 window.mozRTCSessionDescription;
  window.RTCIceCandidate = window.RTCIceCandidate ||
                           window.webkitRTCIceCandidate ||
                           window.mozRTCIceCandidate;
  return !!window.RTCPeerConnection;
}

function hasFileApi() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}
// No need to duplicate file handling code here as it's already in main.js
// The main.js file handles all file selection, listing, and UI updates

// We'll just leave the sendFile function since it works with the WebRTC dataChannel
// This way main.js can call it, but the actual file sending happens here with the dataChannel
