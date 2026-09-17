import logMessageforAPI from '@/lib/helpers/log';
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server';
export async function GET() {

    //First we check if there are any users in the database.
    const allUsers =   await prisma.user.findMany()
    const allowed = !(allUsers && Array.isArray(allUsers) && allUsers.length>0)
    logMessageforAPI("api/sign-up/super-admin allUsers.length", allUsers.length )
    const status = allowed ? 200: 401
    return NextResponse.json({ success: allowed, data: { message: ''} }, {status: status})
}