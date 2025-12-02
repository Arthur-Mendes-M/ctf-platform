export const RedirectReasons = {
    1: {
        title: "Sessão expirada",
        description: "Favor, realize o login novamente.",
        code: 401
    },
    2: {
        title: "Dados inconsistentes",
        description: "Favor, realize o login novamente.",
        code: 422 // Dados bem formatados mas impossíveis de processar logicamente
    }
}

export type ResponseStandard = {
    success: boolean
    data?: unknown
    message: string
}