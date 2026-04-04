const security = [{ bearerAuth: [] }];

export const storeVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Store vault item",
    description:
      "Store a client-encrypted item. The server applies an additional AES-256-GCM encryption layer on top of the client-provided ciphertext.",
    security,
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object" as const,
            required: ["encryptedHeader", "encryptedBody", "clientIv"],
            properties: {
              encryptedHeader: {
                type: "string" as const,
                description: "Client-side encrypted header (base64)",
              },
              encryptedBody: {
                type: "string" as const,
                description: "Client-side encrypted body (base64)",
              },
              clientIv: {
                type: "string" as const,
                description: "Client-side IV used for encryption (base64)",
              },
            },
          },
          example: {
            encryptedHeader: "U2FsdGVkX1+base64encodedheader==",
            encryptedBody: "U2FsdGVkX1+base64encodedbody==",
            clientIv: "AAAAAAAAAAAAAAAA",
          },
        },
      },
    },
    responses: {
      201: {
        description: "Item stored",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                cuid: { type: "string" as const },
              },
            },
            example: {
              cuid: "tz4a98xxat96iws9zmbrgj3a",
            },
          },
        },
      },
      401: { description: "Missing or invalid token" },
      422: { description: "Validation error" },
    },
  },
};

export const retrieveVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Retrieve vault item",
    description:
      "Retrieve a vault item with the server-side encryption layer removed. The response contains the original client-encrypted ciphertext.",
    security,
    responses: {
      200: {
        description: "Client-encrypted item",
        content: {
          "application/json": {
            schema: {
              type: "object" as const,
              properties: {
                cuid: { type: "string" as const },
                encryptedHeader: {
                  type: "string" as const,
                  description: "Client-side encrypted header (base64)",
                },
                encryptedBody: {
                  type: "string" as const,
                  description: "Client-side encrypted body (base64)",
                },
                clientIv: {
                  type: "string" as const,
                  description: "Client-side IV (base64)",
                },
                createdAt: { type: "string" as const, format: "date-time" },
              },
            },
            example: {
              cuid: "tz4a98xxat96iws9zmbrgj3a",
              encryptedHeader: "U2FsdGVkX1+base64encodedheader==",
              encryptedBody: "U2FsdGVkX1+base64encodedbody==",
              clientIv: "AAAAAAAAAAAAAAAA",
              createdAt: "2024-01-01T00:00:00.000Z",
            },
          },
        },
      },
      401: { description: "Missing or invalid token" },
      403: { description: "Access denied" },
      404: { description: "Item not found" },
    },
  },
};

export const listVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "List vault items",
    description:
      "List all vault item headers belonging to the authenticated user. Bodies are not included — fetch individually via GET /vault/:id.",
    security,
    responses: {
      200: {
        description: "List of client-encrypted headers",
        content: {
          "application/json": {
            schema: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  cuid: { type: "string" as const },
                  encryptedHeader: {
                    type: "string" as const,
                    description: "Client-side encrypted header (base64)",
                  },
                  clientIv: {
                    type: "string" as const,
                    description: "Client-side IV (base64)",
                  },
                  createdAt: { type: "string" as const, format: "date-time" },
                },
              },
            },
            example: [
              {
                cuid: "tz4a98xxat96iws9zmbrgj3a",
                encryptedHeader: "U2FsdGVkX1+base64encodedheader==",
                clientIv: "AAAAAAAAAAAAAAAA",
                createdAt: "2024-01-01T00:00:00.000Z",
              },
            ],
          },
        },
      },
      401: { description: "Missing or invalid token" },
    },
  },
};

export const deleteVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Delete vault item",
    description:
      "Permanently delete a vault item. This action cannot be undone.",
    security,
    responses: {
      204: { description: "Item deleted" },
      401: { description: "Missing or invalid token" },
      403: { description: "Access denied" },
      404: { description: "Item not found" },
    },
  },
};
