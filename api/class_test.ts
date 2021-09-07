import { VercelRequest, VercelResponse } from "@vercel/node";

function Authenticated() {
  return (descriptor) => {
    return descriptor();
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
