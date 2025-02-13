import jwt from "jsonwebtoken";

export const generateToken = (id: number, tipo: string): string => {
  const secretKey = process.env.JWT_SECRET || "supersecretkey";
  return jwt.sign({ id, tipo }, secretKey, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  const secretKey = process.env.JWT_SECRET || "supersecretkey";
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Token inválido");
  }
};
