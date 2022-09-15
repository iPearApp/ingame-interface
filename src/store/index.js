import { defineStore } from 'pinia'

export const useSession = defineStore('session', {
  state: () => ({
    qrCodeLink: null,
    secretCode: null,
    secretCodeExpires: null,
    dark: false
  }),
  actions: {
    setQrCodeLink(link) {
      this.qrCodeLink = link;
    },
    setSecretCode(code) {
      this.secretCode = code;
    },
    setSecretCodeExpires(expires) {
      this.secretCodeExpires = expires;
    },
    setDark() {
      this.dark = true;
    },
    setLight() {
      this.dark = false;
    }
  },
})
