<script setup lang="ts">
import { z } from 'zod'
import type { InferSelectModel } from 'drizzle-orm'
import { events, guests } from '~/../server/database/schemas/app'

definePageMeta({
    middleware: 'auth'
})

const route = useRoute()
const slug = route.params.slug as string
const toast = useToast()

type DashboardResponse = {
    event: InferSelectModel<typeof events>
    guests: InferSelectModel<typeof guests>[]
    stats: {
        totalGuests: number
        confirmedCount: number
        declinedCount: number
        pendingCount: number
    }
}

const { data: dashboard, error, status } = await useFetch<DashboardResponse>(`/api/events/${slug}/dashboard`)

if (error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Evento não encontrado' })
}

const search = ref('')

// Define guest type for type safety
type Guest = InferSelectModel<typeof guests>

const columns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'phoneNumber', header: 'Celular' },
    { accessorKey: 'status', header: 'Status' }
]

const filteredGuests = computed(() => {
    if (!search.value) return dashboard.value?.guests || []
    
    return dashboard.value?.guests.filter(guest => {
        return guest.name.toLowerCase().includes(search.value.toLowerCase()) ||
               guest.phoneNumber?.includes(search.value)
    }) || []
})

const shareOnWhatsApp = () => {
    const text = `Olá! Estou te convidando para o meu evento "${dashboard.value?.event.title}". Confirme sua presença aqui: ${window.location.origin}/${slug}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
}

const copyLink = () => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
    toast.add({ title: 'Link copiado!', color: 'success' })
}

const formatDate = (date: string | Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'CONFIRMED': return 'success'
        case 'DECLINED': return 'error'
        default: return 'neutral'
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'CONFIRMED': return 'Eu vou!'
        case 'DECLINED': return 'Eu não vou'
        case 'PENDING': return 'Pendente'
        default: return status
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <UContainer>
            <div v-if="status === 'pending'" class="flex justify-center py-12">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400" />
            </div>

            <div v-else-if="dashboard" class="space-y-6">
                <!-- Breadcrumbs -->
                 <UBreadcrumb :links="[{ label: 'Dashboard', to: '/dashboard' }, { label: dashboard.event.title }]" />

                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div class="flex items-center gap-4">
                            <UButton icon="i-heroicons-arrow-left" variant="ghost" color="neutral" to="/dashboard" class="hidden md:flex" />
                             <div>
                                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ dashboard.event.title }}</h1>
                                <p class="text-gray-500 flex items-center gap-1 mt-1">
                                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                                    {{ formatDate(dashboard.event.date.toString()) }}
                                </p>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Viral Section -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Divulgue seu evento! 🚀</h3>
                        <p class="text-sm text-gray-500">Compartilhe o link abaixo para seus convidados confirmarem presença.</p>
                    </template>
                    
                    <div class="flex flex-col sm:flex-row gap-3">
                        <UButton 
                            icon="i-simple-icons-whatsapp" 
                            color="primary" 
                            variant="solid" 
                            label="Enviar no WhatsApp"
                            block
                            @click="shareOnWhatsApp"
                        />
                         <UButton 
                            icon="i-heroicons-clipboard-document" 
                            color="neutral" 
                            variant="solid" 
                            label="Copiar Link"
                            block
                            @click="copyLink"
                        />
                    </div>
                </UCard>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UCard>
                        <div class="text-center">
                            <dt class="text-sm font-medium text-gray-500">Total Convidados</dt>
                            <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ dashboard.stats.totalGuests }}</dd>
                        </div>
                    </UCard>
                    <UCard>
                        <div class="text-center">
                            <dt class="text-sm font-medium text-green-500">Confirmados</dt>
                            <dd class="mt-1 text-3xl font-semibold text-green-600">{{ dashboard.stats.confirmedCount }}</dd>
                        </div>
                    </UCard>
                    <UCard>
                        <div class="text-center">
                            <dt class="text-sm font-medium text-red-500">Recusados</dt>
                            <dd class="mt-1 text-3xl font-semibold text-red-600">{{ dashboard.stats.declinedCount }}</dd>
                        </div>
                    </UCard>
                </div>

                <!-- Guest List -->
                <UCard :ui="{ body: 'p-0 sm:p-0' }">
                    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
                        <UInput 
                            v-model="search"
                            icon="i-heroicons-magnifying-glass"
                            placeholder="Buscar convidados..."
                            color="info"
                            :ui="{ trailing: 'pointer-events-auto' }"
                        >
                            <template #trailing>
                                <UKbd v-if="!search">K</UKbd>
                                <UButton
                                    v-else
                                    color="info"
                                    variant="link"
                                    icon="i-heroicons-x-mark"
                                    :padded="false"
                                    @click="search = ''"
                                />
                            </template>
                        </UInput>
                    </div>

                    <UTable :data="filteredGuests" :columns="columns">
                        <template #name-cell="{ row }">
                            <span class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</span>
                        </template>

                        <template #status-cell="{ row }">
                            <UBadge :color="getStatusColor(row.original.status ?? '')" variant="subtle">
                                {{ getStatusLabel(row.original.status ?? '') }}
                            </UBadge>
                        </template>
                    </UTable>
                    
                    <div v-if="filteredGuests.length === 0" class="p-8 text-center text-gray-500">
                        Nenhum convidado encontrado
                    </div>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>
