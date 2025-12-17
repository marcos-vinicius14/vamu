export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (error, { event }) => {
        console.error('🔥🔥🔥 ERRO CRÍTICO CAPTURADO NO SERVIDOR 🔥🔥🔥')
        console.error('Mensagem:', error.message)
        console.error('Stack:', error.stack)
        if (event) {
            console.error('Rota:', event.path)
        }
        console.error('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥')
    })
})