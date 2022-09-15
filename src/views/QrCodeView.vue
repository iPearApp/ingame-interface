<template>
  <base-screen>
    <template v-slot:title>Scan it!</template>
    <p>You need to scan this QR Code with the application.</p>
    <p><b class="warning">Warning</b>: if you're streaming, do not show this page! Everyone can scan the code and access your profile!</p>
    <div style="margin-top: 32px;position:relative;">
      <v-progress-circular
          :size="70"
          :width="5"
          color="purple"
          indeterminate
          v-if="loading || imgLoading"
      ></v-progress-circular>
      <img style="max-width: 100%" alt="qrcode" :class="{ 'blur': blur }" :src="src" v-if="!loading && !error" v-show="!imgLoading" @load="imgLoaded()" />
      <div class="hint" v-if="!loading && !error && blur && !imgLoading">
        <span @click="show()">Click to see</span>
      </div>
      <div class="error" v-if="error">
        {{ errorString }}<br>
        <v-btn outlined small style="margin-top: 8px" :dark="dark" @click="request()">
          <v-icon
              left
              dark
          >
            mdi-autorenew
          </v-icon>
          Request new one
        </v-btn>
      </div>
    </div>
    <div class="buttons">
      <v-btn outlined class="column btn" to="/">
        <v-icon
            left
            dark
        >
          mdi-arrow-left
        </v-icon>
        Cancel
      </v-btn>
    </div>
  </base-screen>
</template>

<script>
import BaseScreen from "@/components/BaseScreen";
import {useSession} from "@/store";
import Nui from "@/utils/Nui";
export default {
  name: "QrCodeView",
  components: {BaseScreen},
  data() {
    return {
      loading: false,
      imgLoading: false,
      src: '',
      error: false,
      errorString: '',
      blur: true, // Important for streamers
      dark: false,
      requestPending: false // I want to avoid multiple call
    }
  },
  mounted() {
    this.blur = true;
    this.loading = true;
    const session = useSession();
    if (session.qrCodeLink == null) {
      this.request();
    } else {
      this.src = session.qrCodeLink;
      this.loading = false;
    }
    setImmediate(() => {
      // Need to call next tick because sometimes we need to wait App.vue to load data
      this.dark = session.dark;
    });
  },
  methods: {
    imgLoaded() {
      this.imgLoading = false;
    },
    show() {
      this.blur = false;
    },
    request() {
      if (this.requestPending) return;
      this.requestPending = true;
      this.loading = true;
      this.blur = true;
      this.error = false;
      const session = useSession();
      // Send request to server
      Nui.send('qrcode').then((data) => {
        /**
         * Handle response.
         * If link exist = success, we remove loading things and reset blur.
         */
        if (data.link) {
          this.imgLoading = true;
          this.src = data.link;
          session.setQrCodeLink(data.link); // Set the link in session storage to avoid calling the server everytime.
          this.error = false;
          this.blur = true;
        } else {
          throw new Error(); // Handled by the catch
        }
      }).catch(() => {
        this.error = true;
        this.errorString = "Can't receive the QR Code. Please retry.";
      }).finally(() => {
        this.loading = false;
        this.requestPending = false;
      });
    }
  }
}
</script>

<style scoped>
.buttons {
  margin-top: 32px;
  display: flex;
}
.column {
  flex:50%;
  margin-right: 16px;
}
.column:last-of-type {
  margin-right: 0;
}
.buttons .btn {
  width: 100%;
  color: var(--btn-color);
}
p {
  margin-top: 16px;
  line-height: 24px;
}

img {
  filter: unset;
  transition: filter 0.2s linear;
  -webkit-transition: -webkit-filter 0.2s linear;
  -moz-transition: -moz-filter 0.2s linear;
  -ms-transition: -ms-filter 0.2s linear;
  -o-transition: -o-filter 0.2s linear;
}
img.blur {
  filter: blur(1rem);
}

.warning {
  color: #d63031;
}
.dark-theme .warning {
  color: #ff7675;
}

.hint {
  position: absolute;
  top:0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.hint span {
  padding: 12px 16px;
  background: rgba(0,0,0,0.7);
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  color:white;
}
</style>
