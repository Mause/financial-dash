import { factory } from "vercel-jwt-auth";
import { makeDecorator } from "./makeDecorator";

export const authenticate = factory(process.env.JWT_SECRET!);
export const Authenticate = makeDecorator(authenticate);
