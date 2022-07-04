<script setup lang="ts">
interface IMenuItem {
  name:string,
  children?:IMenuItem[]
}
const menu:IMenuItem[] = [
  {name: '조회', children: [
    {name: '계정'},
    {name: '캐릭터'}
  ]},
  {name: '로그', children: [
    {name: '로그1'},
    {name: '로그2'}
  ]},
]
</script>

<template>
<v-app>
  <nav>
    <v-toolbar flat app color="#2C2C2C" style="color: white;">
      <div style="width: 120px;">메이플 운영툴</div>
      <div class="d-flex ms-4">
        <div class="mx-2" style="width: 100px; text-align: left;" v-for="it in menu">
          {{it.name}}
        </div>
      </div>
    </v-toolbar>
    <!-- 드롭다운 메뉴 -->
    <div v-show="false" style="position: absolute; width: 100%; height: 400px; background-color: #2c2c2c; z-index: 99; display: flex;">      
    </div>
  </nav>
  <v-main>
    <div class="d-flex" style="height: 100%;">
      <div style="width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
        <nav>
          <div v-for="it in 6" style="height: 46px;">메인 메뉴</div>          
        </nav>
      </div>
      <div style="width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
        <nav>
          <div v-for="it in 10" style="height: 46px;">서브 메뉴</div>     
        </nav>
      </div>
      <div style="padding: 20px;"><router-view/></div>      
    </div>
    
  </v-main>
</v-app>

</template>

<style>
html { overflow-y: auto !important; }
</style>
