<template>
  <v-tooltip right :key="text">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item :id="id" v-bind="attrs" v-on="on" :key="text" :to="route" exact :value="$route.path === route">
        <v-list-item-action :key="`${text}-action`">
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content :key="`${text}-content`">
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    {{ toolTip }}
  </v-tooltip>
</template>

<script>
  export default {
    props: {
      text: String,
      icon: String,
      route: String,
      toolTip: String,
      id: String
    }
  }
</script>
