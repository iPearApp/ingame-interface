<template>
  <div class="wrapper">
    <div class="content">
      <img class="logo" alt="iPear logo" src="../assets/ipear.png">
      <v-btn icon large class="close" :dark="darkTheme" @click="closeApp()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <h1 class="title"><slot name="title"></slot></h1>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/main";

export default {
  name: "BaseScreen",
  data() {
    return {
      darkTheme: false
    }
  },
  mounted() {
    setImmediate(() => {
      this.darkTheme = document.documentElement.className === 'dark-theme';
    });
  },
  methods: {
    closeApp() {
      EventBus.$emit('closeApp');
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.close {
  position: absolute;
  top: 16px;
  right: 16px;
}
.title {
  margin-bottom: 32px;
}
.content {
  position: relative;
  margin: auto;
  padding: 128px 64px 32px 64px;
  border:1px solid var(--border-color);
  background: var(--bg-primary);
  -webkit-box-shadow: 0 0 24px -6px rgba(0,0,0,0.5);
  box-shadow: 0 0 24px -6px rgba(0,0,0,0.5);
  border-radius: 12px;
  max-width: 512px;
  font-size: 14px;
}
.logo {
  position: absolute;
  margin: 0 auto;
  top: calc(-128px + (-16px)); /* -(height of image/2) + padding */
  left:0;
  right:0;
  width: 256px;
  height: 256px;
}
</style>
