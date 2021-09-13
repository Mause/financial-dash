import { VercelRequest, VercelResponse } from "@vercel/node";
import { IsString } from 'class-validator';

class DummyResponse {
  @IsString()
  id: string;
  
  constructor(id: string) {
    this.id = id;
  }
}

function Authenticated() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async (req: VercelRequest, res: VercelResponse) => {
      if ((req as any).user) {
        return await original(req, res);
      } else {
        res.status(401).send("Unauthorized");
      }
    };
  };
}

class ClassTest {
  @Authenticated()
  invoke(req: VercelRequest, res: VercelResponse) {
    res.status(200).send(new DummyResponse("hello"));
  }
}

export const responseShape = DummyResponse.name;

export default (req: VercelRequest, res: VercelResponse) =>
  new ClassTest().invoke(req, res);
