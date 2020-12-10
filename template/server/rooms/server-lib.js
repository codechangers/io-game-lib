!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["server-lib"]=t():e["server-lib"]=t()}(global,(function(){return e={737:e=>{const t={playAnimation:function(e,t,i,s){e.animations[t]||(e.animations={...e.animations,[t]:{startTime:Date.now(),attribute:t,dValue:i,duration:s}})},handleAnimations:function(e){const{game:t}=this;Object.values(t.state[e]).forEach((e=>{for(let t in e.animations){const i=e.animations[t];if(i){i.currentValue||(i.currentValue=0);const{startTime:t,duration:s,dValue:a,attribute:n}=i,o=Date.now(),c=(o-t)/s;e[n]+=a*c-i.currentValue,i.currentValue=a*c,o>=t+s&&delete e.animations[n]}}}))}};e.exports={server:t}},541:e=>{function t(e,t,i,s){const a="x"===i?[t.x-t.width/2,t.x+t.width/2]:[t.y-t.height/2,t.y+t.height/2],n="x"===i?e.width:e.height;return s<0?a[1]+n/2:a[0]-n/2}function i(e,t,i){const s=e[i]>t[i]?1:-1,a="x"===i?"y":"x";return Math.sqrt(Math.pow(e.width/2+t.width/2+2e-6,2)-Math.pow(e[a]-t[a],2))*s+t[i]}function s(e,t,s,a){const n=e.width/2;let o=[];for(let e in a)a[e]<n&&o.push(e);const c={left:!1,top:!1,right:!0,bottom:!0};function r(a,n){const r=t.x+t.width/2*(c[a]?1:-1),l=t.y+t.height/2*(c[n]?1:-1),h=c[a]?[r,e.x]:[e.x,r],d=c[n]?[l,e.y]:[e.y,l];if(o.includes(a+"Dist")&&o.includes(n+"Dist")&&h[0]<h[1]&&d[0]<d[1]){newPos=i(e,{x:r,y:l,width:0},s);const t=c["x"===s?a:n]?[e[s],newPos]:[newPos,e[s]];return t[0]<t[1]?newPos:e[s]}}return r("left","top")||r("left","bottom")||r("right","top")||r("right","bottom")||-1}const a={useBarrier:function(e,t){const{barriers:i}=this.game;Object.keys(i).includes(e)?i[e].push(t):i[e]=[t]},checkBarriers:function(e,a,n){const{barriers:o,shapes:c}=this.game;let r=!0,l=-1;return Object.keys(o).includes(e.type)&&o[e.type].forEach((o=>{this.handleCollision({...e,[a]:e[a]+n},o,((e,h,d)=>{if(r=!1,"circle"===c[o]&&"circle"===c[e.type])l=i(e,h,a);else if("circle"===c[o]){const i=s(h,e,a,d);l=-1!==i?e[a]+h[a]-i:t(e,h,a,n)}else if("circle"===c[e.type]){const i=s(e,h,a,d);l=-1!==i?i:t(e,h,a,n)}else l=t(e,h,a,n)}))})),{validMove:r,fallbackPos:l}}};e.exports={server:a}},222:e=>{const t={addCharacters:function(e,t=1){this.game[e]={},this.game.scales[e]=t,this.sendSpriteSize(e,t)},getCharacters:function(e,t=function(){},i=function(){},s=function(){}){const{game:a}=this,n=this;a.roomJoined?(a.room.listen(e+"/:id",(function(s){if("add"===s.operation){const{id:i,x:n,y:o,spriteName:c}=s.value;let r=a.add.container(n,o),l=a.front_layer.create(0,0,c||e);r.add([l]),r.setScale(a.scales[e]||1),a[e][i]={sprite:r,...s.value,attached:{}},s.value.rotation&&(r.rotation=s.value.rotation),t(a[e][i],s.value)}else if("remove"===s.operation){const{id:t}=s.path;for(item in a[e][t].sprite.destroy(),a[e][t].attached)a[e][t].attached[item].sprite.destroy();delete a[e][t],i(t)}})),a.room.listen(e+"/:id/:attribute",(function(t){if("selectedItem"===t.rawPath[2]&&a.room.sessionId===t.path.id){const e=document.getElementsByClassName("selected");e.length>0&&(e[0].classList.remove("selected"),document.getElementsByClassName("item")[t.value].classList.add("selected"))}if("add"===t.operation&&t.value&&t.value.type){const{x:i,y:s}=a[e][t.value.id].sprite;if("text"===t.value.type){let n=a.add.text(i+t.value.x,s+t.value.y,` ${t.value.text} `,{color:"white",backgroundColor:"rgba(0,0,0,0.7)"}).setScale(t.value.scale);a[e][t.value.id].attached[t.value.name]={...t.value,sprite:n}}if("item"===t.value.type){const i=t.value.scale/a[e][t.value.id].sprite._scaleX;let s=a.front_layer.create(t.value.x*(1/a[e][t.value.id].sprite._scaleX),t.value.y*(1/a[e][t.value.id].sprite._scaleX),t.value.name).setScale(i);n.sendSpriteSize(t.value.name,i||1),a[e][t.value.id].sprite.add(s),a[e][t.value.id].attached[t.value.name]={...t.value,sprite:s}}if("bar"===t.value.type){let n=new Phaser.Geom.Rectangle(0,0,t.value.width,t.value.height),o=a.add.graphics({fillStyle:{color:"0x999999"}});n=o.fillRectShape(n),a[e][t.value.id].attached[t.value.name+"Background"]={...t.value,sprite:n};let c=new Phaser.Geom.Rectangle(0,0,t.value.width,t.value.height);o=a.add.graphics({fillStyle:{color:"0x999900"}}),c=o.fillRectShape(c),n.x=i+t.value.x,c.x=i+t.value.x,n.y=s+t.value.y,c.y=s+t.value.y,c.setScale(100/t.value,1),a[e][t.value.id].attached[t.value.name]={...t.value,sprite:c}}}if("remove"===t.operation&&(a[e][t.path.id].attached[t.path.attribute].sprite.destroy(),"bar"===a[e][t.path.id].attached[t.path.attribute].type&&a[e][t.path.id].attached[t.path.attribute+"Background"].sprite.destroy(),delete a[e][t.path.id].attached[t.path.attribute]),"replace"===t.operation){const{id:i,attribute:n}=t.path;if("x"===n||"y"===n){for(let s in a[e][i].attached)"item"!==a[e][i].attached[s].type&&(a[e][i].attached[s].sprite[n]=t.value+a[e][i].attached[s][n]);a[e][i].sprite[n]=t.value}else"rotation"===n?a[e][i].sprite[n]=t.value:a[e][i][n]=t.value;s(i,n,t.value)}})),a.room.listen(e+"/:id/:attribute/:id",(function(t){if("add"===t.operation&&"items"===t.rawPath[2])document.getElementsByClassName("item")[t.value.index].style.background="url(../asset/"+t.value.image,document.getElementsByClassName("item")[t.value.index].style.backgroundSize="contain",document.getElementsByClassName("item")[t.value.index].style.backgroundPosition="center",document.getElementsByClassName("item")[t.value.index].style.backgroundRepeat="no-repeat",document.getElementsByClassName("item")[t.value.index].setAttribute("name",t.value.name),t.value.uses?document.getElementsByClassName("used")[t.value.index].innerHTML=t.value.uses:document.getElementsByClassName("used")[t.value.index].innerHTML="∞",document.getElementsByClassName("used")[t.value.index].style.display="block";else if("remove"===t.operation&&"items"===t.rawPath[2]){let e=document.getElementById("item-bar");e.removeChild(document.getElementsByName(t.path.id)[0]);let i=document.createElement("div");i.className="item",e.appendChild(i),document.getElementsByClassName("item")[0].classList.add("selected")}"filled"===t.path.id&&a[e][t.rawPath[1]].attached[t.rawPath[2]].sprite.setScale(t.value/100,1),"text"===t.path.id&&a[e][t.rawPath[1]].attached[t.rawPath[2]].sprite.setText(t.value),s(t.path.id,t.path.attribute,t.value)})),a.room.listen(e+"/:id/:attribute/:id/:attribute",(function(e){"items"===e.rawPath[2]&&"uses"===e.path.attribute&&a.room.sessionId===e.rawPath[1]&&(document.getElementsByName(e.path.id)[0].firstChild.innerHTML=e.value)}))):this.addConnectEvent("getCharacters",[e,t,i,s])}},i={setupCharacters:function(e,t="box"){this.game.state[e]={},this.counts[e]=0,this.game.shapes[e]=t},createACharacter:function(e,t,i){this.game.state[e][t]={rotation:0,...this.getSize(e),...i,id:t,type:e,items:{},selectedItem:0,animations:{}}},getACharacter:function(e,t){return this.game.state[e][t]},deleteACharacter:function(e,t){delete this.game.state[e][t]},nextCharacterId:function(e){return this.counts[e]+=1,`${e}${this.counts[e]}`},attachTo:function(e,t,i){if(i.item){const s=i.item;delete i.item,this.game.state[e][t][s.name]={...i,...s,x:i.x,y:i.y,type:"item",scale:i.scale,id:t},this.game.state[e][t].items[s.name].x=i.x,this.game.state[e][t].items[s.name].y=i.y,this.game.state[e][t].items[s.name].ownerId=t,this.game.state[e][t].items[s.name].scale=i.scale}else this.game.state[e][t][i.name]={...i,id:t}},getRotationTowards:function(e,t,i){return e.x-t<0?Math.atan((e.y-i)/(e.x-t))+Math.PI/2:Math.atan((e.y-i)/(e.x-t))-Math.PI/2},getXTowards:function(e,t,i){return Math.cos(this.getRotationTowards(e,t,i)-Math.PI/2)},getYTowards:function(e,t,i){return Math.sin(this.getRotationTowards(e,t,i)-Math.PI/2)},unAttach:function(e,t,i){delete this.game.state[e][t][i]},follow:function(e,t,i=0,s=1,a=(()=>{})){Object.keys(this.game.state[t]).length>=1&&Object.keys(this.game.state[t]).forEach((n=>{if(Object.keys(this.game.state[e]).length>=1){const{x:o,y:c}=this.game.state[t][n];let r=null,l=0;if(Object.keys(this.game.state[e]).forEach((t=>{if(null===r)r=t,l=Math.sqrt((o-this.game.state[e][t].x)**2+(c-this.game.state[e][t].y)**2);else{let i=o-this.game.state[e][t].x,s=c-this.game.state[e][t].y,a=Math.sqrt(i**2+s**2);a<=l&&(r=t,l=a)}})),!(l<i||0===l)){let i,l,h=o-this.game.state[e][r].x,d=c-this.game.state[e][r].y;h>=0?(i=Math.cos(Math.atan(d/h)),l=Math.sin(Math.atan(d/h))):(i=-Math.cos(Math.atan(d/h)),l=-Math.sin(Math.atan(d/h))),this.game.state[t][n].x-=i*s,this.game.state[t][n].y-=l*s,a(this.game.state[e][r],this.game.state[t][n])}}}))}};e.exports={client:t,server:i}},892:e=>{class t{constructor(e,t,i,s){this.width=Number.isNaN(i)?0:i,this.height=Number.isNaN(s)?0:s,this.x=!Number.isNaN(e)&&e>=0?e-this.width/2:-100,this.y=!Number.isNaN(t)&&t>=0?t-this.height/2:-100}collide(e){let s=-1,a=!1;if(e instanceof t)a=this.x<e.x+e.width&&this.x+this.width>e.x&&this.y<e.y+e.height&&this.y+this.height>e.y;else if(e instanceof i){const t=e.collide(this);a=t.collided,s=t.distance}else console.log(" * CollisionBox.collide: You can only collide with another collision object!");return{collided:a,distance:s}}}class i{constructor(e,t,i){this.x=!Number.isNaN(e)&&e>=0?e:-100,this.y=!Number.isNaN(t)&&t>=0?t:-100,this.radius=Number.isNaN(i)?0:i/2}distanceTo(e){let s=-1;if(e instanceof i){const t=this.x-e.x,i=this.y-e.y;s=Math.sqrt(t*t+i*i)}else if(e instanceof t){const t=Math.abs(e.height*this.x+e.x*e.y-e.x*(e.y+e.height))/Math.sqrt(e.height**2),i=Math.abs(e.height*this.x+(e.x+e.width)*e.y-(e.x+e.width)*(e.y+e.height))/Math.sqrt(e.height**2),a=Math.abs(-e.width*this.y+(e.x+e.width)*e.y-e.x*e.y)/Math.sqrt(e.width**2),n=Math.abs(-e.width*this.y+(e.x+e.width)*(e.y+e.height)-e.x*(e.y+e.height))/Math.sqrt(e.width**2),o=this.x-(e.x+e.width/2),c=this.y-(e.y+e.height/2);s={leftDist:t,rightDist:i,topDist:a,bottomDist:n,centerDist:Math.sqrt(o*o+c*c)}}else console.log(" * CollisionCircle.distanceTo: You can only check with another collision object!");return s}collide(e){let s=-1,a=!1;if(e instanceof i)s=this.distanceTo(e),a=s<this.radius+e.radius;else if(e instanceof t){s=this.distanceTo(e);const{leftDist:t,rightDist:i,topDist:n,bottomDist:o,centerDist:c}=s,r=t<this.radius||i<this.radius||this.x>e.x&&this.x<e.x+e.width,l=n<this.radius||o<this.radius||this.y>e.y&&this.y<e.y+e.height,h=Math.sqrt((e.width/2)**2+(e.height/2)**2);a=r&&l&&c<this.radius+h}else console.log(" * CollisionCircle.collide: You can only collide with another collision object!");return{collided:a,distance:s}}}const s={handleCollision:function(e,s,a){const{state:n,shapes:o}=this.game,c="string"==typeof e?o[e]:o[e.type],r="string"==typeof s?o[s]:o[s.type];Object.entries("string"==typeof e?n[e]:{[e.id]:e}).forEach((function([e,o]){const{x:l,y:h,width:d,height:u}=o,m="circle"===c?new i(l,h,d):new t(l,h,d,u);Object.entries("string"==typeof s?n[s]:{[s.id]:s}).forEach((function([s,n]){if(e!==s){const{x:e,y:s,width:c,height:l}=n,h="circle"===r?new i(e,s,c):new t(e,s,c,l),d=m.collide(h);d.collided&&a(o,n,d.distance)}}))}))},handleItemCollision:function(e,t,i,s){const a=this,{game:n}=this;Object.values(n.state[e]).forEach((e=>{const o=a.getSelectedItem(e);if(o.name===t){const t=n.sizes[o.name];if(t&&o.swinging){const{width:n,height:o}=t,{x:c,y:r}=a.getItemPosition(e);a.handleCollision({width:n,height:o,x:c,y:r},i,s)}}}))}};e.exports={server:s}},228:e=>{e.exports={client:{connect:function(e={}){const{game:t,colyseus:i,connectEvents:s}=this;let a=this;t.room=i.join("main",e),t.room.onJoin.add((()=>{t.roomJoined=!0;for(let e in s)for(let t in s[e])this[e](...s[e][t])})),t.room.listen("board/:id",(function(e){"add"===e.operation&&(a.setSize(500,500),a.createSquare(0,0,e.value.width,e.value.height,e.value.color))}))},addConnectEvent:function(e,t){const{connectEvents:i}=this;i[e]||(i[e]=[]),i[e].push(t)},canSend:function(){return this.game.roomJoined},sendAction:function(e,t){t?this.game.room.send({[e]:!0,...t}):this.game.room.send({[e]:!0})},myId:function(){return this.game.room.sessionId}},server:{handleActions:function(e,t){const i={...this.defaultActions,...e};for(let e in i)t[e]&&i[e](t)}}}},800:e=>{const t={drawBackground:function(e,t=1,i=this.game.width,s=this.game.height){const{game:a}=this,n=a.add.sprite(0,0,e);n.setScale(t),n.depth=0;let{width:o,height:c}=n;o*=t,c*=t;for(let n=0;n<=Math.floor(i/o)+1;n++)for(let i=0;i<=Math.floor(s/c)+1;i++)if(n>0||i>0){const s=a.add.sprite(o*n,c*i,e);s.setScale(t),s.depth=0}},createSquare:function(e,t,i,s,a,n=0){const o=new Phaser.Geom.Rectangle(e,t,i,s),c=this.game.add.graphics({fillStyle:{color:"0x"+a},depth:n});return c.fillRectShape(o),c},updateSquare:function(e,t,i,s,a,n){const o=new Phaser.Geom.Rectangle(e,t,i,s);n.clear(),n.fillStyle={color:"0x"+a},n.fillRectShape(o)},createSprite:function(e,t,i,s=1){let a=this.game.add.sprite(t,i,e);return a.setScale(s),a},getSpriteSize:function(e,t=1){let i=this.game.add.sprite(-100,-100,e),{width:s,height:a}=i;return i.destroy(),s*=t,a*=t,{width:s,height:a}}},i={setupBoard:function(e,t,i){this.boardWidth=e,this.boardHeight=t,this.game.state.board.board={width:e,height:t,color:i}},getSize:function(e){const{sizes:t}=this.game;let i={width:0,height:0};return Object.keys(t).includes(e)&&(i=t[e]),i}};e.exports={client:t,server:i}},417:e=>{const t={setBounds:function(e,t){e>0&&(this.game.gameWidth=e),t>0&&(this.game.gameHeight=t)},checkBounds:function(e,t,i){const{gameWidth:s,gameHeight:a}=this.game;let n=!0,o=-1;if(s&&a){const c="x"===t?s:a,r="x"===t?e.width:e.height,l="x"===t?e.width/2:e.height/2;e[t]-l+i<0?(n=!1,o=l):e[t]-l+i+r>c&&(n=!1,o=c-r+l)}return{validMove:n,fallbackPos:o}},move:function(e,t,i){let s=!0,a=-1;const n=this.checkBounds(e,t,i);n.validMove||(s=!1,a=n.fallbackPos);const o=this.checkBarriers(e,t,i);o.validMove||(s=!1,a=o.fallbackPos),s?e[t]+=i:e[t]=a},purchase:function(e,t="score",i,s,a=1){e[t]>=i&&(e[t]-=i,e[s]+=a)},setDefaultActions:function(){const{state:e,sizes:t}=this.game;this.defaultActions={setSpriteSize:i=>{const{type:s,width:a,height:n}=i;t[s]={width:a,height:n},Object.values(e[s]).forEach((e=>{e.width=a,e.height=n}))}}},runGameLoop:function(){const e=this;let t=Date.now();this.game.onUpdate&&setImmediate((function i(){const s=Date.now(),a=s-t;a>0&&(e.game.onUpdate(a),t=s),setImmediate(i)}))}};e.exports={client:{setSize:function(e,t){const{game:i}=this;e>0&&(i.width=e),t>0&&(i.height=t)},loadImage:function(e,t){return this.game.load.image(e,"asset/"+t)},setupKeys:function(e){const{game:t,addConnectEvent:i}=this;t.roomJoined?this.keys=this.game.input.keyboard.addKeys(e):i("setupKeys",[e])},getKeysDown:function(){const e={};for(let t in this.keys)e[t]=this.keys[t].isDown;return e},cameraFollow:function(e){this.game.cameras.main.startFollow(e)},cameraBounds:function(e=this.game.width,t=this.game.height){this.game.cameras.main.setBounds(0,0,e,t)},sendSpriteSize:function(e,t=1){this.canSend()?this.game.textures.exists(e)&&this.sendAction("setSpriteSize",{type:e,...this.getSpriteSize(e,t)}):this.addConnectEvent("sendSpriteSize",[e,t])}},server:t}},225:(e,t,i)=>{const s=i(222),a=i(228),n=i(939),o=i(800),c=i(417),r=i(488),l=i(281),h=i(892),d=i(541),u=i(83),m=i(737),g={...s.client,...a.client,...o.client,...c.client,...r.client,...l.client,...u.client,...n.client},p={...s.server,...a.server,...o.server,...c.server,...r.server,...h.server,...d.server,...u.server,...n.server,...m.server};e.exports={clientMethods:g,serverMethods:p,linkMethods:function(e,t){for(let i in t)e[i]=t[i].bind(e)},version:"1.0.1"}},939:e=>{const t={useItemBar:function(e=0){let t=document.getElementById("item-bar");t.style.display="flex",t.style.opacity="50%";for(let i=0;i<e;i++){let e=document.createElement("div");e.className=0===i?"item selected":"item",t.appendChild(e);let s=document.createElement("div");s.className="used",e.appendChild(s)}},hideItemBar:function(){document.getElementById("item-bar").style.display="none"},showItemBar:function(){let e=document.getElementById("item-bar");e.style.display="flex",e.style.opacity="50%"}},i={createNewItem:function(e,t,i){this.game.state[e]={},this.game.shapes[e]="circle",this.items[e]={name:e,useItem:i,image:t},this.setupCharacters(e,{rotation:0})},addItemToCharacter:function(e,t,i){this.items[t]&&(e.items[t]={...this.items[t],index:Object.keys(e.items).length,uses:i})},useItem:function(e,t){const i=Object.values(e.items).find((t=>t.index===e.selectedItem));if(i.uses>0||void 0===i.uses){const s=this;void 0!==i.uses&&(i.uses-=1);let a={swingItem:(t,a)=>{void 0===t&&(t=30),void 0===a&&(a=50),i.swinging=!0,s.playAnimation(e,"rotation",t*Math.PI/180,a),setTimeout((function(){s.playAnimation(e,"rotation",-t*Math.PI/180,a),setTimeout((()=>i.swinging=!1),2*a+2)}),a+1)},throwItem:(t,a,n,o)=>{void 0===o&&(o=1),void 0===n&&(n=1e3);let c=s.getItemPosition(e),r=s.nextCharacterId(i.name);this.counts[i.name]||s.setupCharacters(i.name),s.createACharacter(i.name,r,{x:c.x,y:c.y});let l=s.getACharacter(i.name,r),h=Math.cos(Math.atan((a-l.y)/(t-l.x)))*n,d=Math.sin(Math.atan((a-l.y)/(t-l.x)))*n;t-l.x<0&&(h=-h,d=-d);let u=1e3/(o/10);s.playAnimation(l,"x",h,u),s.playAnimation(l,"y",d,u),setTimeout((function(){s.deleteACharacter(i.name,r)}),u+1)},placeItem:(t,a)=>{let n=s.nextCharacterId(i.name);if(void 0!==t&&void 0!==a)s.createACharacter(i.name,n,{x:t,y:a,scale:i.scale});else{let t=s.getItemPosition(e);s.createACharacter(i.name,n,{x:t.x,y:t.y,rotation:e.rotation,scale:i.scale})}}};i&&i.useItem(e,t,a)}},switchItem:function(e,t){void 0!==t?e.selectedItem=t:e.selectedItem+=1,e.selectedItem>=Object.keys(e.items).length&&(e.selectedItem=0)},removeItemFromCharacter:function(e,t){for(item in"string"==typeof t?delete e.items[t]:(newType=Object.keys(e.items).find((i=>e.items[i].index===t)),delete e.items[newType]),e.items)e.items[item].index>t&&(e.items[item].index-=1)},getSelectedItem:function(e){return Object.values(e.items).find((t=>t.index===e.selectedItem))},getItem:function(e){return this.items[e]},getItemPosition:function(e){let t=Object.values(e.items).find((t=>t.index===e.selectedItem)),i=e.rotation;const{x:s,y:a}=t;let n=s*Math.cos(i)-a*Math.sin(i),o=s*Math.sin(i)+a*Math.cos(i);return{x:e.x+n,y:e.y+o}}};e.exports={client:t,server:i}},83:e=>{const t={setupLocations:function(e){this.game.state[e]={}},createALocation:function(e,t,i,s,a){this.game.state[e][t]={...i,color:s,rules:a}},handleLocations:function(e,t){const i=this;Object.values(this.game.state[e]).forEach((s=>{const{width:a,height:n,x:o,y:c}=s;this.game.sizes[e]?i.handleCollision(t,s,(function(e,t){t.rules(e)})):i.handleCollision(t,{...s,x:o+a/2,y:c+n/2},(function(e,t){t.rules(e)}))}))},nextLocationId:function(e){return`${e}${Object.keys(this.game.state[e]).length+1}`}};e.exports={client:{addLocations:function(e,t=1){this.game[e]={},this.game.scales[e]=t,this.sendSpriteSize(e,t)},getLocations:function(e,t=function(){},i=function(){},s=function(){}){const{game:a}=this,n=this;a.roomJoined?(a.room.listen(e+"/:id",(function(s){if("add"===s.operation){const{id:i,x:o,y:c,width:r,height:l,color:h}=s.value;if(a.textures.exists(e)){const t=a.add.sprite(o,c,e);t.setScale(a.scales[e]||1),a[e][i]={sprite:t,...s.value}}else{const t=n.createSquare(r,l,o,c,h);a[e][i]={graphics:t,...s.value}}t(a[e][i],s.value)}else if("remove"===s.operation){const{id:t}=s.path,{graphics:n,sprite:o}=a[e][t];n&&n.destroy(),o&&o.destroy(),delete a[e][t],i(t)}})),a.room.listen(e+"/:id/:attribute",(function(t){if("replace"===t.operation){const{id:i,attribute:o}=t.path,c=a[e][i];!c.graphics||"x"!==o&&"y"!==o&&"width"!==o&&"height"!==o&&"color"!==o?!c.sprite||"x"!==o&&"y"!==o?c[o]=t.value:c.sprite[o]=t.value:(c[o]=t.value,n.updateSquare(c.width,c.height,c.x,c.y,c.color,c.graphics)),s(i,o,t.value)}}))):this.addConnectEvent("getLocations",[e,t,i,s])}},server:t}},488:e=>{const t={setupResources:function(e){this.game.state[e]={},this.counts[e]=0},createResources:function(e,t){for(let i=0;i<t;i++){let t=Math.random()*this.boardWidth,i=Math.random()*this.boardHeight;this.createAResource(e,t,i)}},createAResource:function(e,t,i){this.counts[e]+=1,this.game.state[e][this.counts[e]]={id:this.counts[e],x:t,y:i,type:"resource",height:103,width:61}},deleteAResource:function(e,t){delete this.game.state[e][t]}};e.exports={client:{addResources:function(e){this.game[e]={}},getResources:function(e,t=function(){},i=function(){},s=function(){}){const{game:a}=this;a.roomJoined?(a.room.listen(e+"/:id",(function(s){if("add"===s.operation){const{id:i,x:n,y:o}=s.value;a[e][i]={sprite:a.add.sprite(n,o,e),id:i},t(a[e][i],s.value)}else if("remove"===s.operation){const{id:t}=s.path;a[e][t].sprite.destroy(),delete a[e][t],i(t)}})),a.room.listen(e+"/:id/:attribute",(function(t){if("replace"===t.operation){const{id:i,attribute:n}=t.path;a[e][i].sprite[n]=t.value,s(i,n,t.value)}}))):this.addConnectEvent("getResources",[e,t,i,s])}},server:t}},877:(e,t,i)=>{const{serverMethods:s,linkMethods:a,version:n}=i(225);e.exports=class{constructor(){this.version=n,this.game=null,this.counts={},this.boardWidth=500,this.boardHeight=500,this.defaultActions={},this.items={}}setup(e){this.game=e,this.game.setState({board:{}}),this.game.sizes={},this.game.shapes={},this.game.barriers={},a(this,s),this.setDefaultActions(),this.runGameLoop()}}},281:e=>{function t(e){const t=document.getElementById("input-overlay");e&&t.classList.contains("hide")?t.classList.remove("hide"):e||t.classList.contains("hide")||t.classList.add("hide")}function i(e){console.log(e+" is joining...")}const s=e=>e.join("\n");function a({lives:e}){const t=[];for(let i=0;i<e;i++)t.push('<span class="life"></span>');return s(t)}const n={StoreItem:class{constructor(e,t,i,s,a){this.image="asset/"+e,this.name=t,this.costAttr=i,this.cost=s,this.action=a}},useLoginScreen:function(e=i,a="IO Game",n="Display Name",o="START"){const c=document.querySelector("#input-overlay > form.login");c.innerHTML=s([`<h1>${a}</h1>`,`<input id="displayName" type="text" placeholder="${n}" />`,'<div id="characters" class="hide"></div>',`<button type="submit">${o}</button>`]),t(!0),c.classList.remove("hide"),c.onsubmit=function(i){i.preventDefault();const s=document.getElementById("displayName").value||"player";c.classList.add("hide"),t(!1);let a=document.querySelector(".selectedCharacter");a?e(s,a.name):e(s)}},useHowToScreen:function(e="How To",t,i){const a=document.querySelector("#input-overlay > form.login");let n=document.createElement("div");n.id="howTo",n.innerHTML="?",document.getElementById("exit-button").onclick=function(e){e.preventDefault(),document.querySelector("#input-overlay > div.howTo").classList.add("hide")},n.onclick=function(a){a.preventDefault();const n=document.querySelector("#input-overlay > div.howTo > div.descriptions"),o=document.querySelector("#input-overlay > div.howTo > div.contributors");document.querySelector("#input-overlay > div.howTo").classList.remove("hide");let c=[];for(key in t)c.push(`<div class='description'><h3>${key}</h3><p>${t[key]}</p></div>`);let r=[];for(key in i)r.push(`<div class='description'><h3>${key}</h3><p>${i[key]}</p></div>`);n.innerHTML=s([`<h1>${e}</h1>`,...c]),o.innerHTML=s(["<h1>Contributors</h1>",...r])},a.prepend(n)},usePlayerSelectScreen:function(e){const t=document.querySelector("#input-overlay > form.login > div#characters");for(key in t.classList.remove("hide"),newCharacters=[],e){let i=document.createElement("div");i.classList.add("character"),i.style.background=`url(../asset/${e[key]})`,i.style.backgroundSize="contain",i.style.backgroundPosition="center",i.style.backgroundRepeat="no-repeat",i.name=key,i.onclick=function(){document.querySelector(".selectedCharacter").classList.remove("selectedCharacter"),i.classList.add("selectedCharacter")};const s=document.createElement("div");s.appendChild(i),t.appendChild(s)}document.querySelector(".character").classList.add("selectedCharacter")},handleLeaderboard:function(e,t="Leaderboard"){const{game:i}=this;document.querySelector("#game-overlay > .leaderboard").innerHTML=s([`<h3>${t}</h3>`,...Object.entries(i[e]).map((([e,t])=>`<div class="player" id="${e}">\n      ${"number"==typeof t.lives?s(['<div class="lives">',a(t),"</div>"]):""}\n        <div class="text">\n          ${"string"==typeof t.name?s(['<p class="name"'+(this.myId()===e?' style="color: #8BE1FF;"':"")+">",t.name,"</p>"]):""}\n          ${"number"==typeof t.score?s(['<p class="score"'+(this.myId()===e?' style="color: #8BE1FF;"':"")+">",t.score,"</p>"]):""}\n        </div>\n      </div>`))])},useStore:function(e="Store",t){document.querySelector("#input-overlay > .store").innerHTML=s([`<h1>${e}</h1>`,...t.map((e=>`<div class="store-item">\n    <img src="${e.image}" />\n    <h2>${e.name}</h2>\n    <p>Cost: ${e.cost} x ${e.costAttr}</p>\n    <button id="${e.action}">Buy</button>\n    </div>`))]);const i=this;t.forEach((e=>{document.getElementById(e.action).onclick=function(){i.sendAction(e.action)}}))},toggleStore:function(){const e=document.querySelector("#input-overlay > .store");!e.classList.contains("locked")&&e.classList.contains("hide")?(t(!0),e.classList.remove("hide"),e.classList.add("locked")):e.classList.contains("locked")||(t(!1),e.classList.add("hide"),e.classList.add("locked"))},unlockStore:function(){const e=document.querySelector("#input-overlay > .store");e.classList.contains("locked")&&e.classList.remove("locked")}};e.exports={client:n}}},t={},function i(s){if(t[s])return t[s].exports;var a=t[s]={exports:{}};return e[s](a,a.exports,i),a.exports}(877);var e,t}));