const security = [{ bearerAuth: [] }];

export const storeVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Store vault item",
    description: "Store a client-encrypted item with an additional server-side encryption layer",
    security,
    responses: {
      201: { description: "Item stored" },
      401: { description: "Missing or invalid token" },
      422: { description: "Validation error" },
    },
  },
};

export const retrieveVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Retrieve vault item",
    description: "Retrieve a vault item with the server-side encryption layer removed",
    security,
    responses: {
      200: { description: "Client-encrypted item" },
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
    description: "List all vault item headers belonging to the authenticated user",
    security,
    responses: {
      200: { description: "List of client-encrypted headers" },
      401: { description: "Missing or invalid token" },
    },
  },
};

export const deleteVaultDocs = {
  detail: {
    tags: ["Vault"],
    summary: "Delete vault item",
    description: "Permanently delete a vault item",
    security,
    responses: {
      204: { description: "Item deleted" },
      401: { description: "Missing or invalid token" },
      403: { description: "Access denied" },
      404: { description: "Item not found" },
    },
  },
};
