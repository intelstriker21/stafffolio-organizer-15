
// Simple password hashing utility
// In a production app, you would use a more robust library like bcrypt 
// through a secure backend service

/**
 * Creates a hash of the provided password
 * This is a simple implementation - in production use a proper hashing library
 */
export const hashPassword = (password: string): string => {
  // Simple hashing (not for production use)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

/**
 * Verifies if the provided password matches the stored hash
 */
export const verifyPassword = (password: string, storedHash: string): boolean => {
  const hashedPassword = hashPassword(password);
  console.log("Provided password:", password);
  console.log("Hashed password:", hashedPassword);
  console.log("Stored hash:", storedHash);
  return hashedPassword === storedHash;
};

