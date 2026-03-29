export const registerDocs = {
  detail: {
    tags: ["Auth"],
    summary: "Register",
    description: "Create a new account",
    responses: {
      201: { description: "Account created" },
      409: { description: "Email already in use" },
    },
  },
};

export const loginDocs = {
  detail: {
    tags: ["Auth"],
    summary: "Login",
    description: "Authenticate and receive a JWT token",
    responses: {
      200: { description: "JWT token" },
      401: { description: "Invalid credentials" },
    },
  },
};
