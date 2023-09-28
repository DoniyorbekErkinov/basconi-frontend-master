<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh; padding: 10px">
        <img src="../assets/404.png" width="40%"/>
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t('msg_404') }}
        <q-spinner-gears/>
      </div>

      <vs-button
          @click="$router.go(-1)"
          style="display: inline-block"
          color="white"
          class="q-mt-xl q-mr-lg text-blue"
          shadow
          border
          gradient
      >
        {{ $t('actions.back') }}
        <template #animate>
          <q-icon name="west"/>
        </template>
      </vs-button>
      <vs-button
          @click="$router.push('/')"
          style="display: inline-block"
          color="white"
          class="q-mt-xl q-mr-lg text-blue"
          shadow
          border
          gradient
          animation-type="scale"
      >
        {{ $t('actions.go_home') }}
        <template #animate>
          <q-icon name="home"/>
        </template>
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
name: "Error404"
}
</script>

<style scoped>

</style>
