export function generateSlug(title: string): string {
    const kebab = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const randomSuffix = Math.random().toString(36).substring(2, 6);

    return `${kebab}-${randomSuffix}`;
}
