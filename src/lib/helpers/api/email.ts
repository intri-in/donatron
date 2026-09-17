import { readFileSync } from "fs";
import path from 'path';
import { getAppName } from "../settings";
import logMessageforAPI from "../log";
const rootDir = process.cwd();
function getEmailOTPTemplatePath(): string{

    
    const emailOTPTemplatePath = path.join(rootDir,"templates","otpEmail.html")
    return emailOTPTemplatePath

}
function getEmailVerifcationTemplatePath(): string{

    
    const emailOTPTemplatePath = path.join(rootDir,"templates","verificationEmail.html")
    return emailOTPTemplatePath

}
export function sendEmail( receipt_email:string, subject:string, textHTML:string): Promise<boolean> {
    const nodemailer = require('nodemailer');

    return new Promise( (resolve, reject) => {
        try{
            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                  user: process.env.SMTP_USERNAME,
                  pass: process.env.SMTP_PASSWORD,
                },
              });
        
              var message = {
                from: process.env.SMTP_USERNAME,
                to: receipt_email,
                subject: subject,
                html: textHTML,
              };
              transporter.sendMail(message, (err:any, info:any) => {
                if (err) {
                    console.error('sendEmail Error occurred. ' + err.message);
                    return resolve(false)
                }
                //console.log('Message sent: %s', info);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                return resolve(true)
            })
           }catch(e)
           {
            console.error("sendEmail", e)
            return resolve(false)
           }
        
    })
    
}


export async function sendLoginOTPEmail(email:string, otp : string){
    const emailBody =  readFileSync(getEmailOTPTemplatePath()).toString()
    const appName = getAppName()
    let newStr = emailBody.replaceAll("{{OTP_CODE}}", otp);
    newStr = newStr.replaceAll("{{app_name}}",appName)
    const subject = `OTP Verification – ${otp} is your OTP to login to ${appName}`
    // logMessageforAPI("sendLoginOTPEmail",subject)
    // console.log(newStr)
    const result = await sendEmail(email, subject, newStr) 
    if(!result) throw new Error("Can't send email.")

}

export async function sendVerificationEmail(
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    }, 
    url:string, 
    token:string){

        const emailBody =  readFileSync(getEmailVerifcationTemplatePath()).toString()
        const appName = getAppName()
        let newStr = emailBody.replaceAll("{{verification_url}}", url);
        newStr = newStr.replaceAll("{{app_name}}",appName)
        // console.log("newStr", newStr)
        const subject = `${appName}  – Please verify your email`
        const result = await sendEmail(user.email, subject, newStr )
        if(!result) throw new Error("Can't send email.")

}