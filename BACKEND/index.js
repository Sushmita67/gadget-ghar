const express = require("express");
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
require("dotenv").config();

// Security middleware setup - DISABLED FOR DEVELOPMENT
// const { applySecurityMiddleware } = require("./middlewares/security");
// applySecurityMiddleware(app);

// Import sanitization middleware
const { sanitizeInput } = require("./middlewares/sanitizeMiddleware");

const { connectDb } = require("./config/database");
connectDb();



const PORT = process.env.PORT || 4000;
const HTTPS_PORT = process.env.HTTPS_PORT || 4443;
const cors = require("cors");

// CORS configuration for frontend
const allowedOrigins = [
  'https://localhost:5173', // Vite dev server (HTTPS)
  'https://localhost:3000', // React dev server (HTTPS)
  'https://localhost:4173', // Vite preview (HTTPS)
  'https://localhost:4443', // Backend HTTPS
  'http://localhost:5173',  // Fallback HTTP
  'http://localhost:3000',  // Fallback HTTP
  'http://localhost:4173',  // Fallback HTTP
  // Add environment variable for additional origins
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log(`CORS: Request from origin: ${origin}`);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`CORS: Allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`CORS: Blocking origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Serve uploads directory statically with CORS headers
const path = require('path');
app.use('/uploads', cors(corsOptions), (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Apply CORS to all routes
app.use(cors(corsOptions));
app.use(express.json());

// Apply sanitization middleware to all routes
app.use(sanitizeInput);

app.get("/", (req, res) => {
  res.send(`<center><h1>Server Running On Port : ${PORT}</h1></center>`);
});

//routes
app.use("/api/v1/user", require("./routes/authRoutes"));
app.use("/api/v1/pincode", require("./routes/pincodeRoutes"));
app.use("/api/v1/payment", require("./routes/paymentRoutes"));
app.use("/api/v1/review", require("./routes/reviewRoutes"));
app.use("/api/v1/profile", require("./routes/profileRoutes"));

//admin routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/setting", require("./routes/settingRoutes"));
app.use("/api/v1/product", require("./routes/productRoutes"));
app.use("/api/v1/order", require("./routes/orderRoutes"));

// Start servers
console.log("===============================");
console.log("🚀 Gadget Ghar Server Starting...");

// Try to start HTTPS server first if certs are available
const keyPath = process.env.SSL_KEY_PATH || './key.pem';
const certPath = process.env.SSL_CERT_PATH || './cert.pem';

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  try {
    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log("✅ HTTPS Server Started Successfully!");
      console.log(`- HTTPS : https://localhost:${HTTPS_PORT}`);
      console.log("===============================");
    });
  } catch (err) {
    console.log("❌ HTTPS Server Error:", err.message);
    console.log("===============================");
  }
} else {
  console.log("⚠️  SSL certificates not found at:");
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  console.log("   Starting HTTP server only...");
}

// Start HTTP server as fallback
http.createServer(app).listen(PORT, () => {
  console.log("✅ HTTP Server Started!");
  console.log(`- HTTP  : http://localhost:${PORT}`);
  console.log("===============================");
});
