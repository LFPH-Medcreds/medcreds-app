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
      <v-list-item-subtitle> Recent Symptoms </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.newSymptoms | yesNo }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Close Proximity </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.closeProximity | yesNo }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Emergency Symptoms </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.emergencySymptoms | yesNo }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-subtitle> Test Advised </v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ credential.values.testAdvised | yesNo }}
      </v-list-item-title>
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
