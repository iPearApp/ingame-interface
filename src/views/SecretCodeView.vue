<template>
  <base-screen>
    <template v-slot:title>Copy your code!</template>
    <p>You need to enter this secret code in the application.</p>
    <p><b class="warning">Warning</b>: if you're streaming, do not show this page! Everyone can scan the code and access your profile!</p>
    <div style="margin-top: 32px; position:relative;">
      <v-progress-circular
          :size="70"
          :width="5"
          color="purple"
          indeterminate
          v-if="loading"
      ></v-progress-circular>
      <div v-if="!loading && !error" class="code-wrapper" :class="{ 'blur': blur }">
        <div class="code">{{ code }}</div>
        <div class="info">{{ expiresIn }}</div>
      </div>
      <div class="hint" v-if="!loading && !error && blur">
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
import Nui from "@/utils/Nui";
import {useSession} from "@/store";
export default {
  name: "SecretCodeView",
  components: {BaseScreen},
  data() {
    return {
      loading: false,
      code: '',
      expiresIn: '',
      expiresAt: "2022-01-01 00:00:00",
      error: false,
      errorString: '',
      blur: true,
      dark: false,
      requestPending: false
    }
  },
  mounted() {
    if (this.interval) clearInterval(this.interval);
    const session = useSession();
    if (session.secretCode == null) {
      this.request();
    } else {
      this.code = session.secretCode;
      this.expiresAt = session.secretCodeExpires;
      this.loading = false;
      this.calculateExpires();
    }
    setImmediate(() => {
      // Need to call next tick because sometimes we need to wait App.vue to load data
      this.dark = session.dark;
    })
  },
  methods: {
    show() {
      this.blur = false;
    },
    calculateExpires() {
      const now = new Date();
      const expires = new Date(this.expiresAt);
      if (now > expires) {
        this.error = true;
        this.errorString = 'Your secret code expired.';
        this.loading = false;
        if (this.interval) clearInterval(this.interval);
        return;
      }
      this.error = false;
      const diff = Math.abs(new Date(this.expiresAt) - new Date());
      const diffMinutes = Math.floor((diff / 1000) / 60); // ms to minutes
      this.expiresIn = (diffMinutes * 60) > 60 ? `(expires in ${  diffMinutes } minutes)` : `(expires in a few seconds)`;
    },
    request() {
      if (this.requestPending) return;
      this.requestPending = true;
      this.blur = true;
      this.loading = true;
      this.error = false;
      const session = useSession();
      // Send request to server
      Nui.send('secret').then((data) => {
        if (data.code) {
          this.code = data.code.split('').join(' ');
          this.expiresAt = data.expires;
          session.setSecretCode(data.code); // Set the code in session storage to avoid calling the server everytime.
          session.setSecretCodeExpires(data.expires);
          this.error = false;
          this.calculateExpires();
          this.interval = setInterval(() => {
            this.calculateExpires();
          }, 2000);
        } else {
          throw new Error(); // Handled by the catch
        }
      }).catch(() => {
        this.error = true;
        this.errorString = 'Can\'t receive the secret code. Please retry.';
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

.code-wrapper {
  margin-top: 16px;
  line-height: 24px;
  filter: unset;
  transition: filter 0.2s linear;
  -webkit-transition: -webkit-filter 0.2s linear;
  -moz-transition: -moz-filter 0.2s linear;
  -ms-transition: -ms-filter 0.2s linear;
  -o-transition: -o-filter 0.2s linear;
}
.code {
  font-size: 32px;
  font-weight: 600;
}
.code-wrapper .info {
  margin-top: 8px;
}

.warning {
  color: #d63031;
}
.dark-theme .warning {
  color: #ff7675;
}

.code-wrapper.blur {
  filter: blur(0.5rem);
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
  padding: 8px 12px;
  background: rgba(0,0,0,0.7);
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  cursor: pointer;
  color:white;
}
</style>
