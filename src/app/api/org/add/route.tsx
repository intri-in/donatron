import { auth } from '@/lib/auth';
import { addOrganisationToDatabase } from '@/lib/helpers/api/db/db_org';
import logMessageforAPI from '@/lib/helpers/log';
import { prisma } from '@/lib/prisma'
import { BetterAuthSessionObject } from '@/types/BetterAuth';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const LOG_PREFIX= "api/org/add"


export async function POST(request: NextRequest) {
    const body = await request.json().catch(e =>{
        logMessageforAPI(LOG_PREFIX, e, "error")
    });
   
    if(!body)  return NextResponse.json({ success: false, data: { message: 'BAD_REQUEST'} }, {status: 400})
    const { name } = body;
    if(!name) return NextResponse.json({ success: false, data: { message: 'BAD_REQUEST'} }, {status: 400})

    const session = await auth.api.getSession({ headers: await headers() }).catch(e =>{
        console.log(LOG_PREFIX, e)
    });
    if(!session) return NextResponse.json({ success: false, data: { message: 'NOT_LOGGED_IN'} }, {status: 401})
    const canAddOrg = await auth.api.userHasPermission({
        body: {
        role:(session as BetterAuthSessionObject).user.role,
        permissions: {
            organisation: ["create"],
        },
        },
    })
    if(!canAddOrg) {
        logMessageforAPI(LOG_PREFIX, "canAddOrg is empty", "error")
        return NextResponse.json({ success: false, data: { message: 'ERROR_GENERIC'}}, {status: 500})
    }

    if(!canAddOrg.success) return NextResponse.json({ success: false, data: { message: 'ERROR_USER_DOESNT_HAVE_PERMISSION'} }, {status: 401})
    
    const org = await addOrganisationToDatabase(name, session as BetterAuthSessionObject)
    if(!org) return NextResponse.json({ success: false, data: { message: 'ERROR_GENERIC', data: "org object empty"}}, {status: 500})
    
    return NextResponse.json({ success: true, data: { message: '', data: {name: org.name, id: org.id }} }, {status: 201})
}