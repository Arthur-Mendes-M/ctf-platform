import { AArrowUp, Axe, Binary, CircleFadingArrowUp, ClockPlus, Flame, HandCoins, HeartPlus, Lightbulb, ListChecks, Replace, Rocket, SignpostBig, StarHalf, Wrench, type LucideIcon } from "lucide-react"
import { UserType } from "./user"
import { ChallengeType } from "./challenge"
import { ExamType } from "./exam"

export type PurchaseType = {
  product: ProductType
  quantity: number
  price: number
  created_at: string
  updated_at: string
}

export type PackageAtProductType = {
  package_name: PackagesNames,
  package_quantity: number
}

export type ProductType = {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategories
  action: ProductActions
  max_purchases: number
  hidden: boolean
  created_at?: string
  updated_at?: string
  packages: PackageAtProductType[] | null
}


export type PackagesNames = "basic" | "initial" | "starter"
export enum PackagesNamesEnum {
  "Pacote de recursos" = "starter",
  "Kit de apoio" = "basic",
  "Pacote de impulso" = "initial",
}

export enum PackagesReverseNamesEnum {
  "starter" = "Pacote de recursos",
  "basic" = "Kit de apoio",
  "initial" = "Pacote de impulso",
}

export const PackagesStyles = {
  [PackagesNamesEnum["Kit de apoio"]]: {
    icon: Rocket,
    color: "bg-red-500 text-white ",
  },
  [PackagesNamesEnum["Pacote de impulso"]]: {
    icon: CircleFadingArrowUp,
    color: "bg-emerald-500 text-white",
  },
  [PackagesNamesEnum["Pacote de recursos"]]: {
    icon: Wrench,
    color: "bg-blue-500 text-white ",
  },
}

export type EditProductType = Pick<ProductType, "max_purchases" | "hidden" | "price" | "packages">

export type InventoryList = PurchaseType[]

export type StoreItemsListType = ProductType[]

export type StoreGridProps = {
  items: ProductType[]
  user: Pick<UserType, "ruby">,
  inventory: InventoryList
}


export const productCategories: ProductCategories[] = [
  "Power-ups",
  "Hacks Permitidos",
  "Recursos de Campo",
  "Ferramentas de Sobrevivência"
]

export enum ProductCategoriesType {
  "Power-ups" = "Power-ups",
  "Hacks Permitidos" = "Hacks Permitidos",
  "Recursos de Campo" = "Recursos de Campo",
  "Ferramentas de Sobrevivência" = "Ferramentas de Sobrevivência"
}

export type ProductCategories =
  "Power-ups" |
  "Hacks Permitidos" |
  "Recursos de Campo" |
  "Ferramentas de Sobrevivência"


export const ProductCategoriesStyles = {
  "Power-ups": {
    icon: Flame,
    color: "bg-red-500",
  },
  "Hacks Permitidos": {
    icon: Binary,
    color: "bg-green-500",
  },
  "Recursos de Campo": {
    icon: SignpostBig,
    color: "bg-blue-500",
  },
  "Ferramentas de Sobrevivência": {
    icon: Axe,
    color: "bg-purple-500",
  },
}

// - challenge_multiply_xp
// - challenge_buy_attempt
// - exam_grade_boost
// - challenge_show_half_flag
// - challenge_hint
// - exam_swap_question
// - exam_remove_alternatives

export enum ProductActions {
  MultiplyChallengeXp = "challenge_multiply_xp",
  BuyChallengeAttempt = "challenge_buy_attempt",
  ExameGradeBoost = "exam_grade_boost",
  ShowHalfChallengeAnswer = "challenge_show_half_flag",
  AddExamTime = "exam_add_time",
  ChallengeHint = "challenge_hint",
  ExamHint = "exam_hint",
  SwapExamQuestion = "exam_swap_question",
  RemoveExamAlternatives = "exam_remove_alternatives",
}

export type ProductAction = `${ProductActions}`;

export const productActions: ProductAction[] = [
  ProductActions.MultiplyChallengeXp,
  ProductActions.BuyChallengeAttempt,
  ProductActions.ExameGradeBoost,
  ProductActions.ShowHalfChallengeAnswer,
  ProductActions.ChallengeHint,
  ProductActions.SwapExamQuestion,
  ProductActions.RemoveExamAlternatives,
  ProductActions.ExamHint,
  ProductActions.AddExamTime,
];

export const ProductActionsStyles: Record<ProductAction, { icon: LucideIcon; color: string }> = {
  [ProductActions.MultiplyChallengeXp]: {
    icon: HandCoins,
    color: "bg-emerald-500",
  },
  [ProductActions.BuyChallengeAttempt]: {
    icon: HeartPlus,
    color: "bg-sky-500",
  },
  [ProductActions.ExameGradeBoost]: {
    icon: AArrowUp,
    color: "bg-violet-500",
  },
  [ProductActions.ShowHalfChallengeAnswer]: {
    icon: StarHalf,
    color: "bg-orange-500",
  },
  [ProductActions.ChallengeHint]: {
    icon: Lightbulb,
    color: "bg-lime-500",
  },
  [ProductActions.SwapExamQuestion]: {
    icon: Replace,
    color: "bg-cyan-500",
  },
  [ProductActions.RemoveExamAlternatives]: {
    icon: ListChecks,
    color: "bg-yellow-500",
  },
  [ProductActions.ExamHint]: {
    icon: Lightbulb,
    color: "bg-yellow-500",
  },
  [ProductActions.AddExamTime]: {
    icon: ClockPlus,
    color: "bg-green-500",
  },
};

// export type ProductActionsResponses = {
//   // [ProductActions.MultiplyChallengeXp]: {data: },
//   [ProductActions.BuyChallengeAttempt]: ResponseStandard & {data: string},
//   [ProductActions.ExameGradeBoost]: {},
//   [ProductActions.ShowHalfChallengeAnswer]: {},
//   [ProductActions.ChallengeHint]: {},
//   [ProductActions.SwapExamQuestion]: {},
//   [ProductActions.RemoveExamAlternatives]: {},
// };


export const defaultEmptyProduct: Omit<ProductType, "id"> = {
  name: "",
  description: "",
  price: 1,
  category: ProductCategoriesType["Hacks Permitidos"],
  action: ProductActions.BuyChallengeAttempt,
  max_purchases: 1,
  hidden: true,
  packages: null
}


export type PackageProductType = (Pick<ProductType, "name" | "category" | "price" | "action"> & { quantity: number })

export type PackageData = {
  id: PackagesNames;
  name: PackagesNamesEnum;
  // icon: React.ComponentType<{ className?: string }>;
  // color: string;
  // products: {
  //   name: string,
  //   quantity: number,
  //   category: string,
  //   price: number
  // }[];

  products: PackageProductType[]
  description: string;
}




export function getChallengesAvailableInventory(currentChallenge: ChallengeType, inventory?: InventoryList) {
  if (currentChallenge.solved || !inventory) {
    return [];
  }

  if (
    !currentChallenge.solved &&
    currentChallenge.attempts == currentChallenge.max_attempts
  ) {
    return inventory
      ?.filter(
        (inventoryProduct) =>
          (inventoryProduct.product.action ===
            ProductActions.BuyChallengeAttempt) &&
          !inventoryProduct.product.action.includes("exam") &&
          !currentChallenge.used_products.some((usedProduct) => usedProduct.name === inventoryProduct.product.name )
      )
      .map((cleanInventory) => cleanInventory.product);
  }

  return inventory
    ?.filter(
      (inventoryProduct) =>
        inventoryProduct.product.action !==
        ProductActions.BuyChallengeAttempt &&
        !inventoryProduct.product.action.includes("exam") &&
        !currentChallenge.used_products.some((usedProduct) => usedProduct.name === inventoryProduct.product.name )
    )
    .map((cleanInventory) => cleanInventory.product);
}



export function getExamsAvailableInventory(currentExam: ExamType, inventory?: InventoryList) {
  if (currentExam.solved || !inventory) {
    return [];
  }

  return inventory.filter(inv => inv.product.action.includes("exam")).map((cleanInventory) => cleanInventory.product)

  // if (
  //   !currentExam.solved &&
  //   currentExam.attempts == currentExam.max_attempts
  // ) {
  //   return inventory
  //     ?.filter(
  //       (inventoryProduct) =>
  //         (inventoryProduct.product.action ===
  //           ProductActions.BuyChallengeAttempt) &&
  //         !inventoryProduct.product.action.includes("exam") &&
  //         !currentExam.used_products.some((usedProduct) => usedProduct.name === inventoryProduct.product.name )
  //     )
  //     .map((cleanInventory) => cleanInventory.product);
  // }

  // return inventory
  //   ?.filter(
  //     (inventoryProduct) =>
  //       inventoryProduct.product.action !==
  //       ProductActions.BuyChallengeAttempt &&
  //       !inventoryProduct.product.action.includes("exam") &&
  //       !currentExam.used_products.some((usedProduct) => usedProduct.name === inventoryProduct.product.name )
  //   )
  //   .map((cleanInventory) => cleanInventory.product);
}


