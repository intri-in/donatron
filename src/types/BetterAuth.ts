import { Session, User } from "better-auth";

export interface BetterAuthSessionObject{
    session: Session,
    user : BetterAuthUserType
}

interface BetterAuthUserType extends User{
    role: "admin" | "manager" | "user"

}

