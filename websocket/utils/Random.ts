export function generateRandomString(): string {
    return Math.random().toString(36).substring(2, 8); // Generates an 8-character string
}