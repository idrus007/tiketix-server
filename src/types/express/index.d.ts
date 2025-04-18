// types/express/index.d.ts

import { UserPayload } from "../UserPayload";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
