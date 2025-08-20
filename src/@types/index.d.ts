import { User } from "./ser.type"


export { }

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}