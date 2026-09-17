import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins"
import { genericOAuth } from "better-auth/plugins"
// If your Prisma file is located elsewhere, you can change the path
import {prisma} from '@/lib/prisma'
import {  getIfEmailSignupEnabledServerSide, getMinimumPasswordLengthServerSide, getOTPLength } from "./helpers/env";
import { ac, admin, manager, user } from "@/lib/permissions"
import { emailOTP } from "better-auth/plugins"
import { sendEmail, sendLoginOTPEmail, sendVerificationEmail } from "./helpers/api/email";
import { getDefaultRoleSetting } from "./helpers/settings";

let plugins = [
        adminPlugin({
            ac,
            defaultRole:getDefaultRoleSetting(),
            roles: {
                admin,
                manager,
                user
            }
        }),
        genericOAuth(
                    {
                        config:[
                            {
                                providerId:"AUTHENTIK",
                                clientId: process.env.AUTHENTIK_CLIENT_ID!,
                                clientSecret:process.env.AUTHENTIK_CLIENT_SECRET!,
                                discoveryUrl:process.env.AUTHENTIK_DISCOVERY_URL!,
                            }
                        ]
                    }
            ),
        emailOTP({ 
        otpLength: getOTPLength(),
        storeOTP: "hashed",
        disableSignUp:true,
        async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                    sendLoginOTPEmail(email, otp)
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    // Send the OTP for password reset
                } 
            }, 
        }) 
]
// console.log("process.env.OAUTH_ENABLED_PROVIDERS", process.env.OAUTH_ENABLED_PROVIDERS, )
let emailAndPasswordEnabled = getIfEmailSignupEnabledServerSide()
if(process.env.OAUTH_ENABLED_PROVIDERS){
    const parsedProviders =  JSON.parse(process.env.OAUTH_ENABLED_PROVIDERS!)
    if(Array.isArray(parsedProviders))
    for(const i in parsedProviders){
        // switch(parsedProviders[i]){

        //     case "EMAIL":
        //         emailAndPasswordEnabled=true
        //         break;
        //     case :
        //         plugins.push()
        //         break;
        // }
        
    }
}
export const auth = betterAuth({
    trustedOrigins: process.env.CORS_TRUSTED_ORIGINS ? JSON.parse(process.env.CORS_TRUSTED_ORIGINS) : [],
    database: prismaAdapter(prisma, {
        provider: (process.env.DB_DIALECT && (process.env.DB_DIALECT =="postgresql" || process.env.DB_DIALECT =="mysql" || process.env.DB_DIALECT =="sqlite")) ? process.env.DB_DIALECT: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
        enabled: emailAndPasswordEnabled, 
        minPasswordLength:getMinimumPasswordLengthServerSide()
    }, 
    plugins: plugins,
    rateLimit: {
        enabled: false,
        storage: "database",
        modelName: "rateLimit", //optional by default "rateLimit" is used
        customRules: {
        "/sign-in/email-otp": {
            window: 10,
            max: 3,
        },
        "/two-factor/*": async (request)=> {
            // custom function to return rate limit window and max
            return {
                window: 10,
                max: 3,
            }
        }
        },
    },
    emailVerification: {
    // This function is triggered whenever verification is needed
    sendVerificationEmail: async ({ user, url, token }, request) => {
        // Use your preferred email service (e.g., Resend, Mailgun)
        // console.log(user, token, url)
        sendVerificationEmail(user, url, token);
    },
    sendOnSignUp: true, // Automatically send email after registration
},
    
});