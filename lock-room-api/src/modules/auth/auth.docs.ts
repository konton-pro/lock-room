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
            required: [
              "name",
              "email",
              "password",
              "encryptedMasterKey",
              "masterKeyIv",
              "masterKeyTag",
              "masterKeySalt",
              "recoveryEncryptedPayload",
              "recoveryIv",
              "recoveryTag",
              "recoveryKeyHash",
            ],
            properties: {
              name: { type: "string" as const, minLength: 1 },
              email: { type: "string" as const, format: "email" },
              password: { type: "string" as const, minLength: 8 },
              encryptedMasterKey: { type: "string" as const },
              masterKeyIv: { type: "string" as const },
              masterKeyTag: { type: "string" as const },
              masterKeySalt: { type: "string" as const },
              recoveryEncryptedPayload: { type: "string" as const },
              recoveryIv: { type: "string" as const },
              recoveryTag: { type: "string" as const },
              recoveryKeyHash: { type: "string" as const },
            },
          },
          example: {
            name: "John Doe",
            email: "user@example.com",
            password: "strongpassword123",
            encryptedMasterKey: "base64_master_key",
            masterKeyIv: "base64_iv",
            masterKeyTag: "base64_tag",
            masterKeySalt: "base64_salt",
            recoveryEncryptedPayload: "base64_payload",
            recoveryIv: "base64_iv",
            recoveryTag: "base64_tag",
            recoveryKeyHash: "sha256_hex",
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
    summary: "Login with session",
    description: "Authenticate and create an HttpOnly session cookie",
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
        description: "Authenticated user data",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                encryptedMasterKey: { type: "string" as const },
                masterKeyIv: { type: "string" as const },
                masterKeyTag: { type: "string" as const },
                masterKeySalt: { type: "string" as const },
              },
            },
            example: {
              name: "John Doe",
              encryptedMasterKey: "base64_master_key",
              masterKeyIv: "base64_iv",
              masterKeyTag: "base64_tag",
              masterKeySalt: "base64_salt",
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

export const logoutDocs = {
  detail: {
    tags: ["Auth"],
    summary: "Logout",
    description: "Invalidate active session and clear session cookie",
    security: [{ cookieAuth: [] }],
    responses: {
      204: { description: "Logged out" },
      401: { description: "Missing or invalid session" },
    },
  },
};
