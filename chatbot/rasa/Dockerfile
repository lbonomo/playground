# Use the official Rasa image
FROM rasa/rasa:3.6.20-full

# Switch to root to install extra dependencies if needed
USER root

# Example: Install git or other system dependencies
# RUN apt-get update && apt-get install -y git

RUN pip install google-generativeai

# Switch back to non-root user for security
USER 1001
