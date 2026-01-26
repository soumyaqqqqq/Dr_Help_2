const corsOptions = {
    origin: function (origin, callback) {
        console.log(`Request origin: ${origin || 'No origin (same origin)'}`);

        // Allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'https://localhost:3000',
            'https://dr-help-2.vercel.app',
            'https://dr-help-2-git-main-rakshi2609.vercel.app', // Git branch preview
            'https://dr-help-2-rakshi2609.vercel.app' // Alternative Vercel domain
        ];

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Cache-Control', 'X-Requested-With'],
    exposedHeaders: ['x-auth-token']
};

export default corsOptions;
