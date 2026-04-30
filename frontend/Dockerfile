# Use official Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# ✅ Fix for Kubernetes (VERY IMPORTANT)
ENV BROWSER=none
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
