import { ProductActions, ProductType } from "./store"
import { RankingUserExamType } from "./user"

export type ExamType = {
    id: string,
    title: string,
    description: string,
    xp: number,
    ruby: number,
    category: ExamCategoryType,
    difficulty: ExamDifficultyType,
    hidden: boolean,
    grade: number,
    exercises: ExerciseType[],
    substitute_exercises: ExerciseType[],
    created_at: string,
    updated_at: string,
    starts_at: string,
    ends_at: string,
    solved: boolean,
    score?: number,

    used_products_exam?: UsedProductAtExamType[]
}
export type UsedProductAtExamType = (Pick<ProductType, "name" | "description" | "action" | "id"> & { response: UsedProductsAtExamResponseType, quantity: number})

export type RankingExamsType = {
    category: string
    description: string
    difficulty: ExamDifficultyType
    ends_at: string
    id: string
    ranking: RankingUserExamType[]
    starts_at: string
    title: string
}

// export type CreateAndUpdateExamType = ExamType & {
//     exercises: CreateAndUpdateExerciseType[],
// }

// export type CreateAndUpdateExerciseType = {
//     id?: string,
//     exercise_number: number,
//     exercise_type: ExamExerciseCategoryType,
//     exercise_tip: string,
//     question: string,
//     alternatives?: string[]
//     answer: string,
//     exercise_value: number,
// }

export type SubmitExamType = {
    answers: { exercise_id: string, answer: string }[]
}

export type ExamFilteredType = Pick<ExamType, "id" | "category" | "title" | "description" | "difficulty" | "ends_at" | "starts_at" | "xp" | "ruby" | "grade" | "solved"> & { exercises_quantity: number, finished_at?: string, initiated_at?: string, score?: number, ranking_position?: number }

export type ExamToCreateType = Pick<ExamType, "category" | "title" | "description" | "difficulty" | "ends_at" | "starts_at" | "xp" | "ruby" | "grade" | "hidden" | "exercises" | "substitute_exercises">

export type UsedProductsAtExamResponseType = string | ExerciseType | AlternativesExerciseType[]

export type AlternativesExerciseType = { letter: string, value: string }

export type ExerciseType = {
    id?: string,
    exercise_number: number,
    exercise_type: ExamExerciseCategoryType,
    exercise_tip: string,
    question: string,
    alternatives?: AlternativesExerciseType[]
    user_answer?: string
    answer: string,
    exercise_value: number,
    removed_alternatives?: AlternativesExerciseType[]
    
    used_products?: UsedProductAtExamType[],
    substitute_question?: Omit<ExerciseType, "substitute_question">
}

// export type UsedProductsType

export type ExamExerciseCategoryType =
    "alternativa" |
    "flag"

export type ExamCategoryType =
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

export type ExamDifficultyType =
    "Fácil" |
    "Médio" |
    "Difícil"

// {
//     id: '6895fd5306c2d348a4e8de91',
//     exercise_number: 3,
//     exercise_type: 'alternative',
//     exercise_tip: 'exercise_tip [number]',
//     question: 'qual a capital do brasil',
//     answer: 'XSS',
//     exercise_value: 2,
//     alternatives: null
//   },
//   {
//     id: '6895fd5306c2d348a4e8de92',
//     exercise_number: 4,
//     exercise_type: 'alternative',
//     exercise_tip: 'exercise_tip [number]',
//     question: 'qual a capital do brasil',
//     answer: 'sp',
//     exercise_value: 2,
//     alternatives: [ 'rj', 'mg', 'china' ]
//   },


//     {
//       id: '6895fd5306c2d348a4e8de94',
//       title: 'Cyber Security Test',
//       description: 'Prova para testar conhecimentos de cybersegurança',
//       xp: 100,
//       ruby: 100,
//       category: 'Forensis',
//       difficulty: 'easy',
//       hidden: false,
//       exam_duration: 60,
//       exam_value: 10,
//       exercises: [Array],
//       created_at: '2025-08-08T13:36:19.274Z',
//       updated_at: '2025-08-08T13:36:19.274Z'
//     }


export type ExamStatusType = "Em breve" | "Em andamento" | "Concluído" | "Não realizado"

export const getExamStatus = (exam: ExamType | ExamFilteredType): ExamStatusType => {
    const now = Date.now();
    const start = new Date(exam.starts_at).getTime();
    const end = new Date(exam.ends_at).getTime();
    const isSolved = exam.solved

    if (now < start && !isSolved) {
        return "Em breve"
    } else if (now >= start && now <= end && !isSolved) {
        return "Em andamento"
    } else if (isSolved) {
        return "Concluído"
    } else if (now > end && !isSolved) {
        return "Não realizado"
    }

    return "Não realizado"
}

export const productsToUseOnExam = [ProductActions.AddExamTime]
