<template>
  <div>
    <v-img v-if="largeLogo" src="/proofmarket4s.png" contain :style="{ 'margin-top': '10%' }" eager v-bind="logoProps" />
    <v-img v-if="standalone" contain src="/proofmarket4s.png" max-height="80" height="80" />
    <div v-if="!standalone && !largeLogo" style="display: flex">
      <v-img
        src="/proofmarket4s.png"
        :class="inheritedClass"
        :style="defaultStyle"
        contain
        eager
        :max-height="`${maxHeight}px`"
        :max-width="`${maxWidth}px`"
      />

      <div v-if="modalTitle" class="pt-3">
        <span class="headline pl-1 mt-2" v-if="$vuetify.breakpoint.smAndUp">{{ title }}</span>
        <span class="headline pl-1 mt-2" v-else>{{ titleResponsive }}</span>
      </div>
      <div v-if="navBarTitle" v-bind:style="defaultTextContainer">
        <v-toolbar-title style="flex-direction: row" v-text="title" class="pl-0" />
        <v-subheader style="flex-direction: row; padding: 0; height: 1rem; font-size: 0.8rem">{{ subTitle }}</v-subheader>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    titleResponsive: String,
    subTitle: String,
    maxHeight: {
      type: Number,
      default: () => 45
    },
    maxWidth: {
      type: Number,
      default: () => 30
    },
    modalTitle: {
      type: Boolean,
      default: () => false
    },
    navBarTitle: {
      type: Boolean,
      default: () => false
    },
    defaultStyle: {
      type: Object,
      default: () => ({
        width: '34px !important',
        height: '46px !important',
        'flex-direction': 'column'
      })
    },
    inheritedClass: {
      type: String,
      default: () => ''
    },
    standalone: {
      type: Boolean,
      default: () => false
    },
    logoProps: {
      type: Object,
      default: () => {}
    },
    largeLogo: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    defaultTextContainer: {
      display: 'inline-block',
      'flex-direction': 'column',
      'padding-left': '1rem'
    }
  })
}
</script>
