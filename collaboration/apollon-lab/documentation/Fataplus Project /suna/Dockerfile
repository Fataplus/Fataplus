FROM node:20-bullseye-slim

# Install python to support Python-based runtimes if needed
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the project files
COPY . .

# Install Node.js dependencies if present
RUN if [ -f package.json ]; then npm ci --production --unsafe-perm || true; fi

# Install Python dependencies if present
RUN if [ -f requirements.txt ]; then pip3 install --no-cache-dir -r requirements.txt || true; fi

# Build step for Node.js projects (no-op if no build script defined)
RUN if [ -f package.json ]; then npm run build || true; fi

# Ensure start script is executable
RUN chmod +x ./start.sh || true

# Create a non-root user and set ownership
RUN groupadd -r app && useradd --no-log-init -r -g app app && chown -R app:app /app

USER app

# Default port used by the app - adjust if your app uses another port
ENV PORT=3000

EXPOSE 3000

CMD ["./start.sh"]