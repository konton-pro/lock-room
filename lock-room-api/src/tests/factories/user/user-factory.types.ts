export type UserOverrides = {
  name?: string;
  email?: string;
  password?: string;
};

export type UserFactoryResult = {
  cuid: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
