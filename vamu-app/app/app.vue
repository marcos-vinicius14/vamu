<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ThemeToggle class="fixed top-4 right-4 z-50" />
    <UNotifications />
  </div>
</template>