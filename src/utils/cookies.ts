"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CurrentSessionType } from "./types/user"
import { ExamFilteredType } from "./types/exam"
import { DeepPartial } from "./typescript.utils"

export async function getUserSession(): Promise<CurrentSessionType> {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("ctf-session")

        if (!sessionCookie) {
            redirect("/")
        }

        // Em produção, validar o token JWT e buscar dados do usuário
        // Mock data com diferentes roles para demonstração
        // const userData = JSON.parse(sessionCookie.value).user
        const userData = JSON.parse(sessionCookie.value)

        return userData
    } catch {
        redirect("/")
    }
}

export async function updateUserSession(newUserData: DeepPartial<CurrentSessionType>) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")

    if (!sessionCookie) {
        redirect("/")
    }

    const userData = JSON.parse(sessionCookie.value)

    const dataToSave: CurrentSessionType = {
        token: userData.token,
        user: {
            ...userData.user,
            ...newUserData.user
        },
        current_exam: newUserData.current_exam || userData.current_exam,
        // current_theme: newUserData.current_theme || userData.current_theme,
    }

    const sessionData = JSON.stringify(dataToSave)

    cookieStore.set("ctf-session", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 dia
    })

    return true
}

export async function getCurrentUserExam(): Promise<ExamFilteredType> {

    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("ctf-session")

        if (!sessionCookie) {
            redirect("/")
        }

        const currentExamData = JSON.parse(sessionCookie.value).current_exam

        if(!currentExamData) {
            redirect("/")
        }

        return currentExamData
    } catch {        
        redirect("/")
    }
}