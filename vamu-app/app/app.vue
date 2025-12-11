<template>
  <div class="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
    <h1 class="text-4xl font-bold text-primary-500">Vamu! 🚀</h1>

    <UCard>
      <template #header>
        <span class="font-bold">Teste de UI</span>
      </template>

      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Ambiente rodando com Bun + Nuxt UI + Drizzle
      </p>

      <UButton icon="i-heroicons-rocket-launch" color="primary" variant="solid">
        Tudo Pronto
      </UButton>
    </UCard>
  </div>
</template>