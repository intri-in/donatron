import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

export const Roles = ["admin", "manager", "user"]
export const statement = { 
    ...defaultStatements,
    admin: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"],
    manager: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"],
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"],
    organisation:["create", "list-owned", "list-all",  "delete", "update"],
    receipt:["create", "list-owned", "list-all",  "delete", "update", "approve", "cancel", "print" ,"share", ""]
} as const; 

export const ac = createAccessControl(statement); 
export const admin = ac.newRole(statement)

export const manager = ac.newRole({ 
    user: [...statement.user],
    organisation: [...statement.organisation],
    receipt: [...statement.receipt]
}); 

export const user = ac.newRole({
    receipt: ["create", "list-owned"]
}); 


