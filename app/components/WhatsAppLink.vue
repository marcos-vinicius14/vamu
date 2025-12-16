<script setup lang="ts">
import { getWhatsAppUrl } from '~/utils/phone'

interface Props {
    phone: string
    message?: string
    compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    message: 'Olá, estou entrando em contato via Vamu. Vi que voce tem interesse em participar do evento.',
    compact: false,
})

const url = computed(() => getWhatsAppUrl(props.phone, props.message))
const hasPhone = computed(() => Boolean(props.phone?.trim()))
</script>

<template>
    <a v-if="hasPhone" :href="url" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 transition-colors">
        <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5" />
        <span v-if="!compact" class="text-sm font-medium">WhatsApp</span>
    </a>
</template>
