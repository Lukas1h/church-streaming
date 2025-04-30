# Use a minimal base image with Python (Alpine)
FROM python:3.11-alpine AS base

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Install Python dependencies
RUN pip install requests flask

# Copy the Python script and media files
COPY bk.py .
COPY fallback.jpg .
COPY fallback.png .

# Expose the HTTP server port
EXPOSE 80

# Start the Python monitor
CMD ["python", "bk.py"]