"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
    // Configuration pour limiter les connexions et les requêtes
    connectionStateRecovery: {
        // Activer la récupération d'état de connexion
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes max
    },
    pingTimeout: 20000, // 20 secondes avant de considérer une connexion comme perdue
    pingInterval: 25000, // Intervalle de ping pour vérifier les connexions
});
// Configuration des chemins pour servir les fichiers statiques
const DIST_DIR = path_1.default.join(__dirname, "../../client/dist");
const HTML_FILE = path_1.default.join(DIST_DIR, "index.html");
// Middleware pour servir les fichiers statiques
app.use(express_1.default.static(DIST_DIR));
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Middleware to handle SPA routing - support for React Router
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
        console.log(`SPA route requested: ${req.path}`);
        res.sendFile(HTML_FILE);
    }
    else {
        next();
    }
});
// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
let events = [
    {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn the basics of React and its ecosystem',
        questions: [
            {
                id: '1',
                text: 'What is JSX?',
                content: 'Please explain the concept of JSX in React',
                votes: 0,
                author: 'student1',
                color: '#f87171',
                position: { x: 10, y: 20 },
                size: { width: 200, height: 150 },
            },
            {
                id: '2',
                text: 'How do hooks work?',
                content: 'Can you explain React hooks and their benefits?',
                votes: 0,
                author: 'student2',
                color: '#60a5fa',
                position: { x: 30, y: 40 },
                size: { width: 200, height: 150 },
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Redux Workshop',
        description: 'Deep dive into Redux and state management',
        questions: [
            {
                id: '3',
                text: 'What is a reducer?',
                content: 'Please explain the concept of reducers in Redux',
                votes: 0,
                author: 'student3',
                color: '#4ade80',
                position: { x: 20, y: 30 },
                size: { width: 200, height: 150 },
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
// Process Redux actions on the server to update state
const processAction = (action) => {
    console.log('Processing action:', action.type);
    switch (action.type) {
        case 'events/addEvent':
            events.push(action.payload);
            break;
        case 'events/addQuestion':
            const eventToAddQuestion = events.find(e => e.id === action.payload.eventId);
            if (eventToAddQuestion) {
                eventToAddQuestion.questions.push(action.payload.question);
                eventToAddQuestion.updatedAt = new Date().toISOString();
            }
            break;
        case 'events/upvoteQuestion':
            const eventToUpvote = events.find(e => e.id === action.payload.eventId);
            if (eventToUpvote) {
                const questionToUpvote = eventToUpvote.questions.find(q => q.id === action.payload.questionId);
                if (questionToUpvote) {
                    questionToUpvote.votes += 1;
                    eventToUpvote.updatedAt = new Date().toISOString();
                }
            }
            break;
        case 'events/deleteQuestion':
            const eventToDeleteFrom = events.find(e => e.id === action.payload.eventId);
            if (eventToDeleteFrom) {
                eventToDeleteFrom.questions = eventToDeleteFrom.questions.filter(q => q.id !== action.payload.questionId);
                eventToDeleteFrom.updatedAt = new Date().toISOString();
            }
            break;
    }
};
// Suivi des connexions actives et limitation des requêtes
const connectedClients = new Map();
const actionThrottleMap = new Map();
const THROTTLE_DELAY = 300; // ms
// Socket.io event handling
io.on("connection", (socket) => {
    const clientId = socket.id;
    console.log(`Client connected: ${clientId}`);
    connectedClients.set(clientId, { lastAction: Date.now() });
    // Envoyer les événements actuels au nouveau client connecté
    socket.emit("events", events);
    // Gérer les actions entrantes
    socket.on("action", (action) => {
        const now = Date.now();
        const clientInfo = connectedClients.get(clientId);
        // Vérifier si l'action est throttled
        const actionKey = `${clientId}-${action.type}`;
        const lastActionTime = actionThrottleMap.get(actionKey) || 0;
        if (now - lastActionTime < THROTTLE_DELAY) {
            console.log(`Action throttled for client ${clientId}: ${action.type}`);
            return; // Ignorer l'action si elle est trop fréquente
        }
        // Mettre à jour le timestamp de la dernière action
        actionThrottleMap.set(actionKey, now);
        if (clientInfo) {
            clientInfo.lastAction = now;
        }
        console.log(`Action received from ${clientId}:`, action.type);
        // Traiter l'action pour mettre à jour l'état du serveur
        processAction(action);
        // Diffuser l'action à tous les autres clients
        socket.broadcast.emit("action", action);
    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${clientId}`);
        connectedClients.delete(clientId);
        // Nettoyer les entrées de throttle pour ce client
        for (const key of actionThrottleMap.keys()) {
            if (key.startsWith(`${clientId}-`)) {
                actionThrottleMap.delete(key);
            }
        }
    });
    socket.on("error", (error) => {
        console.error(`Socket error for client ${clientId}:`, error);
    });
});
// API Routes
app.get("/api/events", (req, res) => {
    res.json(events);
});
app.post("/api/events", (req, res) => {
    const event = req.body;
    event.createdAt = new Date().toISOString();
    event.updatedAt = new Date().toISOString();
    events.push(event);
    // Emit to all clients including sender
    io.emit("action", {
        type: 'events/addEvent',
        payload: event
    });
    res.status(201).json(event);
});
app.post("/api/events/:eventId/questions", (req, res) => {
    const { eventId } = req.params;
    const question = req.body;
    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }
    event.questions.push(question);
    event.updatedAt = new Date().toISOString();
    // Emit to all clients including sender
    io.emit("action", {
        type: 'events/addQuestion',
        payload: { eventId, question }
    });
    res.status(201).json(question);
});
// Handle upvoting via REST API
app.post("/api/events/:eventId/questions/:questionId/upvote", (req, res) => {
    const { eventId, questionId } = req.params;
    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }
    const question = event.questions.find(q => q.id === questionId);
    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }
    question.votes += 1;
    event.updatedAt = new Date().toISOString();
    // Emit to all clients including sender
    io.emit("action", {
        type: 'events/upvoteQuestion',
        payload: { eventId, questionId }
    });
    res.status(200).json(question);
});
// Handle deleting questions via REST API
app.delete("/api/events/:eventId/questions/:questionId", (req, res) => {
    const { eventId, questionId } = req.params;
    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }
    const questionExists = event.questions.some(q => q.id === questionId);
    if (!questionExists) {
        return res.status(404).json({ error: "Question not found" });
    }
    event.questions = event.questions.filter(q => q.id !== questionId);
    event.updatedAt = new Date().toISOString();
    // Emit to all clients including sender
    io.emit("action", {
        type: 'events/deleteQuestion',
        payload: { eventId, questionId }
    });
    res.status(200).json({ success: true, message: "Question deleted successfully" });
});
// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Open your browser at http://localhost:${port}`);
});
