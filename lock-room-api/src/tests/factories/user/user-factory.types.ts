export type UserOverrides = {
  email?: string;
  password?: string;
};

export type UserFactoryResult = {
  cuid: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
