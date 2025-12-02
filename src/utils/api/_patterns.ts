import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectReasons } from "../types/_patterns";
import { CurrentSessionType } from "../types/user";

export const ROUTER_TO_BACK = "/";
export const COOKIES_SESSION_NAME = "ctf-session";

// export type CTF_CATEGORIES = "OSINT" |
//   "Web Security" |
//   "Cryptography" |
//   "Forensics" |
//   "Binary Exploitation" |
//   "Reverse Engineering" |
//   "Malware Analysis" |
//   "Cloud Security" |
//   "IoT Security" |
//   "Fundamentals"

// export type CTF_DIFFICULTIES = "Hard" | "Easy" | "Medium"

async function validateCallMiddleware(): Promise<CurrentSessionType> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIES_SESSION_NAME)?.value;
  const sessionData: CurrentSessionType | null = sessionCookie ? JSON.parse(sessionCookie) : null
  let redirectReasonCode: number | null = null

  if (!sessionCookie || !sessionData) {
    redirectReasonCode = RedirectReasons[1].code
    redirect(`${ROUTER_TO_BACK}?redirect=${redirectReasonCode}`);

    // TODO: jogar para uma função auxiliar de validações básicas (? junto com zod ?)
  } else if (!sessionData.token || !sessionData.user || !sessionData.user.id || !sessionData.user.role) {
    redirectReasonCode = RedirectReasons[2].code

    redirect(`${ROUTER_TO_BACK}?redirect=${redirectReasonCode}`);
  }

  return sessionData
}

export function withMiddleware<
  P extends Record<string, unknown>,
  R
>(
  fn: ({params, context}: {params: P, context: CurrentSessionType}) => Promise<R>
) {
  return async (params: P): Promise<R> => {
    const context = await validateCallMiddleware()
    return fn({params, context})
  }
}