"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ExamType, productsToUseOnExam, SubmitExamType, UsedProductAtExamType } from "../types/exam"
import { ResponseStandard } from "../types/_patterns"
import { ProductType } from "../types/store"

export async function getAllExams() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ctf-session')?.value

    if (!sessionCookie) {
        redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const exams = await fetch(`${process.env.API_URL}/exam`, {
        headers: {
            "Authorization": `Bearer ${userInfo.token}`
        }
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)

    return exams.data || null
}

export async function getAllRankingExams () {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ctf-session')?.value

    if (!sessionCookie) {
        redirect('/')
    }

    const userInfo = JSON.parse(sessionCookie)

    const exams = await fetch(`${process.env.API_URL}/exam/ranking`,{
        headers: {
            "Authorization": `Bearer ${userInfo.token}`
        }
    })
        .then(response => response.json())
        .then(data => data)
        .then(error => error)
    
    return exams.data || null
}

export async function getFullExam(examId: string) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ctf-session')?.value

    if (!sessionCookie) {
        redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)
    const exam = await fetch(`${process.env.API_URL}/exam/${examId}`, {
        headers: {
            "Authorization": `Bearer ${userInfo.token}`
        },
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)
    
    return exam.data || null
}

export async function finishExam(answers: SubmitExamType, examId: string) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ctf-session')?.value

    if (!sessionCookie) {
        redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)
    const apiResponse = await fetch(`${process.env.API_URL}/exam/${examId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(answers)
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => error)

    return apiResponse
}

export async function toUseExamProduct({ exam, product, exerciseId }: { exam: ExamType, product: ProductType, exerciseId?: string }) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value
  
    if (!sessionCookie) {
      redirect("/")
    }
  
    const userInfo = JSON.parse(sessionCookie)
  
    type UsedProductExamType = ResponseStandard & {data: UsedProductAtExamType}
    const apiResponse: UsedProductExamType = await fetch(`${process.env.API_URL}/product/use-product-exam/${product.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        exam_id: exam.id,
        exercise_id: productsToUseOnExam.includes(product.action) ? null : exerciseId
      })
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)
      
    return apiResponse
}




