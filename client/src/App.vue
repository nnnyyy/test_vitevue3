<script setup lang="ts">
</script>

<template>
<v-app>
  <nav>
    <v-toolbar flat app color="#2C2C2C" style="color: white;">
      <!-- 툴바 타이틀 작성 -->
        <v-toolbar-title class="text-uppercase grey--text">
          테스트          
        </v-toolbar-title>
    </v-toolbar>
  </nav>
  <v-main>
    <div>사이드 메뉴</div>
    <router-view/>
  </v-main>
</v-app>

</template>

<style>
html { overflow-y: auto; }
</style>
