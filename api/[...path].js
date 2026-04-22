import app, { ensureDbConnection } from '../server/index.js';

export default async function handler(req, res) {
  try {
    await ensureDbConnection();
  } catch (_error) {
    // The Express app's health/error routes already surface db readiness details.
  }

  return app(req, res);
}
