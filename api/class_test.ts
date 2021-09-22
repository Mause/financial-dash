import { VercelRequest, VercelResponse } from "@vercel/node";
import { IsString } from "class-validator";
import { log, authenticate } from "../support";

class DummyResponse {
  @IsString()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

function Authenticated(): (
  _target: unknown,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async (req: VercelRequest, res: VercelResponse) => {
      log.info({ hello: "world" }, "Hello world");
      await authenticate(original)(req, res);
    };
  };
}

class ClassTest {
  @Authenticated()
  invoke(_req: VercelRequest, res: VercelResponse): void {
    res.status(200).send(new DummyResponse("hello"));
  }
}

export const responseShape = DummyResponse.name;

export default (req: VercelRequest, res: VercelResponse): void =>
  new ClassTest().invoke(req, res);
