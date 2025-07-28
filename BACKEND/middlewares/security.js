const helmet = require('helmet');
const helmetCsp = require('helmet-csp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const winston = require('winston');
const path = require('path');

require('dotenv').config();

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Security middleware setup
function applySecurityMiddleware(app) {
  // Helmet for HTTP headers
  app.use(helmet());
  app.use(
    helmetCsp({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https:', 'cdn.jsdelivr.net'],
        styleSrc: ["'self'", 'https:', 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
        connectSrc: ["'self'", process.env.FRONTEND_URL],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  // MongoDB injection protection
  app.use(mongoSanitize());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    })
  );

  // Cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Session management
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );

//   // CSRF protection
//   app.use(csrfProtection);

  // Logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

module.exports = { applySecurityMiddleware, logger }; 