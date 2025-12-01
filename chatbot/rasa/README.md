# Rasa Chatbot with Docker

This project is a Rasa chatbot setup running completely within Docker.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

Check Rasa version:
```bash
docker compose run --rm rasa --version
```

### 1. Initialize the Project

Since this is a fresh setup, you first need to generate the initial Rasa project files. Run the following command:

```bash
docker compose run --rm rasa init --no-prompt
```

This will populate your directory with the standard Rasa project structure (domain, config, data, models, etc.).

### 2. Train the Model

To train your Rasa model using the data in `data/`:

```bash
docker compose run --rm rasa train
```

### 3. Run the Rasa Server

To start the Rasa server (which includes the API and the ability to connect channels):

```bash
docker compose up
```

The server will be available at `http://localhost:5005`.

### 4. Talk to the Bot (Shell)

To interact with your bot directly in the terminal:

```bash
docker compose run --rm rasa shell
```

## Project Structure

- **Dockerfile**: Defines the Rasa environment.
- **docker-compose.yml**: Orchestrates the Rasa service and volume mappings.
- **data/**: Contains NLU and stories data.
- **config.yml**: Configuration for NLU and Core policies.
- **domain.yml**: Defines the bot's domain (intents, entities, slots, responses).
