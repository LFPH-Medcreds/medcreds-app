<script>
  export default {
    props: {
      dailyTempCheck: Object
    }
  }
</script>

<template>
  <v-list dense>
    <v-subheader>Temperature Assessment Credentials</v-subheader>
    <v-list-item>
      <v-list-item-subtitle>Name</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailyTempCheck.attributes.firstName }} {{ dailyTempCheck.attributes.lastName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Temp Celsius</v-list-item-subtitle>
      <v-list-item-title class="text-right"> {{ dailyTempCheck.attributes.tempC }}&#8451; </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Temp Fahrenheit</v-list-item-subtitle>
      <v-list-item-title class="text-right"> {{ dailyTempCheck.attributes.tempF }}&#8457; </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issued At</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailyTempCheck.attributes.issuedDateUtc | prettyLocalCertDate }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issuing Organization</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailyTempCheck.attributes.issuedByName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issued on Behalf of</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailyTempCheck.attributes.issuedOnBehalfOfName }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
