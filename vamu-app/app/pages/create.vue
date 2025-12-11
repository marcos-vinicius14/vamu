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
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <UCard class="w-full md:max-w-lg gap-4">
      <template #header>
        <h1 class="text-xl font-bold">Criar Evento</h1>
      </template>

      <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
        <UFormGroup label="Título" name="title" class="w-full">
          <UInput v-model="state.title" placeholder="Meu evento" class="w-full" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <UFormGroup label="Data e Hora" name="date" class="w-full">
            <UInput v-model="state.date" type="datetime-local" class="w-full" />
          </UFormGroup>

          <UFormGroup label="Localização" name="location" class="w-full">
            <UInput v-model="state.location" placeholder="Minha casa" class="w-full" />
          </UFormGroup>
        </div>

        <UFormGroup label="Descrição" name="description" class="w-full">
          <UTextarea v-model="state.description" placeholder="Detalhes sobre o evento..." class="w-full" />
        </UFormGroup>

        <UButton type="submit" block :loading="loading">
          Criar Evento
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
