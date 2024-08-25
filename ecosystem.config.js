module.exports = {
  apps: [
    {
      name: "matchMaking-Faizan",
      script: "./src/app.js", // Update this if your entry point is different
      watch: true, // Enable watch mode to restart on changes
      ignore_watch: ["node_modules"], // Ignore node_modules to prevent unnecessary restarts
      // env: {
      //   NODE_ENV: "development",
      //   PORT: 3000,
      //   // Add any other environment variables here
      // },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Add any production-specific environment variables here
      },
    },
  ],
};
