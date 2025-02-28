import { h, Transition } from 'vue'

export const TransitionScale = {
  name: 'TransitionScale',
  setup(_, { slots }) {
    return () => h(Transition, {
      name: 'scale',
      mode: 'out-in',
      appear: true
    }, slots)
  }
}

export const TransitionSlide = {
  name: 'TransitionSlide',
  setup(_, { slots }) {
    return () => h(Transition, {
      name: 'slide',
      mode: 'out-in',
      appear: true
    }, slots)
  }
}

export const TransitionFade = {
  name: 'TransitionFade',
  setup(_, { slots }) {
    return () => h(Transition, {
      name: 'fade',
      mode: 'out-in',
      appear: true
    }, slots)
  }
} 