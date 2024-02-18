import type Session from './models/session.model';

declare global {
  namespace Express {
    interface Locals {
      [k in string]: any;
      session: Session;
    }
  }
}
