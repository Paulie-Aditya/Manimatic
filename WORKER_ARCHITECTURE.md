# Manimatic Worker Architecture

This document explains the new worker-based architecture for safe, isolated code execution.

## 🏗️ Architecture Overview

The new architecture splits the application into two containers:

### **Backend Container (`manimatic-backend`)**

- **Purpose**: Flask API server, code generation, job management
- **Dependencies**: Flask, Docker client, Gemini AI
- **Security**: No Manim execution capabilities
- **Size**: ~200MB (lightweight)

### **Worker Container (`manimatic-worker`)**

- **Purpose**: Isolated Manim code execution
- **Dependencies**: Manim, FFmpeg, LaTeX, rendering libraries
- **Security**: Ephemeral, sandboxed execution
- **Size**: ~2GB (full rendering environment)

## 🔄 Execution Flow

```
1. User Request → Backend API
2. Backend generates Manim code using Gemini
3. Backend spawns ephemeral worker container
4. Worker executes code in isolated environment
5. Worker uploads result to Cloudinary
6. Worker container is destroyed
7. Backend returns result to user
```

## 🛡️ Security Features

### **Container Isolation**

- **Ephemeral containers**: Each job runs in a fresh container
- **Network disabled**: No external network access
- **Read-only filesystem**: Cannot modify host files
- **Resource limits**: CPU and memory constraints
- **Auto-cleanup**: Containers are removed after execution

### **Code Safety**

- **Input validation**: Checks for malicious patterns
- **Sandboxed execution**: Limited system access
- **Timeout protection**: 5-minute execution limit
- **Error handling**: Graceful failure handling

## 🚀 Quick Start

### **1. Build Containers**

```bash
# Make build script executable
chmod +x build.sh

# Build both containers
./build.sh
```

### **2. Set Environment Variables**

Create a `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **3. Run the Application**

```bash
# Start the backend
docker-compose up

# Or in detached mode
docker-compose up -d
```

## 📋 API Endpoints

### **Generate Animation**

```bash
POST /generate
Content-Type: application/json

{
  "prompt": "Create a simple circle animation"
}
```

**Response:**

```json
{
  "job_id": "abc12345",
  "status": "started"
}
```

### **Check Status**

```bash
GET /status/abc12345
```

**Response:**

```json
{
  "status": "complete",
  "url": "https://res.cloudinary.com/.../video.mp4",
  "code": "from manim import *\n...",
  "explanation": "This animation shows..."
}
```

### **Health Check**

```bash
GET /health
```

## 🔧 Configuration

### **Resource Limits**

Worker containers have the following limits:

- **Memory**: 2GB
- **CPU**: 50% of available cores
- **Timeout**: 5 minutes
- **Network**: Disabled
- **Filesystem**: Read-only with tmpfs

### **Environment Variables**

- `JOB_ID`: Unique job identifier
- `CODE`: Generated Manim code
- `USER_PROMPT`: Original user request
- `CLOUDINARY_*`: Cloudinary credentials

## 🐛 Troubleshooting

### **Common Issues**

1. **Docker socket permission**

   ```bash
   # Fix Docker socket permissions
   sudo chmod 666 /var/run/docker.sock
   ```

2. **Worker container not found**

   ```bash
   # Rebuild worker container
   docker build -f backend/Dockerfile.worker -t manimatic-worker:latest ./backend
   ```

3. **Memory issues**

   ```bash
   # Increase Docker memory limit
   # In Docker Desktop: Settings → Resources → Memory
   ```

4. **Timeout errors**
   - Check if Manim code is too complex
   - Reduce animation complexity
   - Check system resources

### **Debug Mode**

```bash
# Run backend in debug mode
docker-compose run --rm manimatic-backend python -u app.py

# Check worker logs
docker logs <worker-container-id>
```

## 📊 Monitoring

### **Health Checks**

- Backend health: `GET /health`
- Docker connectivity check
- Resource usage monitoring

### **Logs**

```bash
# View backend logs
docker-compose logs -f manimatic-backend

# View specific job logs
docker logs <container-id>
```

## 🔄 Development

### **Local Development**

```bash
# Build containers
./build.sh

# Run with volume mounts for development
docker-compose -f docker-compose.dev.yml up
```

### **Testing**

```bash
# Test API endpoints
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a simple square"}'
```

## 🚀 Production Deployment

### **Security Considerations**

1. **Use secrets management** for API keys
2. **Implement rate limiting**
3. **Add authentication**
4. **Use HTTPS**
5. **Monitor resource usage**

### **Scaling**

- **Horizontal scaling**: Multiple backend instances
- **Load balancing**: Nginx reverse proxy
- **Job queue**: Redis/Celery for job management
- **Database**: Persistent job storage

### **Monitoring**

- **Container health**: Docker health checks
- **Resource usage**: CPU, memory, disk
- **Error tracking**: Log aggregation
- **Performance**: Response time monitoring

## 📁 File Structure

```
backend/
├── Dockerfile.backend          # Backend container
├── Dockerfile.worker           # Worker container
├── worker_entrypoint.py       # Worker execution script
├── app.py                     # Flask API
├── gemini_functions.py        # AI code generation
└── manim.cfg                  # Manim configuration

docker-compose.yml             # Container orchestration
build.sh                       # Build script
.env                          # Environment variables
```

## 🔗 Related Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Manim Documentation](https://docs.manim.community/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License.
