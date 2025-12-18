import * as Sentry from "@sentry/vue";
import { useAuthClient } from "~/lib/auth-client";

export default defineNuxtPlugin((nuxtApp) => {
    const session = useAuthClient().useSession();

    watch(session, (newSession) => {
        if (!newSession?.data?.user) {
            Sentry.setUser(null);
            return;
        }

        Sentry.setUser({
            id: newSession.data.user.id,
            email: newSession.data.user.email,
            username: newSession.data.user.name,
        });
    }, { immediate: true });
});