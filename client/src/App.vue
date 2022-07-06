<script setup lang="ts">
import {MenuMan,IMenuItem,IMenuItemD2} from './menu'
import route from './plugins/router'
import {useEmitter} from './plugins/emitter'
const emitter = useEmitter()
const menu = MenuMan.getMenu()
const onBtnGo = (m:(IMenuItem), path:string)=> {
  if( m.children ) return
  route.push(path).then(()=>emitter.emit('menu-refresh'));
}

const onBtnGoLv2 = (m:(IMenuItemD2), path:string)=> {
  route.push(path).then(()=>emitter.emit('menu-refresh'));
}
</script>

<template>
<v-app>
  <nav>
    <v-toolbar flat app color="#2C2C2C" style="color: white; z-index: 9999; overflow:inherit !important">
      <div style="width: 120px;">메이플 운영툴</div>
      <div class="d-flex ms-4">
        <nav>
          <ul>
            <template v-for="m1 in menu">
              <li>
                <div @click="onBtnGo(m1, `/${m1.key}`)">{{m1.name}}</div>
                <ul v-if="m1.children">
                  <li v-for="m2 in m1.children" @click="onBtnGoLv2(m2, `/${m1.key}/${m2.key}`)">{{m2.name}}</li>
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
    <router-view/>
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
  width: 100px;
  text-align: center;
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
  margin-left: -100px;
  padding: 20px 0 10px 0;
  z-index: 10000;
}

/* Display Dropdowns on Hover */
nav ul li:hover > ul {
	display:inherit;
}
	
/* Fisrt Tier Dropdown */
nav ul ul li {
	width:200px;
	float:none;
	display:list-item;
	position: relative;
  padding: 8px 0;
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
