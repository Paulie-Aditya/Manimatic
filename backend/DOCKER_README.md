# Manimatic Backend - Docker Setup

This document provides instructions for running the Manimatic backend using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Gemini API key from Google AI Studio
- Cloudinary account and credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# MongoDB Configuration (optional - for future chat history feature)
MONGODB_URI=mongodb://localhost:27017/manimatic

# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1

# Application Configuration
PYTHONUNBUFFERED=1
PORT=5000

# Manim Configuration
MANIM_CFG_FILE=/app/manim.cfg
```

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the entire stack:**

   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**

   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**

   ```bash
   docker-compose logs -f manimatic-backend
   ```

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the image:**

   ```bash
   cd backend
   docker build -t manimatic-backend .
   ```

2. **Run the container:**

   ```bash
   docker run -d \
     --name manimatic-backend \
     -p 5000:5000 \
     --env-file .env \
     -v $(pwd)/jobs:/app/jobs \
     -v $(pwd)/logs:/app/logs \
     manimatic-backend
   ```

3. **View logs:**

   ```bash
   docker logs -f manimatic-backend
   ```

4. **Stop the container:**
   ```bash
   docker stop manimatic-backend
   docker rm manimatic-backend
   ```

## API Endpoints

Once running, the backend will be available at `http://localhost:5000`:

- `GET /ping` - Health check
- `GET /` - Hello world endpoint
- `POST /generate` - Start animation generation
- `GET /status/<job_id>` - Check generation status

## Health Check

The container includes a health check that pings the `/ping` endpoint every 30 seconds.

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using port 5000
   lsof -i :5000

   # Or change the port in docker-compose.yml
   ports:
     - "5001:5000"  # Use port 5001 instead
   ```

2. **Permission issues with mounted volumes:**

   ```bash
   # Create directories with proper permissions
   mkdir -p backend/jobs backend/logs
   chmod 755 backend/jobs backend/logs
   ```

3. **Out of memory errors:**

   - Manim can be memory-intensive
   - Increase Docker memory limit to at least 4GB
   - Consider using a larger instance for production

4. **Missing environment variables:**
   - Ensure all required environment variables are set
   - Check the `.env` file format (no spaces around `=`)

### Debug Mode

To run in debug mode with more verbose output:

```bash
docker-compose run --rm manimatic-backend python -u app.py
```

### Accessing the Container

```bash
# Enter the running container
docker exec -it manimatic-backend bash

# View logs in real-time
docker logs -f manimatic-backend

# Check container status
docker ps
```

## Production Deployment

For production deployment, consider:

1. **Using a production WSGI server:**

   ```dockerfile
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
   ```

2. **Setting up proper logging:**

   ```bash
   # Mount logs directory
   - ./logs:/app/logs
   ```

3. **Using environment-specific configurations:**

   ```bash
   FLASK_ENV=production
   FLASK_DEBUG=0
   ```

4. **Setting up monitoring and health checks**

5. **Using a reverse proxy (nginx) for SSL termination**

## Performance Optimization

1. **Increase Docker resources:**

   - Memory: 4GB+ recommended
   - CPU: 2+ cores recommended

2. **Use volume mounts for persistent data:**

   ```yaml
   volumes:
     - ./jobs:/app/jobs
     - ./logs:/app/logs
   ```

3. **Consider using a job queue system** for better scalability

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Use secrets management** in production
3. **Run container as non-root user** (already configured)
4. **Regularly update base images** and dependencies
5. **Implement proper authentication** before production use

## Support

For issues related to:

- **Docker setup**: Check this README and Docker documentation
- **Manim issues**: Check Manim documentation and logs
- **API issues**: Check Flask logs and API documentation
- **Environment issues**: Verify all environment variables are set correctly
