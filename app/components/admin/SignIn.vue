<script setup lang="ts">
defineProps<{ signedIn: boolean; email: string; error: string }>()
defineEmits<{ 'sign-in': []; 'sign-out': [] }>()
</script>

<template>
  <div class="grid min-h-screen place-items-center px-6">
    <div class="surface w-full max-w-md p-8 text-center">
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent-wash text-accent">
        <AppIcon name="settings" :size="22" />
      </span>

      <template v-if="!signedIn">
        <h1 class="mt-5 text-lg font-semibold text-content-strong">Sign in to manage content</h1>
        <p class="lede mx-auto mt-2 text-sm">
          The first Google account to sign in becomes the owner. Every account after that is turned away.
        </p>
        <button type="button" class="btn-primary mt-6 w-full" @click="$emit('sign-in')">
          Continue with Google
        </button>
      </template>

      <template v-else>
        <h1 class="mt-5 text-lg font-semibold text-content-strong">This account can't manage content</h1>
        <p class="lede mx-auto mt-2 text-sm">
          {{ email }} is signed in, but the dashboard is already claimed by another account.
        </p>
        <button type="button" class="btn-secondary mt-6 w-full" @click="$emit('sign-out')">
          Sign out and try another account
        </button>
      </template>

      <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
    </div>
  </div>
</template>
