import { auth } from '@/lib/auth';
import logMessageforAPI from '@/lib/helpers/log';
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
const LOG_PREFIX= "api/sign-up/admin/finalise"
export async function POST(req:any) {
    //First we check if there are any users in the database.
    const allUsers =   await prisma.user.findMany().catch(e =>{
        console.error(`${LOG_PREFIX} allUsers`, e)
    })
    const allowed = !(allUsers && Array.isArray(allUsers) && allUsers.length>1)
    if(allUsers) logMessageforAPI(LOG_PREFIX, allUsers.length)
    
    if(!allowed) return NextResponse.json({ success: false, data: { message: ''} }, {status: 401})

    const session = await auth.api.getSession({ headers: await headers() }).catch(e =>{
        console.log(LOG_PREFIX, e)
    });
    if(!session) return NextResponse.json({ success: false, data: { message: 'NOT_LOGGED_IN'} }, {status: 401})
    // User is logged in and is the only user in database. We now check if there is already an admin.
    const admin_users = await prisma.user.findUnique({where: {
        email: session.user.email,
        role: "admin"
    }}).catch(e =>{
        console.log(LOG_PREFIX, e)
    })
    logMessageforAPI(LOG_PREFIX, "admin_users")
    if(admin_users) return NextResponse.json({ success: false, data: { message: ''} }, {status: 401})

    // Now we assign the role.
    const updateUser = await prisma.user.update({
    where: { email: session.user.email},
    data: { role: "admin" },
    }).catch(e =>{
        console.log(LOG_PREFIX, e)
    })
    if(!updateUser) return NextResponse.json({ success: false, data: { message: ''} }, {status: 500})

    // console.log("updateUser" ,updateUser)
    return NextResponse.json({ success: allowed, data: { message: ''} }, {status: 200})
}