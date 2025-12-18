<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

useSeoMeta({
  title: 'Vamu – Organize eventos sem caos',
  description: 'A maneira mais fácil de gerenciar listas de convidados, RSVPs e convites. Sem planilhas, sem estresse.',
  ogTitle: 'Vamu – Organize eventos sem caos',
  ogDescription: 'A maneira mais fácil de gerenciar listas de convidados, RSVPs e convites. Sem planilhas, sem estresse.',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Navbar -->
    <header class="border-b border-gray-200">
      <nav class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl">
          <div class="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-lg font-bold">
            V
          </div>
          Vamu
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth"
            class="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100">
            Entrar
          </NuxtLink>
          <NuxtLink to="/auth"
            class="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
            Começar Grátis
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="py-20 md:py-28 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Planejamento de eventos,<br />
            <span class="text-gray-400">simplificado.</span>
          </h1>

          <p class="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
            A maneira mais fácil de gerenciar listas de convidados, RSVPs e convites. Sem planilhas, sem
            estresse.
          </p>

          <div class="mt-10">
            <NuxtLink to="/auth"
              class="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-colors">
              Criar Evento Grátis
              <span class="text-lg">→</span>
            </NuxtLink>
          </div>

          <!-- Social Proof -->
          <div class="mt-12 flex items-center justify-center gap-3">
            <div class="flex -space-x-2">
              <div
                class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                🎉</div>
              <div
                class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                🎂</div>
              <div
                class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                💒</div>
            </div>
            <p class="text-sm text-gray-500">Confiado por <strong class="text-gray-700">1.000+</strong>
              anfitriões</p>
          </div>
        </div>
      </section>

      <!-- Value Proposition - Bento Grid -->
      <section class="py-16 px-4 bg-[#F7F7F5]">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">
            Por que escolher o Vamu?
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Card 1 -->
            <article class="bg-white border border-gray-200 rounded-lg p-6">
              <span class="text-3xl mb-4 block">⚡</span>
              <h3 class="font-semibold text-lg mb-2">Pronto em segundos</h3>
              <p class="text-gray-600 text-sm">
                Crie seu evento em menos de um minuto. Sem configurações complicadas.
              </p>
            </article>

            <!-- Card 2 -->
            <article class="bg-white border border-gray-200 rounded-lg p-6">
              <span class="text-3xl mb-4 block">📲</span>
              <h3 class="font-semibold text-lg mb-2">Compartilhe no WhatsApp</h3>
              <p class="text-gray-600 text-sm">
                Envie convites com um clique. Seus convidados confirmam direto pelo link.
              </p>
            </article>

            <!-- Card 3 -->
            <article class="bg-white border border-gray-200 rounded-lg p-6">
              <span class="text-3xl mb-4 block">👀</span>
              <h3 class="font-semibold text-lg mb-2">RSVP em tempo real</h3>
              <p class="text-gray-600 text-sm">
                Acompanhe confirmações e veja quem vai ao seu evento instantaneamente.
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="py-16 px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">
            Como funciona
          </h2>

          <div class="space-y-8">
            <!-- Step 1 -->
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 class="font-semibold text-lg">Crie seu evento</h3>
                <p class="text-gray-600 mt-1">
                  Adicione nome, data e descrição. Seu link exclusivo é gerado automaticamente.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 class="font-semibold text-lg">Compartilhe o link</h3>
                <p class="text-gray-600 mt-1">
                  Envie pelo WhatsApp, e-mail ou redes sociais. É só clicar para confirmar presença.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 class="font-semibold text-lg">Acompanhe os convidados</h3>
                <p class="text-gray-600 mt-1">
                  Veja em tempo real quem confirmou, quantos acompanhantes virão e muito mais.
                </p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-12 text-center">
            <NuxtLink to="/create"
              class="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-colors">
              Criar Meu Primeiro Evento
              <span class="text-lg">🚀</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 py-8 px-4 mt-auto">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Vamu. Todos os direitos reservados.
        </p>

        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Privacidade
          </NuxtLink>
          <NuxtLink to="/terms" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Termos
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
