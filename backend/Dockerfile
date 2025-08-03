# Use a minimal base Python image
FROM python:3.11-slim

# Install system dependencies for Manim
RUN apt-get update && apt-get install -y \
    ffmpeg \
    texlive-latex-base \
    libcairo2 \
    pango1.0-tools \
    git \
    && apt-get clean

# Set workdir
WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Set env vars
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port for Cloud Run
EXPOSE 8080

# Start the Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
