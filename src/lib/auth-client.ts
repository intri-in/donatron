// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
import { genericOAuthClient } from "better-auth/client/plugins"
import { getBaseURL } from "./helpers/env";
import { ac, admin, user, manager} from "@/lib/permissions"
import { emailOTPClient } from "better-auth/client/plugins"
let plugins = [
        adminClient({
            ac,
            roles: {
                admin,
                manager,
                user,
            }
        }),
        genericOAuthClient(),
        emailOTPClient() 
]

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: plugins,
  
});

export const { signIn, signUp, signOut, useSession } = authClient;