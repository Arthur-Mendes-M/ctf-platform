"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ChallengeType } from "../types/challenge"
import { ProductType } from "../types/store"
import { ResponseStandard } from "../types/_patterns"

export async function submitFlag(challengeId: string, flag: string, productId?: string) {
  // Verificar se o usuário está autenticado
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const answer = await fetch(`${process.env.API_URL}/user/challenge/answer`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      challenge_id: challengeId,
      flag,
      product_id: productId
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return answer
}

export async function initializeTerminal(challengeId: string) {
  // Verificar se o usuário está autenticado
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const terminalLink = await fetch(`${process.env.DOCKER_API_URL}/labs/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      userId: userInfo.user.id,
      challengeId: challengeId,
      image: "ttyd"
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return terminalLink
}

export async function increaseTerminalTimer(containerId: string) {
  // Verificar se o usuário está autenticado
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const increasedTimer = await fetch(`${process.env.DOCKER_API_URL}/labs/addHalfHour`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      containerId
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return increasedTimer
}

export async function deleteTerminal(containerId: string) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const deletedTimer = await fetch(`${process.env.DOCKER_API_URL}/labs/delete/${containerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    }
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return deletedTimer
}

export async function getAllChallenges() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)
  const challenges = await fetch(`${process.env.API_URL}/${userInfo.user.role.toLowerCase()}/challenge`, {
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    }
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return challenges.data || null
}

export async function deleteChallenge(id: string) {

  const user = await fetch(`${process.env.API_URL}/delete`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: id,
    })
  })
  if (!user) {
    return {
      success: false,
      message: "Falha ao procurar desafios"
    }
  }
  return user
}

export async function createChallenge(challengeInfo: Omit<ChallengeType, "id" | "difficulty" | "solved">) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value
  if (!sessionCookie) return []

  const userInfo = JSON.parse(sessionCookie)

  const challenge = await fetch(`${process.env.API_URL}/admin/challenge/create`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify(challengeInfo)
  })

  if (!challenge) {
    return {
      success: false,
      message: "Falha ao procurar desafios"
    }
  }

  return challenge
}

// export async function handleProductClick({challenge, product}: {challenge: ChallengeType, product: ProductType}) {
//   const actionCallback = ProductActionsCallbacks[product.action]

//   return actionCallback({challenge, product})
// }



export async function toUseChallengeProduct({ challenge, product }: { challenge: ChallengeType, product: ProductType }) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const apiResponse: ResponseStandard = await fetch(`${process.env.API_URL}/product/use-product/${product.id}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      challenge_id: challenge.id
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return apiResponse
}