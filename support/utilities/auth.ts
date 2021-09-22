import { factory } from "vercel-jwt-auth";
import { makeDecorator } from ".";

export const authenticate = factory(process.env.JWT_SECRET!);
export const Authenticate = makeDecorator(authenticate);
