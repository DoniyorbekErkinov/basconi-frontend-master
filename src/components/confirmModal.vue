<template>
  <vs-dialog blur prevent-close v-model="model" @close="$emit('close', {})">
    <template #header>
      <b>{{ $t('confirm') }}</b>
    </template>
    <q-separator/>
    <div class="mt-1"><i class="text-h6">{{ text }}</i></div>
    <template #footer>
      <div class="mt-2">
        <vs-button @click="$emit('submit', {})" block success gradient>{{ $t('actions.yes') }}</vs-button>
        <vs-button @click="$emit('close', {})" block danger gradient>{{ $t('actions.no') }}</vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
export default {
  props: {
    model: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  name: "confirmModal"
}
</script>

<style scoped>

</style>
