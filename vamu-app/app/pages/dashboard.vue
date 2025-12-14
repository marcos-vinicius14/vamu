<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

definePageMeta({
    middleware: 'auth'
})

const { myEvents, status, isEmpty, formatDate } = await useDashboard()
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
        <UContainer>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Meus Eventos</h1>
                    <p class="text-gray-500 mt-1">Gerencie seus eventos e acompanhe as confirmações.</p>
                </div>
                <UButton label="Novo Evento" icon="i-heroicons-plus" to="/create" size="lg" color="primary" />
            </div>

            <!-- Loading State -->
            <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard v-for="i in 3" :key="i">
                    <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
                </UCard>
            </div>

            <!-- Empty State -->
            <div v-else-if="isEmpty" class="text-center py-24">
                <div
                    class="bg-gray-100 dark:bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UIcon name="i-heroicons-calendar" class="w-12 h-12 text-gray-400" />
                </div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Você ainda não tem eventos</h2>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">Crie seu primeiro evento para começar a receber
                    confirmações de presença dos seus convidados.</p>
                <UButton label="Criar meu primeiro evento" to="/create" size="xl" />
            </div>

            <!-- Events Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard v-for="event in myEvents" :key="event.id" class="flex flex-col h-full">
                    <template #header>
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white truncate">{{ event.title }}</h3>
                    </template>

                    <div class="space-y-4">
                        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <UIcon name="i-heroicons-calendar" class="w-5 h-5 shrink-0" />
                            <span>{{ formatDate(event.date) }}</span>
                        </div>
                    </div>

                    <template #footer>
                        <UButton label="Gerenciar" :to="`/admin/${event.slug}`" block color="neutral" variant="soft" />
                    </template>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>