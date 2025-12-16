/**
 * PWA Update composable
 * Handles service worker update notifications using prompt strategy
 */
export function usePwaUpdate() {
    const needRefresh = ref(false)
    const offlineReady = ref(false)
    const updateSW = ref<((reloadPage?: boolean) => Promise<void>) | null>(null)

    const close = () => {
        offlineReady.value = false
        needRefresh.value = false
    }

    const updateServiceWorker = async () => {
        if (updateSW.value) {
            await updateSW.value(true)
        }
    }

    onMounted(async () => {
        try {
            const { useRegisterSW } = await import('virtual:pwa-register/vue')
            const { needRefresh: nr, offlineReady: or, updateServiceWorker: usw } = useRegisterSW({
                onRegistered(r: ServiceWorkerRegistration | undefined) {
                    console.log('SW Registered:', r)
                },
                onRegisterError(error: Error) {
                    console.error('SW registration error:', error)
                }
            })

            // Sync refs
            watch(nr, (val) => { needRefresh.value = val }, { immediate: true })
            watch(or, (val) => { offlineReady.value = val }, { immediate: true })
            updateSW.value = usw
        } catch {
            // PWA not available (dev mode without SW)
            console.log('PWA not available')
        }
    })

    return {
        needRefresh: readonly(needRefresh),
        offlineReady: readonly(offlineReady),
        updateServiceWorker,
        close
    }
}
