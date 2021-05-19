<template>
  <v-overlay color="white">
    <div style="text-align: center">
      <v-img src="/proofmarket4s.png" contain max-width="200" :style="{ 'margin-top': '10%' }" eager />
      <h2 style="color: #32855b" class="mt-5">
        {{ message }}<span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>
      </h2>
    </div>
  </v-overlay>
</template>

<style scoped>
.ellipsis-anim span {
  opacity: 0;
  -webkit-animation: ellipsis-dot 1s infinite;
  animation: ellipsis-dot 1s infinite;
}

.ellipsis-anim span:nth-child(1) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.ellipsis-anim span:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.ellipsis-anim span:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<script>
export default {
  props: {
    message: String
  }
}
</script>
