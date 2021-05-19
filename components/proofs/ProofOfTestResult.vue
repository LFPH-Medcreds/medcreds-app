<script>
  export default {
    props: {
      testDetails: Object
    }
  }
</script>

<template>
  <v-list dense>
    <v-subheader>Medical Test Credentials</v-subheader>
    <v-list-item>
      <v-list-item-subtitle>Test Subject Name</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.testSubjectName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Test Result</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.testResult }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Test Name</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.testName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Test Manufacturer</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.testManufacturerName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Test Time</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.testTime | prettyLocalCertDate }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issuing Organization</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.issuedByName }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-subtitle>Issued on Behalf of</v-list-item-subtitle>
      <v-list-item-title class="text-right">
        {{ testDetails.attributes.issuedOnBehalfOfName }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
