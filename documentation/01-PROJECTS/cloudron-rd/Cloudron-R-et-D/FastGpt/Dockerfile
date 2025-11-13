# Use the official FastGPT image
FROM ghcr.io/labring/fastgpt:v4.12.3

# Expose the port that FastGPT runs on
EXPOSE 3000

# Set environment variables that will be overridden by Cloudron
ENV MONGODB_URI=mongodb://mongo:27017/fastgpt
ENV PG_URL=postgresql://postgres:postgres@postgres:5432/postgres
ENV REDIS_URL=redis://redis:6379
ENV FE_DOMAIN=

# Start the application
CMD ["node", "app.js"]