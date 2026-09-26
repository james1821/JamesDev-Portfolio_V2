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
<<<<<<< HEAD
        <p class="lede mx-auto mt-2 text-sm">Only the site owner's Google account can access this dashboard.</p>
=======
        <p class="lede mx-auto mt-2 text-sm">
          The first Google account to sign in becomes the owner. Every account after that is turned away.
        </p>
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
        <button type="button" class="btn-primary mt-6 w-full" @click="$emit('sign-in')">
          Continue with Google
        </button>
      </template>

      <template v-else>
        <h1 class="mt-5 text-lg font-semibold text-content-strong">This account can't manage content</h1>
        <p class="lede mx-auto mt-2 text-sm">
<<<<<<< HEAD
          {{ email }} is signed in, but it isn't the account this dashboard is restricted to.
=======
          {{ email }} is signed in, but the dashboard is already claimed by another account.
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
        </p>
        <button type="button" class="btn-secondary mt-6 w-full" @click="$emit('sign-out')">
          Sign out and try another account
        </button>
      </template>

<<<<<<< HEAD
      <p v-if="error" class="mt-4 whitespace-pre-wrap text-sm text-danger">{{ error }}</p>
=======
      <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
    </div>
  </div>
</template>
