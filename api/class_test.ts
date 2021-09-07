import { VercelRequest, VercelResponse } from "@vercel/node";

function Authenticated() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async (req: VercelRequest, res: VercelResponse) => {
      if ((req as any).user) return await original(req, res);
      else {
        res.status(401).send("Unauthorized");
      }
    };
  };
}

class ClassTest {
  @Authenticated()
  invoke(req: VercelRequest, res: VercelResponse) {
    res.status(200).send("hello");
  }
}

export default (req: VercelRequest, res: VercelResponse) =>
  new ClassTest().invoke(req, res);
