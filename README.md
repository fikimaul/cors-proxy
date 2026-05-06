# CORS Proxy

A simple CORS proxy server that allows you to bypass CORS restrictions when making cross-origin requests.

## Features

- Forwards HTTP and HTTPS requests
- Adds CORS headers to responses
- Lightweight and easy to deploy

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```

The proxy will be available at `http://localhost:3000`

To proxy a request, use:

```
http://localhost:3000/?url=https://example.com/api/endpoint
```

## Deployment

Deploy to Vercel with one click:

```bash
vercel
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## License

MIT
