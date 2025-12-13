
export const formatPhone = (value: string) => {
    if (!value) return ''

    const digits = value.replace(/\D/g, '')

    const limited = digits.slice(0, 11)

    if (limited.length <= 2) {
        return `(${limited}`
    }
    if (limited.length <= 7) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    }
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
}

export const isValidPhone = (value: string) => {
    if (!value) return false
    const digits = value.replace(/\D/g, '')
    return digits.length === 11
}
