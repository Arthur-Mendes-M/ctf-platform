"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CreateUserType, CurrentSessionType, ROLES } from "../types/user"
import { ChallengeType } from "../types/challenge"
import { EditProductType, ProductType } from "../types/store"
import { ExamType } from "../types/exam"
import { withMiddleware } from "./_patterns"
// import { ExamType } from "../types/exam"

export async function verifyAdminAccess() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")

  if (!sessionCookie) {
    redirect("/")
  }

  // Em produção, validar JWT e verificar role
  const isAdmin = sessionCookie.value.includes(ROLES.ADMIN)

  if (!isAdmin) {
    throw new Error("Acesso negado. Apenas administradores podem realizar esta ação.")
  }

  return true
}

export async function createChallenge(challenge: Omit<ChallengeType, "attempts" | "solved" | "id">) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const createdChallenge = await fetch(`${process.env.API_URL}/${userInfo.user.role.toLowerCase()}/challenge`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        title: challenge.title,
        description: challenge.description,
        xp: challenge.xp,
        ruby: challenge.ruby,
        xp_decay: challenge?.xp_decay,
        ruby_decay: challenge?.ruby_decay,
        category: challenge.category,
        difficulty: challenge.difficulty,
        max_attempts: challenge.max_attempts,
        flag: challenge.flag,
        flag_description: challenge.flag_description,
        flag_tip: challenge.flag_tip,
        hidden: challenge.hidden,
      })
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdChallenge
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function updateChallenge(newChallengeData: Partial<ChallengeType>, challengeId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const createdChallenge = await fetch(`${process.env.API_URL}/admin/challenge/update/${challengeId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(newChallengeData)
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdChallenge
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function updateExam({ newExam, examId, }: {
  newExam: Partial<Pick<
    ExamType,
    | "title"
    | "description"
    | "category"
    | "difficulty"
    | "hidden"
    | "ruby"
    | "xp"
    | "starts_at"
    | "ends_at"
    | "exercises"
    | "substitute_exercises"
    | "review_allowed"
  >>
  examId: string
}) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const response = await fetch(`${process.env.API_URL}/exam/${examId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(newExam),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function createExam(completedExam: Pick<ExamType, "title" | "description" | "category" | "difficulty" | "hidden" | "ruby" | "xp" | "starts_at" | "ends_at" | "exercises" | "substitute_exercises">) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const createdExam = await fetch(`${process.env.API_URL}/exam`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({ ...completedExam })
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdExam
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}
export async function deleteExam(examId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const deletedExam = await fetch(`${process.env.API_URL}/exam/${examId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return deletedExam
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }

}

export async function updateExamVisibility(examId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const createdExam = await fetch(`${process.env.API_URL}/exam/update/${examId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdExam
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function updateChallengeVisibility(challengeId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const createdChallenge = await fetch(`${process.env.API_URL}/admin/challenge/${challengeId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdChallenge
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function createStoreItem(product: Omit<ProductType, "id">) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }


    const userInfo = JSON.parse(sessionCookie)

    const createdProduct = await fetch(`${process.env.API_URL}/product`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        max_purchases: product.max_purchases,
        hidden: product.hidden
      })
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdProduct
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function createUsers(users: CreateUserType[]) {
  users.forEach(user => {
    user.avatar_url = process.env.NEXT_PUBLIC_AVATAR_API_URL + user.name
  });
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }


    const userInfo = JSON.parse(sessionCookie)

    const createdUsers = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(users)
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdUsers
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function updateUser(user: Partial<CreateUserType>, userId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }


    const userInfo = JSON.parse(sessionCookie)
    // TODO: ATUALIZAR AQUI (USERINFO -> USERID)
    const updatedUser = await fetch(`${process.env.API_URL}/admin/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return updatedUser
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function updateProduct(product: Partial<EditProductType>, productId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    // TODO: ATUALIZAR AQUI (USERINFO -> USERID)
    const updatedProduct = await fetch(`${process.env.API_URL}/product/${productId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(product)
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return updatedProduct
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function deleteChallenge(challengeId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }


    const userInfo = JSON.parse(sessionCookie)

    const createdChallenge = await fetch(`${process.env.API_URL}/admin/challenge/${challengeId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return createdChallenge
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function deleteUser(userId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const deletedUser = await fetch(`${process.env.API_URL}/admin/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return deletedUser
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await verifyAdminAccess()

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const deletedProduct = await fetch(`${process.env.API_URL}/product/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return deletedProduct
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export const getAdminStats = withMiddleware(
  async ({ context }: { context: CurrentSessionType }) => {
    const apiResponse = await fetch(`${process.env.API_URL}/admin/dashboard`, {
      headers: {
        "Authorization": `Bearer ${context.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return apiResponse.data
  }
)