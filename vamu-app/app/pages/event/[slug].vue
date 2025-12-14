<script setup lang="ts">
import { useEventPage } from '~/composables/useEventPage'

const route = useRoute()
const slug = route.params.slug as string

const {
  event,
  error,
  rsvpName,
  rsvpPhone,
  loading,
  rsvpSuccess,
  rsvpStatus,
  submitRsvp,
  resetRsvp,
  mapUrl,
  formattedDate,
  formattedTime,
} = await useEventPage(slug)

if (error.value || !event.value) {
  throw createError({ statusCode: 404, statusMessage: 'Evento não encontrado.' })
}

useSeoMeta({
  title: event.value.title,
  description: event.value.description,
  ogTitle: event.value.title,
  ogDescription: event.value.description,
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
    <div class="max-w-2xl mx-auto space-y-12">

      <div class="space-y-6">
        <div class="text-6xl select-none animate-fade-in">
          🎉
        </div>

        <div class="space-y-2">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {{ event?.title }}
          </h1>
          <div class="flex items-center gap-2 text-gray-500 font-medium">
            <span>Convite de</span>
            <span class="text-gray-900 dark:text-gray-300 font-semibold">{{ event?.user.name }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gray-100 dark:border-gray-800 py-8">
        <div class="flex items-start gap-4">
          <div class="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
            <UIcon name="i-heroicons-calendar" class="w-6 h-6" />
          </div>
          <div class="space-y-0.5">
            <div class="font-semibold text-gray-900 dark:text-white">Data</div>
            <div class="text-gray-700 dark:text-gray-300 capitalize">{{ formattedDate }}</div>
            <div class="text-sm text-gray-500 font-medium">{{ formattedTime }}</div>
          </div>
        </div>

        <div class="flex items-start gap-4" v-if="event?.location">
          <div class="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
            <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <div class="font-semibold text-gray-900 dark:text-white">Local</div>
            <div class="text-gray-700 dark:text-gray-300 break-words line-clamp-2 md:line-clamp-none">{{ event.location
            }}</div>
            <UButton :to="mapUrl" target="_blank" variant="link" color="neutral"
              icon="i-heroicons-arrow-top-right-on-square" size="xs" class="p-0 gap-1">
              Ver no Mapa
            </UButton>
          </div>
        </div>

      </div>

      <div v-if="event?.description"
        class="prose prose-lg dark:prose-invert prose-gray max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {{ event.description }}
      </div>

      <div class="pt-8 relative">
        <UCard class="shadow-lg ring-1 ring-gray-200 dark:ring-gray-800">
          <div class="mb-6 text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              Você vai?
              <span class="text-2xl">👋</span>
            </h3>
          </div>

          <!-- Success State -->
          <div v-if="rsvpSuccess" class="py-8 text-center space-y-4 animate-fade-in">
            <template v-if="rsvpStatus === 'CONFIRMED'">
              <div
                class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-check" class="w-8 h-8" />
              </div>
              <p class="text-lg font-medium text-gray-900 dark:text-white">Oba! 🎉</p>
            </template>
            <template v-else>
              <p class="text-gray-500 dark:text-gray-400">Que pena... 😢 Sua resposta foi enviada ao anfitrião.</p>
            </template>

            <UButton @click="resetRsvp" color="neutral" variant="ghost" size="sm">Enviar outra resposta
            </UButton>
          </div>

          <!-- Form State -->
          <div v-else class="space-y-4 max-w-md mx-auto">
            <UInput v-model="rsvpName" placeholder="Seu Nome Completo" size="xl" icon="i-heroicons-user" />
            <UInput v-model="rsvpPhone" placeholder="(11) 99999-9999" size="xl" icon="i-heroicons-phone" :maxlength="15"
              type="tel" @keypress="(e: KeyboardEvent) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }" />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <UButton @click="submitRsvp('CONFIRMED')" :loading="loading" type="button" color="neutral" variant="solid"
                block size="xl" label="Confirmar Presença 🥳"
                :ui="{ base: 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' }" />

              <UButton @click="submitRsvp('DECLINED')" :loading="loading" type="button" color="neutral" variant="subtle"
                block size="xl" label="Não poderei ir" />
            </div>
          </div>
        </UCard>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
