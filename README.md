# Supplier Compliance Monitor & Insights Dashboard

A FastAPI-based backend system for monitoring supplier compliance and generating AI-powered insights.

## Features

- Supplier management with compliance tracking
- AI-powered compliance analysis using OpenAI
- Detailed compliance records and history
- Automated insights and recommendations
- RESTful API with OpenAPI documentation

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up PostgreSQL database and update `.env` file with your credentials

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, visit `/docs` for the interactive API documentation.

## Environment Variables

Create a `.env` file with the following variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key

## API Endpoints

- `GET /suppliers`: List all suppliers
- `POST /suppliers`: Create a new supplier
- `GET /suppliers/{supplier_id}`: Get supplier details
- `POST /suppliers/check-compliance`: Check and record compliance
- `GET /suppliers/insights/{supplier_id}`: Get AI-generated insights