
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

export const getWhatsAppUrl = (phone: string, text?: string): string => {
    const digits = phone.replace(/\D/g, '')

    // Assume Brazil (+55) if number is 10-11 digits (local format)
    const fullNumber = digits.length <= 11 ? `55${digits}` : digits

    const baseUrl = `https://wa.me/${fullNumber}`
    return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl
}
