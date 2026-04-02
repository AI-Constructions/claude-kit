# API Specification

## Base URLs
- **Local:** http://localhost:8000
- **Staging:** <!-- add staging URL -->
- **Production:** <!-- add production URL -->

## Authentication
JWT Bearer token. All protected endpoints require `Authorization: Bearer <token>` header.

## API Prefix
`/api/v1`

## Standard Response Envelope
```json
{
  "data": { },
  "error": null
}
```

## Error Response
```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Endpoints
<!-- Document endpoints here as they're implemented -->
