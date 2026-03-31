export const registerDocs = {
  detail: {
    tags: ["Auth"],
    summary: "Register",
    description: "Create a new account",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 8 },
            },
          },
          example: {
            email: "user@example.com",
            password: "strongpassword123",
          },
        },
      },
    },
    responses: {
      201: {
        description: "Account created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string", format: "email" },
              },
            },
            example: {
              id: "tz4a98xxat96iws9zmbrgj3a",
              email: "user@example.com",
            },
          },
        },
      },
      409: { description: "Email already in use" },
      422: { description: "Validation error" },
      429: { description: "Too many requests" },
    },
  },
};

export const loginDocs = {
  detail: {
    tags: ["Auth"],
    summary: "Login",
    description: "Authenticate and receive a JWT token",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: { type: "string", format: "email" },
              password: { type: "string" },
            },
          },
          example: {
            email: "user@example.com",
            password: "strongpassword123",
          },
        },
      },
    },
    responses: {
      200: {
        description: "JWT token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: { type: "string" },
              },
            },
            example: {
              token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ejRhOTh4eGF0OTZpd3M5em1icmdqM2EifQ.signature",
            },
          },
        },
      },
      401: { description: "Invalid credentials" },
      422: { description: "Validation error" },
      429: { description: "Too many requests" },
    },
  },
};
