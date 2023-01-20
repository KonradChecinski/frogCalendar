<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
</script>

<template>
  <form action="" method="post">
    <div class="input-container">
      <div class="img-container">
        <img src="" alt="Username icon" class="" />
      </div>

      <input
        type="text"
        placeholder="Email / Nazwa użytkownika"
        name="uname"
        required
      />
    </div>

    <div class="input-container">
      <div class="img-container">
        <img src="" alt="Password icon" class="" />
      </div>

      <input type="password" placeholder="Enter Password" name="psw" required />
    </div>

    <button type="submit">Login</button>

    <!-- <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
      </div> -->
  </form>
</template>

<style scoped src="@/assets/css/login.css"></style>
