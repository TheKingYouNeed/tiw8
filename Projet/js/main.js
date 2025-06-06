// Liste globale des fichiers sélectionnés à envoyer
var files = []

// Fonction appelée quand l'utilisateur entre un code d'appareil distant pour établir la connexion WebRTC
function connect() {
  var otherDeviceCode = $("#otherDeviceCode").val(); // Récupère le code saisi

  // Si un code a été entré, on démarre la connexion avec l'autre appareil
  if (otherDeviceCode.length > 0) {
    startPeerConnection(otherDeviceCode);
  }
}

// Fonction appelée pour fermer la connexion WebRTC en cours
function disconnect() {
  closePeerConnection();
}

// Index pour suivre quel fichier a été envoyé en dernier
var lastSentFileIndex = 0;

// Fonction pour démarrer l'envoi des fichiers via dataChannel
function startSending() {
  // Vérifie s'il reste des fichiers à envoyer
  if (files.length > 0 && lastSentFileIndex < files.length) {
    // Met à jour le bouton "remove" en "sending"
    $(".btn-remove-file-" + lastSentFileIndex)
      .removeClass("btn-danger")
      .addClass("btn-warning")
      .attr("onclick", "")
      .attr("disabled", "disabled")
      .text("sending");
      
    // Le message "start" et l'envoi du fichier sont gérés par sendFile dans client.js
    // On appelle simplement la fonction qui s'occupe de tout le processus d'envoi
    sendFile(files[lastSentFileIndex], lastSentFileIndex);

    // Passe au fichier suivant pour l'envoi
    lastSentFileIndex++;
  }
}

// Initialisation : on vérifie que les API nécessaires sont disponibles
if (window.File && window.FileList && window.FileReader) {
  var selectedFiles = $("#selectedFiles");   // Input de type file
  var dragarea = $("#drag-area");            // Zone de glisser-déposer

  // Gestion de la sélection via bouton "Parcourir"
  selectedFiles.bind("change", handleFileSelection);

  // Gestion du glisser-déposer
  dragarea.bind("dragover", dragingActive);
  dragarea.bind("dragleave", dragingActive);
  dragarea.bind("drop", handleFileSelection);
}

// Fonction pour activer/désactiver le style visuel de la zone de drop
function dragingActive(e) {
  e.stopPropagation(); // Empêche la propagation
  e.preventDefault();  // Empêche le comportement par défaut
  // Applique une classe CSS selon l'événement
  e.target.className = (e.type == "dragover" ? "active" : "");
}

// Fonction appelée lors de la sélection de fichiers (bouton ou drag/drop)
function handleFileSelection(e) {
  dragingActive(e); // Nettoie le style visuel

  // Récupère les fichiers depuis l'input ou le glisser-déposer
  var files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;

  // Parcourt tous les fichiers et les ajoute à l'interface
  for (var i = 0, f; f = files[i]; i++) {
    addFile(f);
  }
}

// Fonction pour ajouter un fichier sélectionné à la liste et l'interface utilisateur
function addFile(file) {
  $(".btn-start-send").removeClass("hidden"); // Affiche le bouton pour envoyer les fichiers

  files.push(file); // Ajoute le fichier au tableau global

  // Ajoute un bloc HTML dans la liste des fichiers à envoyer
  $("#files-list").append(
    "<div class=\"col-sm-6 inline\" id=\"file-" + (files.length-1) + "\">" +
      "<div class=\"panel panel-default\">" +
        "<div class=\"panel-heading\">" +
          "<h3 class=\"panel-title dont-break-out\">" + file.name + "</h3>" +
        "</div>" +
        "<div class=\"panel-body\">" +
          "<p> type: <strong>" + file.type + "</strong><br>size: <strong>" + sizeOf(file.size) + "</strong></p>" +
          "<div class=\"progress\">" +
            "<div class=\"progress-bar progress-bar-striped\" role=\"progressbar\"" +
            " aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"" +
            " style=\"width: 0%\"><span class=\"sr-only\">0% Complete</span></div>" +
          "</div>" +
          "<button onclick=\"removeFile(" + (files.length -1) + ");\" class=\"btn btn-sm btn-danger btn-remove-file-" + (files.length-1) + "\">" +
            "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> remove</button>" +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

// Convertit une taille en octets en format lisible (Ko, Mo, Go, etc.)
sizeOf = function (bytes) {
  if (bytes == 0) { return "0.00 B"; }
  var e = Math.floor(Math.log(bytes) / Math.log(1000)); // Détermine l’unité
  return (bytes / Math.pow(1000, e)).toFixed(2) + ' ' + ' KMGTP'.charAt(e) + 'B'; // Formate le résultat
}

// Supprime un fichier sélectionné de la liste
removeFile = function (index) {
  files.splice(index, 1); // Retire le fichier du tableau
  $("#file-" + index).remove(); // Retire l'élément HTML associé
}
