<template>
  <base-screen>
    <template v-slot:title>Welcome to iPear!</template>
    <div class="left-align">
      <p>
        <b>How to use?</b>
      </p>
      <p><b>1.</b> Download iPear from the <b>App Store</b> (iOS) or <b>Play Store</b> (Android) depending on your phone.</p>
      <p><b>2.</b> Choose an option below, either scan the <b>QR Code</b> (recommended) or via a <b>secret code</b>.</p>
      <p><b>3.</b> If you chose the QR Code, you must <b>scan directly from the app</b>.<br>
        Otherwise, you can access the interface to enter the code from the scan page button.</p>
      <p><b>4.</b> Enjoy!</p>
    </div>
    <h3 style="margin-top: 32px">Choose your way</h3>
    <div class="buttons">
      <v-btn outlined class="column btn" to="/qrcode">
        <v-icon
            left
            dark
        >
          mdi-qrcode-scan
        </v-icon>
        QR Code
      </v-btn>
      <v-btn class="column btn" outlined to="/secret">
        <v-icon
            left
            dark
        >
          mdi-form-textbox-password
        </v-icon>
        Secret code</v-btn>
    </div>
  </base-screen>
</template>

<script>
import BaseScreen from "@/components/BaseScreen";
export default {
  name: "WelcomeView",
  components: {BaseScreen}
}
</script>

<style scoped>
.left-align {
  text-align: left;
}
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
</style>
