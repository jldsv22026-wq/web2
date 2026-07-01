import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PROJECT_AUTH_COOKIE = "jlds_project_auth";

function getAuthSecret() {
  return (
    process.env.PROJECT_DASHBOARD_SECRET ||
    process.env.PROJECT_DASHBOARD_PASSWORD ||
    "local-project-dashboard-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createProjectSessionValue() {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `project-dashboard:${expires}`;

  return `${payload}.${sign(payload)}`;
}

export function verifyProjectSession(value?: string) {
  if (!value) {
    return false;
  }

  const separator = value.lastIndexOf(".");
  if (separator < 1) {
    return false;
  }

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const [, expiresValue] = payload.split(":");
  const expires = Number(expiresValue);

  if (!Number.isFinite(expires) || expires < Date.now()) {
    return false;
  }

  return safeCompare(sign(payload), signature);
}

export async function isProjectDashboardAuthenticated() {
  const cookieStore = await cookies();
  return verifyProjectSession(cookieStore.get(PROJECT_AUTH_COOKIE)?.value);
}

export function validateProjectCredentials(username: string, password: string) {
  const expectedUsername = process.env.PROJECT_DASHBOARD_USERNAME;
  const expectedPassword = process.env.PROJECT_DASHBOARD_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return safeCompare(username, expectedUsername) && safeCompare(password, expectedPassword);
}
