"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation"
import { PackagesNames } from "../types/store";
import { updateUserSession } from "../cookies";

export async function getUsersByXp() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) return []
  const userInfo = JSON.parse(sessionCookie)

  const ranking = await fetch(`${process.env.API_URL}/ranking`,
    {
      headers: {
        "Authorization": `Bearer ${userInfo.token}`
      }
    }
  ).then(response => {
    if (response.status === 401) {
      cookieStore.delete("ctf-session")
      redirect("/")
    }

    return response.json()
  })
    .catch((error) => {
      return {
        success: false,
        data: null,
        message: error.message
      }
    })

  if (!ranking.success) {
    return {
      success: false,
      data: null,
      message: ranking.message
    }
  }

  return ranking
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const data = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then(response => {
      if (response.status === 401) {
        cookieStore.delete("ctf-session")
        redirect("/")
      }

      return response.json()
    })
    .catch(error => {
      return {
        success: false,
        message: error.message
      }
    })

  if (!data?.success) {
    return {
      success: false,
      message: data.message || "Credenciais inválidas. Tente novamente.",
    }
  }

  // Criar sessão segura
  const cookieStore = await cookies()

  // Em produção, usar JWT com secret seguro
  const sessionToken = JSON.stringify(data.data)

  cookieStore.set("ctf-session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 dia
  })

  if(data.data.user.first_access) {
    redirect("/first")
  } else {
    redirect("/dashboard")
  } 
}

export async function resetPassword(formData: FormData) {
  const cookieStore = await cookies()
  const email = formData.get("email") as string

  const data = await fetch(`${process.env.API_URL}/auth/send-email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email
    })
  })
    .then(response => {
      if (response.status === 401) {
        cookieStore.delete("ctf-session")
        redirect("/")
      }

      return response.json()
    })
    .then(data => data)
    .catch(error => {
      return {
        success: false,
        message: error.message
      }
    })

  return data
}

export async function loggedResetPassword(formData: FormData) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }
  const userInfo = JSON.parse(sessionCookie)

  const newPassword = formData.get("new-password") as string
  const currentPassword = formData.get("current-password") as string

  const data = await fetch(`${process.env.API_URL}/auth/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      password: currentPassword,
      new_password: newPassword
    })
  })
    .then(response => {
      if (response.status === 401) {
        cookieStore.delete("ctf-session")
        redirect("/")
      }

      return response.json()
    })
    .then(data => data)
    .catch(error => {
      return {
        success: false,
        message: error.message
      }
    })

  return data
}

export async function logoutUser() {
  const cookieStore = await cookies()

  // Remover o cookie de sessão
  cookieStore.delete("ctf-session")

  redirect("/")
}

export async function getUserStats() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) redirect("/")

  const userInfo = JSON.parse(sessionCookie)

  const data = await fetch(`${process.env.API_URL}/user/dashboard`, {
    headers: {
      "Authorization": `Bearer ${userInfo.token}`,
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => data)
    .catch(error => {
      return {
        success: false,
        message: error.message
      }
    })

  return data.data
}

export async function getPackages() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const initialInventory = await fetch(`${process.env.API_URL}/product/initial`, {
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    }
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  return initialInventory.data
}

export async function saveInitialInventory(packageName: PackagesNames) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }

  const userInfo = JSON.parse(sessionCookie)

  const initialInventory = await fetch(`${process.env.API_URL}/product/initiate/${packageName}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    }
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => error)

  if (initialInventory.success) {
    await updateUserSession({
      user: {
        first_access: false
      }
    }).then(() => {
      redirect("/dashboard")
    })
  }

  return initialInventory
}

export async function createTicket (formData: FormData) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("ctf-session")?.value

  if (!sessionCookie) {
    redirect("/")
  }
  const userInfo = JSON.parse(sessionCookie)

  const data = await fetch(`${process.env.API_URL}/support`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${userInfo.token}`
    },
    body: JSON.stringify({
      subject: (formData.get("subject") as string).trim(),
      message: (formData.get("description") as string).trim()
    })
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      return {
        success: false,
        message: error.message
      }
    })

  return data
}