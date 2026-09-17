import { QUIZ_IDENTIFIER_LENGTH } from "#/defines/constants";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "../crypto";

export async function createQuizInDB(title: string, userId: string, status="draft", access="private"){
    const quiz = await prisma.quiz.create({
    data: {
        access:access,
        status:status,
        userId:userId,
        title: title,
    },
    });

    return quiz
}

