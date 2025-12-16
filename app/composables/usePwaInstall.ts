/**
 * PWA Install composable
 * Provides custom install prompt handling for better UX
 */

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export function usePwaInstall() {
    const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
    const canInstall = computed(() => deferredPrompt.value !== null)

    const installPwa = async () => {
        if (!deferredPrompt.value) return false

        await deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice

        // Clear the prompt after use
        deferredPrompt.value = null

        return outcome === 'accepted'
    }

    onMounted(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            deferredPrompt.value = e as BeforeInstallPromptEvent
        }

        window.addEventListener('beforeinstallprompt', handler)

        onUnmounted(() => {
            window.removeEventListener('beforeinstallprompt', handler)
        })
    })

    return {
        canInstall,
        installPwa
    }
}
