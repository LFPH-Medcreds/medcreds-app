export const strict = false

export const state = () => ({
  fetching: false,
  fetchingMessage: null,
  snackbar: false,
  snackbarText: ''
})

export const getters = {
  fetching: (state) => state.fetching,
  fetchingMessage: (state) => state.fetchingMessage,
  snackbar: (state) => state.snackbar,
  snackbarText: (state) => state.snackbarText
}

export const mutations = {
  setFetching(state, fetching) {
    if (typeof fetching === 'string') {
      state.fetchingMessage = fetching
      state.fetching = true
    } else {
      state.fetching = !!fetching
      state.fetchingMessage = null
    }
  },
  setSnackbar(state, val) {
    state.snackbar = val
  },
  setSnackbarText(state, text) {
    state.snackbarText = text
    state.snackbar = true
  }
}

export const actions = {
  getAsyncImages() {
    const images = document.getElementsByClassName('asyncImage')
    Array.from(images).map((imageElement) => {
      // Start loading image
      let asyncImage = new Image()
      asyncImage.src = imageElement.dataset.src
      // Once image is loaded replace the src of the HTML element
      asyncImage.onload = () => {
        imageElement.classList.remove('asyncImage')
        if ('IMG' === imageElement.nodeName) {
          imageElement.src = asyncImage.src
        } else if (imageElement.classList.contains('v-image')) {
          let vContent = imageElement.getElementsByClassName('v-responsive__content')[0]
          vContent.style.backgroundImage = `url(${asyncImage.src})`
        } else {
          imageElement.style.backgroundImage = `url(${asyncImage.src})`
        }
      }
    })
  }
}
