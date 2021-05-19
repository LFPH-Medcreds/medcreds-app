<script>
  export default {
    props: {
      dailySelfCheck: Object
    }
  }
</script>

<template>
  <v-list dense>
    <v-subheader>Health Assessment Credentials</v-subheader>
    <v-list-item>
      <v-list-item-subtitle>Name</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.firstName }} {{ dailySelfCheck.attributes.lastName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>New Symptoms</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.newSymptoms | yesNo }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Close Proximity</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.closeProximity | yesNo }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Emergency Symptoms</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.emergencySymptoms | yesNo }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>COVID-19 Test Recommended</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.testAdvised | yesNo }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issued At</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.issuedDateUtc | prettyLocalCertDate }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issuing Organization</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.issuedByName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issued on Behalf of</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ dailySelfCheck.attributes.issuedOnBehalfOfName }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
