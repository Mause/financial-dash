import { VercelRequest, VercelResponse } from "@vercel/node";

class ClassTest {
  invoke(req: VercelRequest, res: VercelResponse) {
    res.status(200).send("hello");
  }
}

export default (res, req) => new ClassTest().invoke(req, res);
