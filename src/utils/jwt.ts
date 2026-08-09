
import jwt, { SignOptions } from "jsonwebtoken";

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id, role }, secret, options);
};

export default generateToken;