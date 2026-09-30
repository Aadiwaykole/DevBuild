import crypto from "crypto";

const ENCRYPTION_KEY = process.env.GITHUB_TOKEN_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("GITHUB_TOKEN_ENCRYPTION_KEY is not defined");
}

const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

if (KEY.length !== 32) {
  throw new Error(
    "GITHUB_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes"
  );
}

const ALGORITHM = "aes-256-gcm";

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted token format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}