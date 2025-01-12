<script setup lang="ts">
const { data: session, refetch, suspense } = useTrpcQuery(['auth.session']);
const jwtStore = useJwtStore();

onServerPrefetch(async () => {
  try {
    await suspense();
  } catch {}
});

const email = ref('');
const {
  mutate: signInWithEmail,
  isSuccess,
  error
} = useTrpcMutation('auth.emailSignin');

const username = ref('');
const { mutate: setUsername } = useTrpcMutation('user.onboarding', {
  onSuccess() {
    refetch();
  }
});

const { mutate: signOff } = useTrpcMutation('auth.logout', {
  onSuccess() {
    jwtStore.jwt = null;
    refetch();
  }
});

const runtimeConfig = useRuntimeConfig();
const isDiscordEnabled = computed(
  () => !!runtimeConfig.public.discordAuthorizeUrl
);
</script>

<template>
  <div space-y-5 p-3>
    <div v-if="session">
      <h1 text-xl inline-block m-r-3>
        Hello, {{ session.username ?? 'there' }} !
      </h1>
      <button bg-blue-3 p="x-3 y-1" @click="signOff(null)">Sign off</button>

      <template v-if="!session.username">
        <p>It seems you haven't chosen a username yet</p>
        <form
          gap-2
          flex
          flex-col
          items-start
          @submit.prevent="setUsername({ username })"
        >
          <label>
            Username
            <input v-model="username" p-1 border="1 solid gray-4" />
          </label>
          <button bg-blue-3 p-3>Set your username</button>
        </form>
      </template>
    </div>

    <template v-else>
      <form
        gap-2
        flex
        flex-col
        items-start
        @submit.prevent="signInWithEmail({ email })"
      >
        <label flex flex-col>
          E-mail
          <input v-model="email" type="email" p-1 border="1 solid gray-4" />
        </label>
        <button bg-blue-3 p-3>Sign in with email</button>
        <p v-if="isSuccess" color-green-7>
          Go
          <code p-1 color-gray-8 bg-gray-3>/maildev</code>
          homie
        </p>
        <p v-if="error" color-red-6>{{ error }}</p>
      </form>

      <div>Or</div>
      <a
        :href="runtimeConfig.public.discordAuthorizeUrl"
        p-3
        bg="#5865F2"
        color-white
        flex
        items-center
        gap-2
        w-max
        :opacity="!isDiscordEnabled && '50'"
      >
        <span i-carbon:logo-discord text-xl />
        Login with Discord
      </a>

      <template v-if="!isDiscordEnabled">
        <p>
          You need to add those environment variables to eable Discord
          Authentication
        </p>
        <ul>
          <li>
            <code p-1 color-gray-8 bg-gray-3>
              NUXT_PUBLIC_DISCORD_AUTHORIZE_URL
            </code>
          </li>
          <li>
            <code p-1 color-gray-8 bg-gray-3>NUXT_DISCORD_REDIRECT_URI</code>
          </li>
          <li>
            <code p-1 color-gray-8 bg-gray-3>NUXT_DISCORD_CLIENT_ID</code>
          </li>
          <li>
            <code p-1 color-gray-8 bg-gray-3>NUXT_DISCORD_CLIENT_SECRET</code>
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>
