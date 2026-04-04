const security = [{ bearerAuth: [] }];

const base64Field = {
  type: "string" as const,
  description: "Base64-encoded",
};

export const storeRecoveryDocs = {
  detail: {
    tags: ["Recovery"],
    summary: "Store recovery key",
    description:
      "Store a client-encrypted recovery payload. The client encrypts its master key with a recovery key and sends the ciphertext. The server applies an additional AES-256-GCM layer. Replaces any existing recovery key.",
    security,
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object" as const,
            required: ["encryptedPayload", "iv", "tag", "recoveryKeyHash"],
            properties: {
              encryptedPayload: {
                ...base64Field,
                description: "Master key encrypted with recovery key (base64)",
              },
              iv: {
                ...base64Field,
                description: "IV used for recovery key encryption (base64)",
              },
              tag: {
                ...base64Field,
                description: "Auth tag from encryption (base64)",
              },
              recoveryKeyHash: {
                type: "string" as const,
                description: "SHA-256 hex hash of the recovery key",
                minLength: 64,
                maxLength: 64,
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: "Recovery key stored",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                cuid: { type: "string" as const },
              },
            },
          },
        },
      },
      401: { description: "Missing or invalid token" },
      422: { description: "Validation error" },
    },
  },
};

export const statusRecoveryDocs = {
  detail: {
    tags: ["Recovery"],
    summary: "Recovery key status",
    description:
      "Check whether the authenticated user has a recovery key configured.",
    security,
    responses: {
      200: {
        description: "Recovery key status",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                hasRecoveryKey: { type: "boolean" as const },
                createdAt: {
                  type: "string" as const,
                  format: "date-time",
                  nullable: true,
                },
              },
            },
            example: {
              hasRecoveryKey: true,
              createdAt: "2024-01-01T00:00:00.000Z",
            },
          },
        },
      },
      401: { description: "Missing or invalid token" },
    },
  },
};

export const verifyRecoveryDocs = {
  detail: {
    tags: ["Recovery"],
    summary: "Verify recovery key",
    description:
      "Validate a recovery key hash and return the encrypted payload (with server layer removed). The client can then decrypt it with the recovery key to obtain the master key.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object" as const,
            required: ["email", "recoveryKeyHash"],
            properties: {
              email: {
                type: "string" as const,
                format: "email",
              },
              recoveryKeyHash: {
                type: "string" as const,
                description: "SHA-256 hex hash of the recovery key",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Encrypted recovery payload",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                encryptedPayload: base64Field,
                iv: base64Field,
                tag: base64Field,
              },
            },
          },
        },
      },
      404: { description: "Invalid recovery key" },
      422: { description: "Validation error" },
      429: { description: "Too many requests" },
    },
  },
};

export const resetRecoveryDocs = {
  detail: {
    tags: ["Recovery"],
    summary: "Reset password with recovery key",
    description:
      "Reset the user password using a valid recovery key. The client must also provide a new encrypted recovery payload (re-encrypted with the new password-derived key).",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object" as const,
            required: [
              "email",
              "recoveryKeyHash",
              "newPassword",
              "newEncryptedPayload",
              "newIv",
              "newTag",
            ],
            properties: {
              email: {
                type: "string" as const,
                format: "email",
              },
              recoveryKeyHash: {
                type: "string" as const,
                description: "SHA-256 hex hash of the recovery key",
              },
              newPassword: {
                type: "string" as const,
                minLength: 8,
              },
              newEncryptedPayload: {
                ...base64Field,
                description: "Master key re-encrypted with new key (base64)",
              },
              newIv: {
                ...base64Field,
                description: "New IV (base64)",
              },
              newTag: {
                ...base64Field,
                description: "New auth tag (base64)",
              },
            },
          },
        },
      },
    },
    responses: {
      204: { description: "Password reset successful" },
      404: { description: "Invalid recovery key" },
      422: { description: "Validation error" },
      429: { description: "Too many requests" },
    },
  },
};
