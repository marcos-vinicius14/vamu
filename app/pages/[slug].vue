<script setup lang="ts">
import { z } from 'zod'
import { formatPhone, isValidPhone } from '~/utils/phone'
import type { EventResponse } from '~/types'

const route = useRoute()
const slug = route.params.slug as string
const toast = useToast()

const { data: event, error } = await useFetch<EventResponse>(`/api/events/${slug}`)

if (error.value || !event.value) {
    throw createError({ statusCode: 404, statusMessage: 'Evento não encontrado.' })
}

useSeoMeta({
    title: event.value!.title,
    description: `Convite para ${event.value!.title} em ${new Date(event.value!.date).toLocaleDateString()} - ${event.value!.location}`,
    ogTitle: event.value!.title,
    ogDescription: `Convite para ${event.value!.title} em ${new Date(event.value!.date).toLocaleDateString()} - ${event.value!.location}`,
})

const rsvpName = ref('')
const rsvpPhone = ref('')
const loading = ref(false)
const rsvpSuccess = ref(false)
const rsvpStatus = ref<'CONFIRMED' | 'DECLINED' | null>(null)

watch(rsvpPhone, (val) => {
    if (!val) return
    const formatted = formatPhone(val)
    if (formatted !== val) {
        rsvpPhone.value = formatted
    }
})

const submitRsvp = async (status: 'CONFIRMED' | 'DECLINED') => {
    if (!rsvpName.value) {
        toast.add({ title: 'Por favor, digite seu nome', color: 'error' })
        return
    }

    if (!rsvpPhone.value) {
        toast.add({ title: 'Por favor, digite seu telefone', color: 'error' })
        return
    }

    if (!isValidPhone(rsvpPhone.value)) {
        toast.add({ title: 'Por favor, digite um telefone válido', color: 'error' })
        return
    }

    loading.value = true
    try {
        await $fetch('/api/rsvp', {
            method: 'POST',
            body: {
                eventId: event.value?.id,
                name: rsvpName.value,
                phoneNumber: rsvpPhone.value || undefined,
                status
            }
        })

        rsvpStatus.value = status
        rsvpSuccess.value = true
        rsvpName.value = ''
        rsvpPhone.value = ''

        if (status === 'CONFIRMED') {
            toast.add({ title: 'Presença confirmada!', color: 'success' })
            return
        }

        toast.add({ title: 'Resposta registrada com sucesso', color: 'neutral' })

    } catch (error: any) {
        const msg = error.data?.message || error.statusMessage || "Ocorreu um erro inesperado.";
        toast.add({
            title: 'Ops! Algo deu errado 😕',
            description: msg,
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
    } finally {
        loading.value = false
    }
}

const shareOnWhatsApp = () => {
    if (!event.value) return 
    const text = `Vamos? ${event.value.title} \n📅 ${new Date(event.value.date).toLocaleDateString()} \n📍 ${event.value.location} \n\nConfirme aqui: ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
        <div class="max-w-md mx-auto space-y-8">
            
            <!-- Event Card -->
            <div v-if="event" class="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 text-center space-y-6">
                <div class="space-y-2">
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ event.title }}</h1>
                    <p v-if="event.description" class="text-gray-500 dark:text-gray-400">{{ event.description }}</p>
                </div>

                <div class="flex flex-col gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <div class="flex items-center justify-center gap-2">
                        <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                        {{ new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' }) }}
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                        {{ event.location }}
                    </div>
                </div>

                <!-- Viral Share Button -->
                <UButton 
                    icon="i-heroicons-share" 
                    color="success" 
                    variant="soft" 
                    block 
                    size="lg"
                    @click="shareOnWhatsApp"
                >
                    Convidar Amigos via WhatsApp
                </UButton>
            </div>

            <!-- RSVP Section -->
            <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm rounded-3xl">
                <!-- Success State -->
                <div v-if="rsvpSuccess" class="py-8 text-center space-y-4 animate-fade-in">
                    <template v-if="rsvpStatus === 'CONFIRMED'">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UIcon name="i-heroicons-check" class="w-8 h-8" />
                        </div>
                        <p class="text-lg font-medium text-gray-900 dark:text-white">Oba! 🎉</p>
                    </template>
                    <template v-else>
                        <p class="text-gray-500 dark:text-gray-400">Que pena... 😢 Sua resposta foi enviada ao anfitrião.</p>
                    </template>

                    <UButton @click="rsvpSuccess = false" color="neutral" variant="ghost" size="sm">Enviar outra resposta</UButton>
                </div>

                <!-- Form State -->
                <div v-else class="space-y-4">
                    <UInput v-model="rsvpName" placeholder="Seu Nome Completo" size="xl" icon="i-heroicons-user" />
                    <UInput 
                        v-model="rsvpPhone" 
                        placeholder="(11) 99999-9999" 
                        size="xl" 
                        icon="i-heroicons-phone" 
                        :maxlength="15"
                        type="tel"
                        @keypress="(e: KeyboardEvent) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }"
                    />
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <UButton 
                            @click="submitRsvp('CONFIRMED')" 
                            :loading="loading" 
                            type="button" 
                            color="neutral" 
                            variant="solid" 
                            block 
                            size="xl" 
                            label="Confirmar Presença 🥳"
                            :ui="{ base: 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' }" 
                        />

                        <UButton 
                            @click="submitRsvp('DECLINED')" 
                            :loading="loading" 
                            type="button"
                            color="neutral" 
                            variant="subtle" 
                            block 
                            size="xl" 
                            label="Não poderei ir" 
                        />
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
