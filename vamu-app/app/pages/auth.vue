<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { AuthMode } from '~/types'

const { items, state, loading, getSchema, onSubmit } = useAuth()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-8">

      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl">
            👋
          </div>
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bem-vindo ao Vamu
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Entre para criar ou gerenciar seus convites
        </p>
      </div>

      <UCard class="w-full shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
        <!-- Custom padding wrapper since body prop might be restricted -->
        <div class="p-6 sm:p-8">
          <UTabs :items="items" class="w-full mb-6" :ui="{
            list: 'bg-gray-100 dark:bg-gray-800',
            indicator: 'bg-white dark:bg-gray-900 shadow-sm',
            trigger: 'group flex-1 flex items-center justify-center gap-1.5 font-medium text-sm text-gray-500 dark:text-gray-400 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white'
          }">
            <template #form="{ item }">
              <UForm :schema="getSchema(item.key as AuthMode)" :state="state" class="space-y-5 mt-6"
                @submit="onSubmit(item.key as AuthMode)">
                <UFormField v-if="item.key === 'register'" label="Nome" name="name"
                  :ui="{ label: 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5' }">
                  <UInput v-model="state.name" icon="i-heroicons-user" placeholder="Seu nome" size="lg" color="neutral"
                    class="font-medium" />
                </UFormField>

                <UFormField label="Email" name="email"
                  :ui="{ label: 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5' }">
                  <UInput v-model="state.email" type="email" icon="i-heroicons-envelope" placeholder="email@exemplo.com"
                    size="lg" color="neutral" class="font-medium" />
                </UFormField>

                <UFormField label="Senha" name="password"
                  :ui="{ label: 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5' }">
                  <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" placeholder="••••••••"
                    size="lg" color="neutral" class="font-medium" />
                </UFormField>

                <div class="pt-2">
                  <UButton type="submit" block size="xl" color="neutral" variant="solid" :loading="loading"
                    class="font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                    {{ item.key === 'login' ? 'Entrar no App' : 'Criar Conta' }}
                  </UButton>
                </div>

                <p class="text-xs text-center text-gray-400 mt-6">
                  Seus dados estão seguros e criptografados.
                </p>

              </UForm>
            </template>
          </UTabs>
        </div>
      </UCard>
    </div>
  </div>
</template>