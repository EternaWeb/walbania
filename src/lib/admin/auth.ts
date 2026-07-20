import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";

const getAuthImplementation = createServerOnlyFn(() => import("./auth-impl.server"));

export const requireAdminSession = createServerOnlyFn(async () => {
  const auth = await getAuthImplementation();
  return auth.requireAdminSession();
});

export const setAdminNoIndexHeaders = createServerOnlyFn(async () => {
  const auth = await getAuthImplementation();
  auth.setAdminNoIndexHeaders();
});

export const getAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthImplementation();
  return auth.readAdminSessionStatus();
});

export const loginAdminFn = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(500) }))
  .handler(async ({ data }) => {
    const auth = await getAuthImplementation();
    return auth.loginAdmin(data.password);
  });

export const logoutAdminFn = createServerFn({ method: "POST" }).handler(async () => {
  const auth = await getAuthImplementation();
  return auth.logoutAdmin();
});

