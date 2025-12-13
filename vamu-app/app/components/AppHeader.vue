<script setup lang="ts">
import { useSession, signOut } from '~/lib/auth-client'

const session = useSession()
const router = useRouter()

const userItems = [
    [{
        label: 'Meus Eventos',
        icon: 'i-heroicons-calendar',
        to: '/dashboard'
    }, {
        label: 'Criar Novo',
        icon: 'i-heroicons-plus',
        to: '/create'
    }], 
    [{
        label: 'Sair',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        onSelect: async () => {
            await signOut()
            router.push('/auth')
        }
    }]
]
</script>

<template>
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <UContainer class="h-16 flex items-center justify-between">
            <!-- Logo -->
            <NuxtLink to="/dashboard" class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
                <div class="w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center justify-center text-lg">
                    V
                </div>
                Vamu
            </NuxtLink>

            <!-- User Menu -->
            <div v-if="session.data" class="flex items-center gap-4">
                <UDropdownMenu :items="userItems">
                    <UAvatar 
                        :src="session.data.user.image || undefined" 
                        :alt="session.data.user.name"
                        class="cursor-pointer ring-2 ring-gray-100 dark:ring-gray-800 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all"
                    />
                </UDropdownMenu>
            </div>
            
            <div v-else>
                 <UButton to="/auth" color="neutral" variant="ghost">Entrar</UButton>
            </div>
        </UContainer>
    </header>
</template>
