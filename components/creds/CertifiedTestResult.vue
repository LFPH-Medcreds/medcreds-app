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
        {{ credential.values.testSubjectName }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Test Result </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.testResult }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item :style="{ 'background-color': outdated && 'rgba(255, 204, 0, 0.5)', 'border-radius': outdated && '25px' }">
      <v-list-item-subtitle> Test Time </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.testTime | prettyLocalCertDate }}
      </v-list-item-title>
    </v-list-item>

    <!-- <v-list-item>

      <v-list-item-subtitle>
        Schema
      </v-list-item-subtitle>
      <v-list-item-title  class="text-right">
        {{ getSchema(credential) }}
      </v-list-item-title>
    </v-list-item> -->

    <v-list-item>
      <v-list-item-subtitle> Test </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.testName }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Test Manufacturer </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.testManufacturerName }}
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
