module.exports = {
  apps: [
    {
      name: 'trading-bot',
      script: 'dist/index.js',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
