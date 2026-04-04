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
            type: "object" as const,
            required: ["name", "email", "password"],
            properties: {
              name: { type: "string" as const, minLength: 1 },
              email: { type: "string" as const, format: "email" },
              password: { type: "string" as const, minLength: 8 },
            },
          },
          example: {
            name: "John Doe",
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
              type: "object" as const,
              properties: {
                id: { type: "string" as const },
                email: { type: "string" as const, format: "email" },
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
            type: "object" as const,
            required: ["email", "password"],
            properties: {
              email: { type: "string" as const, format: "email" },
              password: { type: "string" as const },
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
              type: "object" as const,
              properties: {
                token: { type: "string" as const },
              },
            },
            example: {
              token:
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ejRhOTh4eGF0OTZpd3M5em1icmdqM2EifQ.signature",
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
