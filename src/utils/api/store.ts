"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function purchaseItem(itemId: string, quantity: number) {
  // Verificar se o usuário está autenticado
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const storedItems = await fetch(`${process.env.API_URL}/product/buy`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      product_id: itemId,
      quantity
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return storedItems
}

export async function listStoreItems() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const storedItems = await fetch(`${process.env.API_URL}/product`, {
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return storedItems
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}

export async function getOwnedItems() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("ctf-session")?.value

    if (!sessionCookie) {
      redirect("/")
    }

    const userInfo = JSON.parse(sessionCookie)

    const inventoryItems = await fetch(`${process.env.API_URL}/user/inventory`, {
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => error)

    return inventoryItems
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor.",
    }
  }
}


// export const ProductActionsCallbacks: Record<ProductAction, ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => Promise<ResponseStandard>> = {
//   [ProductActions.MultiplyChallengeXp]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
//   [ProductActions.BuyChallengeAttempt]: buyChallengeAttempt,
//   [ProductActions.ExameGradeBoost]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
//   [ProductActions.ShowHalfChallengeAnswer]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
//   [ProductActions.ChallengeHint]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
//   [ProductActions.SwapExamQuestion]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
//   [ProductActions.RemoveExamAlternatives]: ({ challenge, product }: { challenge: ChallengeType, product: ProductType }) => { },
// };