import { VercelRequest, VercelResponse } from "@vercel/node";
import { IsString } from "class-validator";
import {
  Authenticate,
  CatchErrors,
  CatchValidationErrors,
} from "../support/utilities";

class DummyResponse {
  @IsString()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

class ClassTest {
  @Authenticate()
  @CatchValidationErrors()
  @CatchErrors()
  invoke(_req: VercelRequest, res: VercelResponse) {
    res.status(200).send(new DummyResponse("hello"));
  }
}

export const responseShape = DummyResponse.name;

export default (req: VercelRequest, res: VercelResponse): void =>
  new ClassTest().invoke(req, res);
