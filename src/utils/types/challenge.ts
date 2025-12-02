import { Code, Globe, GraduationCap, Lock, SearchCode, Shield, Star } from "lucide-react"
import { ProductType } from "./store"

export const challengeCategories: ChallengeCategories[] = [
  "Web Security",
  "Reverse Engineering",
  "Forensics",
  "Binary Exploitation",
  "Cryptography",
  "Malware Analysis",
  "Cloud Security",
  "IoT Security",
  "OSINT",
  "Fundamentals"
]

export enum ChallengeCategoriesType {
  "OSINT" = "OSINT",
  "Web Security" = "Web Security",
  "Cryptography" = "Cryptography",
  "Forensics" = "Forensics",
  "Binary Exploitation" = "Binary Exploitation",
  "Reverse Engineering" = "Reverse Engineering",
  "Malware Analysis" = "Malware Analysis",
  "Cloud Security" = "Cloud Security",
  "IoT Security" = "IoT Security",
  "Fundamentals" = "Fundamentals"
}

export type ChallengeCategories =
  "OSINT" |
  "Web Security" |
  "Cryptography" |
  "Forensics" |
  "Binary Exploitation" |
  "Reverse Engineering" |
  "Malware Analysis" |
  "Cloud Security" |
  "IoT Security" |
  "Fundamentals"

export const difficulties = ["Fácil", "Médio", "Difícil", "Muito difícil"]

export const ChallengeCategoriesStyles = {
  "Web Security": {
    icon: Globe,
    color: "bg-emerald-600",
  },
  "Reverse Engineering": {
    icon: Code,
    color: "bg-purple-500",
  },
  "Forensics": {
    icon: Shield,
    color: "bg-green-500",
  },
  "Binary Exploitation": {
    icon: Lock,
    color: "bg-red-500",
  },
  "Cryptography": {
    icon: Star,
    color: "bg-yellow-500",
  },
  "Malware Analysis": {
    icon: Shield,
    color: "bg-orange-500",
  },
  "Cloud Security": {
    icon: Globe,
    color: "bg-cyan-500",
  },
  "IoT Security": {
    icon: Lock,
    color: "bg-teal-500",
  },
  "OSINT": {
    icon: SearchCode,
    color: "bg-pink-700",
  },
  "Fundamentals": {
    icon: GraduationCap,
    color: "bg-blue-400",
  }
}

export type UsedProductAtChallengeType = (Pick<ProductType, "name" | "price" | "action"> & { response: string, quantity: number})[]
export type ChallengeType = {
  id: string
  title: string
  description: string
  xp: number
  ruby: number
  xp_decay?: number
  ruby_decay?: number
  category: ChallengeCategories
  difficulty?: string
  hidden?: boolean
  max_attempts: number
  attempts: number
  link: string
  flag: string
  solved: boolean
  created_at?: string
  updated_at?: string
  flag_description: string,
  flag_tip: string,
  used_products: UsedProductAtChallengeType
}

export type ChallengeDashboardType = {
  id: string
  solved: boolean
  solved_date: string
  user_id: string
  attempts: number

  challenge: ChallengeType
}


export const defaultEmptyChallenge: Omit<ChallengeType, "id" | "solved" | "attempts"> = {
  title: "",
  description: "",
  xp: 1,
  ruby: 1,
  xp_decay: 0,
  category: "OSINT",
  difficulty: "Fácil",
  max_attempts: 1,
  link: "",
  flag: "",
  flag_description: "",
  flag_tip: "",
  hidden: true,
  used_products: []
}