import { ChallengeType } from "./challenge"
import { ExamFilteredType, ExamType } from "./exam"
import type { ProductType } from "./store"

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface RankingUser {
  name: string
  email: string
  xp: number
  ruby: number
  solved_challenges: ChallengeType[] | null
  solved_exams: ExamType[] | null
  avatar_url?: string
}

export interface RankingPodiumProps {
  topThree: RankingUser[]
  currentUserEmail: string
}

export type UserType = {
  id: string
  name: string
  email: string
  password: string
  ruby: number
  xp: number
  hidden: boolean
  role: ROLES
  inventory: ProductType[]
  created_at: string
  updated_at: string
  avatar_url?: string
}

export const defaultEmptyUser = {
  name: "",
  email: "",
  role: ROLES.USER,
  hidden: false,
}

export type CreateUserType = Pick<UserType, "name" | "email" | "role" | "hidden" | "avatar_url"> & { message?: string }

export type CurrentSessionType = {
  token: string
  user: {
    created_at: string
    email: string
    first_access: boolean
    id: string
    name: string
    role: ROLES
    ruby: number
    updated_at: string
    xp: number
    avatar_url?: string
  },
  // current_theme?: "dark" | "light",
  current_exam?: ExamFilteredType | ExamType
}

export type LoggedUserType = {
  created_at: string
  email: string
  first_access: boolean
  id: string
  name: string
  role: ROLES
  ruby: number
  updated_at: string
  xp: number
  avatar_url?: string
}

export interface ExamRankingPodiumProps {
  topThree: RankingUserExamType[]
  currentUserEmail: string
}

export type RankingUserExamType = {
  finished_at: string
  name: string
  email: string
  ranking_position: number
  ruby: number 
  score: number
  user_id: string
  xp: number
  avatar_url?: string
}