import { ChallengeDashboardType, ChallengeType } from "./challenge"
import { ProductType, PurchaseType } from "./store"
import { UserType } from "./user"

export type DashboardResponseType = {
    hidden_challenges: number
    correct_answers: number
    wrong_answers: number
    last_challenges: ChallengeType[]
    total_purchases: number
    last_purchases: ProductType[]
    position: number
}

export type CategoryListType = {
    name: string
    quantity: number
}

export type AdminDashboardResponseType = {
    users: UserType[]
    category_list: CategoryListType[]
    total_challenge: number
    total_transaction: number
    // xp_avg: number
}

export type UserDashboardResponseType = {
    last_purchases: PurchaseType[]
    last_challenges: ChallengeDashboardType[]
    available_challenges: number,
    correct_answers: number,
    position: number
}