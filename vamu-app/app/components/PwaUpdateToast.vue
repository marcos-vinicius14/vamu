<script setup lang="ts">
const { needRefresh, offlineReady, updateServiceWorker, close } = usePwaUpdate()
</script>

<template>
    <Transition name="slide-up">
        <div v-if="needRefresh || offlineReady"
            class="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
            <div class="flex items-start gap-3">
                <div
                    class="shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UIcon v-if="offlineReady" name="i-heroicons-signal" class="w-5 h-5 text-primary-600" />
                    <UIcon v-else name="i-heroicons-arrow-path" class="w-5 h-5 text-primary-600" />
                </div>

                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ offlineReady ? 'App pronto para uso offline' : 'Nova versão disponível' }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                        {{ offlineReady ? 'Você pode usar o app sem internet.' : 'Clique para atualizar agora.' }}
                    </p>

                    <div class="flex items-center gap-2 mt-3">
                        <UButton v-if="needRefresh" size="xs" color="primary" @click="updateServiceWorker">
                            Atualizar
                        </UButton>
                        <UButton size="xs" color="neutral" variant="ghost" @click="close">
                            Fechar
                        </UButton>
                    </div>
                </div>

                <button @click="close"
                    class="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
