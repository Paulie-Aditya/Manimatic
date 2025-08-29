# Use a minimal base Python image
FROM python:3.11-slim

# Install system dependencies for Manim, pycairo, and manimpango
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    pkg-config \
    python3-dev \
    ffmpeg \
    texlive-latex-base \
    pango1.0-tools \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Upgrade pip and install Python packages
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Set env vars
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Expose port for Cloud Run
EXPOSE 5000

# Start the Flask app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
