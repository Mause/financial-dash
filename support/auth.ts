import { factory } from "vercel-jwt-auth";

export default factory(process.env.JWT_SECRET!);
