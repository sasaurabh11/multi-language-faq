# Multi-language-support Documentation

A Aplication built with Node.js, Express, MongoDB and Redis. The system includes automatic translate the texts.

## Features

- Create and manage FAQs with rich text formatting
- Automatic translation to multiple languages
- Rich text editor (Quill.js)
- Enhanced performance with Redis caching
- RESTful API for integration

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript
- **Database:** MongoDB
- **Cache:** Redis
- **Translation:** Google Translate API
- **Testing Framework:** Mocha, Chai

## Prerequisites

- **Node.js**
- **MongoDB**
- **Redis**

## Setup Instructions

### Local Development Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/sasaurabh11/multi-language-faq.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory, add the following details:

    ```text
    PORT=3000
    MONGO_URI=
    REDIS_URL=
    ```

4. Start the server:

    ```bash
    npm run dev
    ```

## API Endpoints Overview

### 1. Create Faq

- **Endpoint:** `POST /api/faqs`
- **Request Body:**

    ```json
    {
      "question": "What is the purpose of Node.js?",
      "answer": "Node.js is used to build scalable network applications."
    }
    ```

- **Response:** `201 Created`

---

### 2. Get FAQs

- **Endpoint:** `GET /api/faqs`
- **Query Parameters:**
  - `lang`: Language code (e.g., `'hi'` for Hindi, `'bn'` for Bengali)
- **Response:** `200 OK`

---

## Supported Languages

- **Hindi:** `hi`
- **Bengali:** `bn`
- **Spanish:** `es`
- **French:** `fr`
- **German:** `de`
- **Chinese:** `zh`
- **Arabic:** `ar`
- **Russian:** `ru`
- **Japanese:** `ja`
- **Portuguese:** `pt`

---

## Testing

To run the tests for the project:

```bash
npm test
