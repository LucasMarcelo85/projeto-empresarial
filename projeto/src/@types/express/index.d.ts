// @types/express/index.d.ts
import { User } from "../../pages/dash_agenda";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      user_id?: string;
    }
  }
}

export {};
