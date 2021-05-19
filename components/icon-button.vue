<template>
  <v-tooltip v-bind:right="toolTipRight" v-bind:left="toolTipLeft">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :id="id" v-bind="attrs" icon v-on="on" v-on:click="$emit('click', $event)" class="mr-5">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>

    {{ toolTip }}
  </v-tooltip>
</template>

<script>
export default {
  props: {
    icon: String,
    toolTip: String,
    id: String,
    toolTipLeft: Boolean,
    toolTipRight: Boolean
  }
}
</script>
