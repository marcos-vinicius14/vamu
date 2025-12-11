import { describe, test, expect } from "bun:test";
import { generateSlug } from "../server/utils/slug";

describe("generateSlug", () => {
    test("converts title to kebab-case with random suffix", () => {
        const slug = generateSlug("Meu Aniversário");
        expect(slug).toMatch(/^meu-aniversario-[a-z0-9]{4}$/);
    });

    test("produces unique slugs for same title", () => {
        const slug1 = generateSlug("Event Title");
        const slug2 = generateSlug("Event Title");
        expect(slug1).not.toBe(slug2);
        expect(slug1.substring(0, slug1.lastIndexOf('-'))).toBe(slug2.substring(0, slug2.lastIndexOf('-')));
    });

    test("handles special characters", () => {
        const slug = generateSlug("Café & Bar!");
        expect(slug).toMatch(/^cafe-bar-[a-z0-9]{4}$/);
    });
});
