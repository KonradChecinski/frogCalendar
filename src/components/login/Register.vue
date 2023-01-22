<script setup lang="ts">
import Button from "@/components/Button.vue";
import { reactive } from "vue";
// defineProps<{
//   title: { type: string; required: true };
// }>();
const state = reactive({
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
});
</script>

<template>
  <form action="" method="post">
    <div class="input-container">
      <p>Nazwa użytkownika</p>
      <input type="text" name="uname" required v-model="state.username" />
    </div>

    <div class="input-container">
      <p>Email</p>
      <input type="text" name="email" required v-model="state.email" />
    </div>

    <div class="input-container">
      <p>Hasło</p>
      <input type="password" name="psw" required v-model="state.password" />
    </div>

    <div class="input-container">
      <p>Powtórz hasło</p>
      <input
        type="password"
        name="rpsw"
        required
        v-model="state.repeatPassword"
      />
    </div>

    <div class="button-container">
      <Button title="Zarejestruj się" />
    </div>

    <p class="login-p">
      Masz już konto? <span class="login-span"><RouterLink to="/login">Zaloguj się</RouterLink></span>
    </p>

    <!-- <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div> -->
  </form>
</template>

<style scoped src="@/assets/css/register.css"></style>
