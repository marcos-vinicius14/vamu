<script setup lang="ts">
import { useSession, signOut } from '~/lib/auth-client'

const session = useSession()
const router = useRouter()

async function handleLogout() {
  await signOut()
  router.push('/auth')
}
</script>

<template>
  <div class="p-8">
    <div v-if="session.data" class="max-w-2xl mx-auto space-y-6">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Olá, {{ session.data.user.name }}! 👋</h1>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" @click="handleLogout">
              Sair
            </UButton>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300">
          Você está logado. Aqui ficarão seus eventos.
        </p>

        <div class="mt-6 flex justify-center">
          <UButton to="/create" size="xl" icon="i-heroicons-plus">
            Criar Novo Evento
          </UButton>
        </div>
      </UCard>
    </div>

    <div v-else class="text-center mt-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
      <p>Carregando sessão...</p>
    </div>
  </div>
</template>