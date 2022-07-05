<script setup lang="ts">
import { ref } from 'vue';
import {MenuMan} from './menu'
const menu = MenuMan.getMenu()
const showMenu = ref(false)
</script>

<template>
<v-app>
  <nav>
    <v-toolbar flat app color="#2C2C2C" style="color: white; z-index: 9999; overflow:inherit !important">
      <div style="width: 120px;">메이플 운영툴</div>
      <div class="d-flex ms-4">
        <nav>
          <ul>
            <template v-for="it in menu">
              <li>
              {{it.name}}
                <ul>
                  <li>sdfsdf</li>
                  <li>sdfsdf</li>
                </ul>
              </li>              
              
            </template>
            
          </ul>
        </nav>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="success">아이콘</v-btn>
    </v-toolbar>
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

<style lang="css">
html { overflow-y: auto !important; }

nav ul {
	padding: 0;
  margin: 0;
	list-style: none;
	position: relative;
	}
	
nav ul li {
	display:inline-block;
  padding: 0 16px;
  text-align: center;
	}

nav a {
	display:block;
	padding:0 10px;	
	color:#FFF;
	font-size:20px;
	line-height: 60px;
	text-decoration:none;
}

nav a:hover { 
	background-color: #000000; 
}

/* Hide Dropdowns by Default */
nav ul ul {
	display: none;
	position: absolute;   
  background-color: #2c2c2c;
	top: 25px; /* the height of the main nav */
  z-index: 10000;
}

/* Display Dropdowns on Hover */
nav ul li:hover > ul {
	display:inherit;
}
	
/* Fisrt Tier Dropdown */
nav ul ul li {
	width:170px;
	float:none;
	display:list-item;
	position: relative;
}

/* Second, Third and more Tiers	*/
nav ul ul ul li {
	position: relative;
	top:-60px; 
	left:170px;
}

	
/* Change this in order to change the Dropdown symbol */
li > a:after { content:  ' +'; }
li > a:only-child:after { content: ''; }
</style>
