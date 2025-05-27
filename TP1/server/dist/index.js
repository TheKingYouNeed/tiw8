"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Configuration des chemins pour servir les fichiers statiques
const DIST_DIR = path_1.default.join(__dirname, "../../client/dist");
const HTML_FILE = path_1.default.join(DIST_DIR, "index.html");
// Middleware pour servir les fichiers statiques
app.use(express_1.default.static(DIST_DIR));
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Route principale qui pointe vers le fichier HTML
app.get("/", (req, res) => {
    res.sendFile(HTML_FILE);
});
// Route API d'exemple
app.get("/api/info", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API du TP1 de TIW8",
        auteur: "Dahmani Mohammed",
        date: new Date().toLocaleDateString("fr-FR"),
    });
});
// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Application accessible à l'adresse: http://localhost:${port}`);
});
