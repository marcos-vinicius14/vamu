<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const toast = useToast()

interface EventResponse {
  id: string
  title: string
  date: string
  location: string | null
  description: string | null
  theme: string | null
  user: {
    name: string
  }
}

const { data: event, error } = await useFetch<EventResponse>(`/api/events/${slug}`)

if (error.value || !event.value) {
  throw createError({ statusCode: 404, statusMessage: 'Evento não encontrado.' })
}

useSeoMeta({
  title: event.value.title,
  description: event.value.description,
  ogTitle: event.value.title,
  ogDescription: event.value.description,
})

const rsvpName = ref('')
const rsvpPhone = ref('')
const loading = ref(false)

const submitRsvp = async (status: 'CONFIRMED' | 'DECLINED') => {
  if (!rsvpName.value) {
    toast.add({ title: 'Por favor, digite seu nome', color: 'error' })
    return
  }
  if (!rsvpPhone.value) {
    toast.add({ title: 'Por favor, digite seu telefone', color: 'error' })
    return
  }
  loading.value = true
  try {
    await $fetch('/api/rsvp', {
      method: 'POST',
      body: {
        eventId: event.value?.id,
        name: rsvpName.value,
        phoneNumber: rsvpPhone.value,
        status
      }
    })
    toast.add({ title: 'RSVP enviado com sucesso!', color: 'success' })
    rsvpName.value = '';
    rsvpPhone.value = '';

  } catch (e) {
    toast.add({ title: 'Erro ao enviar RSVP', color: 'error' })
  } finally {
    loading.value = false
  }
}

const mapUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.value?.location || '')}`)

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <UCard class="w-full shadow-xl ring-1 ring-gray-900/5 items-center">
        
        <!-- Header -->
        <div class="text-center space-y-4 mb-8">
             <div class="space-y-2">
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ event?.title ?? 'Título não informado.' }}</h1>
                <p class="text-sm text-gray-500">
                    Convite de <span class="font-medium text-primary-600">{{ event?.user.name ?? 'Usuário não informado.' }}</span>
                </p>
             </div>
             
             <div class="inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20">
                {{ formatDate(event?.date ?? 'Data não informada.') }}
             </div>
        </div>

        <UDivider class="my-6" />

        <!-- Details -->
        <div class="space-y-6">
            <div v-if="event?.description" class="prose prose-sm text-gray-600 text-center mx-auto">
                <p>{{ event.description }}</p>
            </div>

            <div v-if="event?.location" class="bg-gray-50 rounded-lg p-4 space-y-3">
                 <div class="flex items-start gap-3">
                    <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-400 mt-0.5" />
                    <div class="text-sm text-gray-700 font-medium break-words">{{ event.location }}</div>
                 </div>
                 <UButton :to="mapUrl" target="_blank" icon="i-heroicons-map" label="Abrir no Google Maps" block variant="outline" size="sm" />
            </div>
        </div>

        <UDivider class="my-6" />

        <!-- RSVP Form -->
        <div class="space-y-4">
             <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900">Você vai?</h3>
                <p class="text-sm text-gray-500">Confirme sua presença abaixo</p>
             </div>
             
             <div class="space-y-3">
                <UInput v-model="rsvpName" placeholder="Seu Nome Completo" size="lg" icon="i-heroicons-user" />
                <UInput v-model="rsvpPhone" placeholder="Seu Telefone (WhatsApp)" size="lg" icon="i-heroicons-phone" type="tel" />
                
                <div class="grid grid-cols-2 gap-3">
                    <UButton @click="submitRsvp('CONFIRMED')" :loading="loading" color="success" label="Eu Vou" block size="lg" icon="i-heroicons-check-circle" />
                    <UButton @click="submitRsvp('DECLINED')" :loading="loading" color="warning" variant="solid" label="Não Vou" block size="lg" icon="i-heroicons-x-circle" />
                </div>
             </div>
        </div>

      </UCard>
    </div>
  </div>
</template>
