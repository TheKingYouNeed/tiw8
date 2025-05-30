import path from "path";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { PublicEvent, Question } from "./models";

const app = express();
// Enable CORS for all origins with more options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
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
const DIST_DIR = path.join(__dirname, "../../client/dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

// Middleware pour servir les fichiers statiques
app.use(express.static(DIST_DIR));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware to handle SPA routing - support for React Router
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
    console.log(`SPA route requested: ${req.path}`);
    res.sendFile(HTML_FILE);
  } else {
    next();
  }
});

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

let events: PublicEvent[] = [
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
const processAction = (action: any) => {
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
        eventToDeleteFrom.questions = eventToDeleteFrom.questions.filter(
          q => q.id !== action.payload.questionId
        );
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
  const event = req.body as PublicEvent;
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
  const question = req.body as Question;
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

// Start server
const port = process.env.PORT || 3000;
const host = '0.0.0.0'; // Listen on all network interfaces

httpServer.listen(port, () => {
  // Get local IP addresses for display in console
  const networkInterfaces = require('os').networkInterfaces();
  const localIPs = Object.values(networkInterfaces)
    .flat()
    .filter((details: any) => details.family === 'IPv4' && !details.internal)
    .map((details: any) => details.address);

  console.log(`Server running on port ${port}`);
  console.log('Access the application from:');
  console.log(`- Local: http://localhost:${port}`);
  localIPs.forEach(ip => {
    console.log(`- Network: http://${ip}:${port}`);
  });
});
