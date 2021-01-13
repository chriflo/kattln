import { atom } from 'recoil'

export const sharedCountState = atom<number | undefined>({
  key: 'sharedCount', // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
})
