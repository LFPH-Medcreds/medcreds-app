<script>
export default {
  props: {
    credential: Object,
    outdated: Boolean
  }
}
</script>

<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-subtitle> Issued To </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ `${credential.values.firstName} ${credential.values.lastName}` }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Temperature Fahrenheit </v-list-item-subtitle>
      <v-list-item-title class="text-right"> {{ credential.values.tempF }} &#8457; </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Temperature Celsius </v-list-item-subtitle>
      <v-list-item-title class="text-right"> {{ credential.values.tempC }} &#8451; </v-list-item-title>
    </v-list-item>

    <v-list-item :style="{ 'background-color': outdated && 'rgba(255, 204, 0, 0.5)', 'border-radius': outdated && '25px' }">
      <v-list-item-subtitle> Issued </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.issuedDateUtc | prettyLocalCertDate }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Issued By </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.issuedByName }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Issued by </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.issuedOnBehalfOfName }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
