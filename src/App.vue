<template>
  <transition name="fade">
    <div id="ipear" v-if="display">
      <transition name="scale" mode="out-in">
        <router-view />
      </transition>
    </div>
  </transition>
</template>
<script>
import {EventBus} from "@/main";
import Nui from "@/utils/Nui";
import {useSession} from "@/store";

export default {
  name: "app",
  data() {
    return {
      display: false,
      darkMode: false
    }
  },
  destroyed() {
    window.removeEventListener('message', this.listener);
  },
  mounted() {
    this.listener = window.addEventListener('message', event => {
      const item = event.data || event.detail;
      if (item.type == null) return;
      if (this[item.type]) {
        this[item.type](item);
      }
    }, false);
    window.addEventListener('keyup', (event) => {
      if (event.key === "Escape" && this.display) {
        this.hide();
      }
    });
    this.closeListener = EventBus.$on('closeApp', () => {
      this.hide();
    });
    this.setTheme()
  },
  methods: {
    setTheme() {
      document.documentElement.className = this.darkMode ? "dark-theme" : 'light-theme';
      const session = useSession();
      if (this.darkMode) {
        session.setDark();
      } else {
        session.setLight();
      }
    },
    show: function(data) {
      this.darkMode = data.theme && data.theme === 'dark';
      this.setTheme();
      this.display = true;
    },
    hide: function() {
      this.display = false;
      if (this.$route.name !== 'welcome') { // Go back to welcome screen
        this.$router.push('/');
      }
      Nui.send('hide', {}).then(() => {}).catch(() => {}); // Don't care about the result
    }
  }

}
</script>
<style lang="scss">
:root {
  --bg-primary: #fff;
  --border-color: rgba(255,255,255,0.8);
  --text-color: #2c3e50;
  --btn-color: #6200ee;
}
:root.dark-theme {
  --bg-primary: #2d2d30;
  --border-color: #1e1e1e;
  --text-color: #ececec;
  --btn-color: #AC67FF;
}
html {
  overflow: hidden;
}
body {
  height: 100vh;
  overflow: hidden;
}
#ipear {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  height: 100%;
  background: rgba(0,0,0,0.4);
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
