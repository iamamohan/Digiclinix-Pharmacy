/**
 * Production Limitation Note:
 * This 60-second in-memory rate limiter is effective for development and single-instance deployments.
 * On Vercel / serverless deployments, in-memory state is not shared across isolated serverless instances.
 * For production persistence across serverless invocations, this can be upgraded to Upstash Redis.
 */
const resendCooldowns = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 60 seconds

export function checkResendCooldown(email: string): { allowed: boolean; remainingSeconds: number } {
  const normalizedEmail = email.toLowerCase().trim();
  const lastSent = resendCooldowns.get(normalizedEmail);
  const now = Date.now();

  if (lastSent && now - lastSent < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true, remainingSeconds: 0 };
}

export function setResendCooldown(email: string): void {
  const normalizedEmail = email.toLowerCase().trim();
  resendCooldowns.set(normalizedEmail, Date.now());
}
