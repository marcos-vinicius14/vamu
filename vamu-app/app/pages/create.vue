<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  middleware: 'auth'
})

const schema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  location: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: undefined,
  date: undefined,
  location: undefined,
  description: undefined
})

const loading = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const { slug } = await $fetch('/api/events/create', {
      method: 'POST',
      body: event.data
    })
    
    toast.add({ title: 'Evento criado com sucesso!', color: 'success' })
    await navigateTo(`/event/${slug}`)
  } catch (err: any) {
    toast.add({ title: 'Erro ao criar evento', description: err.data?.message || err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6">
    <div class="max-w-2xl mx-auto">
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
        
        <!-- Header / Title -->
        <div class="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          <UInput
            v-model="state.title"
            variant="none"
            placeholder="Nome do Evento"
            size="xl"
            class="p-0"
            :ui="{ 
                base: 'text-4xl font-extrabold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 p-0'
            }"
            autofocus
          />
        </div>

        <!-- Properties Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <UFormField label="Data" name="date" class="w-full" :ui="{ label: 'text-xs font-medium text-gray-500 uppercase tracking-wider mb-1' }">
            <UInput 
                v-model="state.date" 
                type="datetime-local" 
                icon="i-heroicons-calendar" 
                variant="outline"
                color="neutral"
                class="w-full" 
            />
          </UFormField>

          <UFormField label="Local" name="location" class="w-full" :ui="{ label: 'text-xs font-medium text-gray-500 uppercase tracking-wider mb-1' }">
            <UInput 
                v-model="state.location" 
                placeholder="Endereço ou Link" 
                icon="i-heroicons-map-pin" 
                variant="outline"
                color="neutral"
                class="w-full" 
            />
          </UFormField>
        </div>

        <!-- Description / Body -->
        <div class="space-y-4">
            <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-bars-3-bottom-left" class="w-5 h-5" />
                <span class="text-sm font-medium">Detalhes</span>
            </div>
            <UFormField name="description" class="w-full">
            <UTextarea 
                v-model="state.description" 
                variant="none" 
                placeholder="Digite os detalhes do evento aqui... O que vai acontecer?" 
                :rows="6"
                autoresize
                size="lg"
                class="w-full"
                :ui="{ 
                    base: 'text-gray-600 dark:text-gray-300 text-lg leading-relaxed p-0'
                }"
            />
            </UFormField>
        </div>

        <!-- Footer / Action -->
        <div class="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <UButton 
                type="submit" 
                size="xl" 
                color="neutral"
                variant="solid"
                :loading="loading"
                icon="i-heroicons-arrow-right"
                trailing
                class="w-full md:w-auto px-8"
                :ui="{ base: 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' }"
            >
            Criar Evento
            </UButton>
        </div>

      </UForm>
    </div>
  </div>
</template>
