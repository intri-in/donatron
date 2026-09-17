import { prisma } from "@/lib/prisma";
import { BetterAuthSessionObject } from "@/types/BetterAuth";

export async function addOrganisationToDatabase(name: string, session: BetterAuthSessionObject){
    if(!name) return
    if(!session) return
    const user = await prisma.organisation.create({
        data: {
            name: name,
            userId: session.user.id,
            address:"",
            email:"",
            phone:""
        },
    });

    return user

}