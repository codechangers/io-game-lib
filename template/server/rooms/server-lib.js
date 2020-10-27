!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports["server-lib"]=e():t["server-lib"]=e()}(global,(function(){return t={222:t=>{const e={setupCharacters:function(t){this.game.state[t]={}},createACharacter:function(t,e,i){this.game.state[t][e]={...this.getSize(t),...i,id:e}},getACharacter:function(t,e){return this.game.state[t][e]},deleteACharacter:function(t,e){delete this.game.state[t][e]},nextCharacterId:function(t){return`${t}${Object.keys(this.game.state[t]).length+1}`}};t.exports={client:{addCharacters:function(t,e=1){this.game[t]={},this.game.scales[t]=e,this.sendCharacterSize(t,e)},getCharacters:function(t,e=function(){},i=function(){},s=function(){}){const{game:n}=this;n.roomJoined?(n.room.listen(t+"/:id",(function(s){if("add"==s.operation){const{id:i,x:o,y:a}=s.value,r=n.add.sprite(o,a,t);r.setScale(n.scales[t]||1),n[t][i]={sprite:r,...s.value},e(n[t][i],s.value)}else if("remove"==s.operation){const{id:e}=s.path;n[t][e].sprite.destroy(),delete n[t][e],i(e)}})),n.room.listen(t+"/:id/:attribute",(function(e){if("replace"==e.operation){const{id:i,attribute:o}=e.path;"x"!=o&&"y"!=o||(n[t][i].sprite[o]=e.value),s(i,o,e.value)}}))):this.addConnectEvent("getCharacters",[t,e,i,s])},sendCharacterSize:function(t,e=1){this.canSend()?this.sendAction("setCharacterSize",{type:t,...this.getSpriteSize(t,e)}):this.addConnectEvent("sendCharacterSize",[t,e])}},server:e}},892:t=>{class e{constructor(t,e,i,s){this.width=Number.isNaN(i)?0:i,this.height=Number.isNaN(s)?0:s,this.x=!Number.isNaN(t)&&t>=0?t-this.width/2:-100,this.y=!Number.isNaN(e)&&e>=0?e-this.height/2:-100}collide(t){let s=!1;return t instanceof e?s=this.x<t.x+t.width&&this.x+this.width>t.x&&this.y<t.y+t.height&&this.y+this.height>t.y:t instanceof i?s=t.collide(this):console.log(" * CollisionBox.collide: You can only collide with another collision object!"),s}}class i{constructor(t,e,i){this.x=!Number.isNaN(t)&&t>=0?t:-100,this.y=!Number.isNaN(e)&&e>=0?e:-100,this.radius=Number.isNaN(i)?0:i/2}distanceTo(t){let s=-1;if(t instanceof i){const e=this.x-t.x,i=this.y-t.y;s=Math.sqrt(e*e+i*i)}else if(t instanceof e){const e=Math.abs(t.height*this.x+t.x*t.y-t.x*(t.y+t.height))/Math.sqrt(t.height**2),i=Math.abs(t.height*this.x+(t.x+t.width)*t.y-(t.x+t.width)*(t.y+t.height))/Math.sqrt(t.height**2),n=Math.abs(-t.width*this.y+(t.x+t.width)*t.y-t.x*t.y)/Math.sqrt(t.width**2),o=Math.abs(-t.width*this.y+(t.x+t.width)*(t.y+t.height)-t.x*(t.y+t.height))/Math.sqrt(t.width**2),a=this.x-(t.x+t.width/2),r=this.y-(t.y+t.height/2);s={leftDist:e,rightDist:i,topDist:n,bottomDist:o,centerDist:Math.sqrt(a*a+r*r)}}else console.log(" * CollisionCircle.distanceTo: You can only check with another collision object!");return s}collide(t){let s=!1;if(t instanceof i)s=this.distanceTo(t)<this.radius+t.radius;else if(t instanceof e){const{leftDist:e,rightDist:i,topDist:n,bottomDist:o,centerDist:a}=this.distanceTo(t),r=e<this.radius||i<this.radius||this.x>t.x&&this.x<t.x+t.width,c=n<this.radius||o<this.radius||this.y>t.y&&this.y<t.y+t.height,h=Math.sqrt((t.width/2)**2+(t.height/2)**2);s=r&&c&&a<this.radius+h}else console.log(" * CollisionCircle.collide: You can only collide with another collision object!");return s}}const s={handleCollision:function([t,s],[n,o],a){const{state:r}=this.game;Object.entries(r[t]).forEach((function([t,c]){const{x:h,y:l,width:d,height:u}=c,f="circle"===s?new i(h,l,d):new e(h,l,d,u);Object.entries(r[n]).forEach((function([s,n]){if(t!==s){const{x:t,y:s,width:r,height:h}=n,l="circle"===o?new i(t,s,r):new e(t,s,r,h);f.collide(l)&&a(c,n)}}))}))},handleBoxesCollision:function(t,e,i){return this.handleCollision([t,"box"],[e,"box"],i)},handleBoxOnCircleCollision:function(t,e,i){return this.handleCollision([t,"box"],[e,"circle"],i)},handleCircleOnBoxCollision:function(t,e,i){return this.handleCollision([t,"circle"],[e,"box"],i)},handleCirclesCollision:function(t,e,i){return this.handleCollision([t,"circle"],[e,"circle"],i)}};t.exports={server:s}},228:t=>{t.exports={client:{connect:function(t={}){const{game:e,colyseus:i,connectEvents:s}=this;let n=this;e.room=i.join("main",t),e.room.onJoin.add((()=>{e.roomJoined=!0;for(let t in s)for(let e in s[t])this[t](...s[t][e])})),e.room.listen("board/:id",(function(t){"add"==t.operation&&(n.setSize(500,500),n.createSquare(0,0,t.value.width,t.value.height,t.value.color))}))},addConnectEvent:function(t,e){const{connectEvents:i}=this;i[t]||(i[t]=[]),i[t].push(e)},canSend:function(){return this.game.roomJoined},sendAction:function(t,e){e?this.game.room.send({[t]:!0,...e}):this.game.room.send({[t]:!0})},myId:function(){return this.game.room.sessionId}},server:{handleActions:function(t,e){const i={...this.defaultActions,...t};for(let t in i)e[t]&&i[t](e)}}}},800:t=>{const e={drawBackground:function(t,e=1,i=this.game.width,s=this.game.height){const{game:n}=this,o=n.add.sprite(0,0,t);o.setScale(e),o.depth=0;let{width:a,height:r}=o;a*=e,r*=e;for(let o=0;o<=Math.floor(i/a)+1;o++)for(let i=0;i<=Math.floor(s/r)+1;i++)if(o>0||i>0){const s=n.add.sprite(a*o,r*i,t);s.setScale(e),s.depth=0}},createSquare:function(t,e,i,s,n){var o=new Phaser.Geom.Rectangle(t,e,i,s);this.game.add.graphics({fillStyle:{color:"0x"+n}}).fillRectShape(o)},createSprite:function(t,e,i,s=1){let n=this.game.add.sprite(e,i,t);return n.setScale(s),n},getSpriteSize:function(t,e=1){let i=this.game.add.sprite(-100,-100,t),{width:s,height:n}=i;return i.destroy(),s*=e,n*=e,{width:s,height:n}}},i={setupBoard:function(t,e,i){this.boardWidth=t,this.boardHeight=e,this.game.state.board.board={width:t,height:e,color:i}},getSize:function(t){const{sizes:e}=this.game.state;let i={width:0,height:0};return Object.keys(e).includes(t)&&(i=e[t]),i}};t.exports={client:e,server:i}},417:t=>{const e={setDefaultActions:function(){const{state:t}=this.game;this.defaultActions={setCharacterSize:e=>{const{type:i,width:s,height:n}=e;t.sizes[i]={width:s,height:n},Object.values(t[i]).forEach((t=>{t.width=s,t.height=n}))}}},runGameLoop:function(){const t=this;let e=Date.now();this.game.onUpdate&&setImmediate((function i(){const s=Date.now(),n=s-e;n>0&&(t.game.onUpdate(n),e=s),setImmediate(i)}))}};t.exports={client:{setSize:function(t,e){const{game:i}=this;t>0&&(i.width=t),e>0&&(i.height=e)},loadImage:function(t,e){return this.game.load.image(t,"asset/"+e)},setupKeys:function(t){const{game:e,addConnectEvent:i}=this;e.roomJoined?this.keys=this.game.input.keyboard.addKeys(t):i("setupKeys",[t])},getKeysDown:function(){const t={};for(let e in this.keys)t[e]=this.keys[e].isDown;return t},cameraFollow:function(t){this.game.cameras.main.startFollow(t)},cameraBounds:function(t=this.game.width,e=this.game.height){this.game.cameras.main.setBounds(0,0,t,e)}},server:e}},225:(t,e,i)=>{const s=i(222),n=i(228),o=i(800),a=i(417),r=i(488),c=i(281),h=i(892),l={...s.client,...n.client,...o.client,...a.client,...r.client,...c.client},d={...s.server,...n.server,...o.server,...a.server,...r.server,...h.server};t.exports={clientMethods:l,serverMethods:d,linkMethods:function(t,e){for(let i in e)t[i]=e[i].bind(t)}}},488:t=>{const e={setupResources:function(t){this.game.state[t]={},this.counts[t]=0},createResources:function(t,e){for(var i=0;i<e;i++){let e=Math.random()*boardWidth,i=Math.random()*boardHeight;this.createAResource(t,e,i)}},createAResource:function(t,e,i){this.counts[t]+=1,this.game.state[t][this.counts[t]]={id:this.counts[t],x:e,y:i,type:"resource",height:103,width:61}},deleteAResource:function(t,e){delete this.game.state[t][e]}};t.exports={client:{addResources:function(t){this.game[t]={}},getResources:function(t,e=function(){},i=function(){},s=function(){}){const{game:n}=this;n.room.listen(t+"/:id",(function(s){if("add"==s.operation){const{id:i,x:o,y:a}=s.value;n[t][i]={sprite:n.add.sprite(o,a,t),id:i},e(n[t][i],s.value)}else if("remove"==s.operation){const{id:e}=s.path;n[t][e].sprite.destroy(),delete n[t][e],i(e)}})),n.room.listen(t+"/:id/:attribute",(function(e){if("replace"==e.operation){const{id:i,attribute:o}=e.path;n[t][i].sprite[o]=e.value,s(i,o,e.value)}}))}},server:e}},877:(t,e,i)=>{const{serverMethods:s,linkMethods:n}=i(225);t.exports=class{constructor(){this.game=null,this.counts={},this.boardWidth=500,this.boardHeight=500,this.defaultActions={}}setup(t){this.game=t,this.game.setState({board:{},sizes:{}}),n(this,s),this.setDefaultActions(),this.runGameLoop()}}},281:t=>{function e(t){console.log(t+" is joining...")}const i=t=>t.join("\n");function s({lives:t}){const e=[];for(let i=0;i<t;i++)e.push('<span class="life"></span>');return i(e)}const n={useLoginScreen:function(t=e,i="IO Game",s="Display Name",n="START"){document.getElementById("input-overlay").innerHTML=`<div class="login">\n    <h1>${i}</h1>\n    <input id="displayName" type="text" placeholder="${s}" />\n    <button id="start-button">${n}</button>\n  </div>`,document.getElementById("input-overlay").style.display="flex",document.getElementById("start-button").onclick=function(){const e=document.getElementById("displayName").value||"player";document.getElementById("input-overlay").style.display="none",document.querySelector("#input-overlay > .login").style.display="none",t(e)}},handleLeaderboard:function(t,e="Leaderboard"){const{game:n}=this;document.querySelector("#game-overlay > .leaderboard").innerHTML=i([`<h3>${e}</h3>`,...Object.entries(n[t]).map((([t,e])=>`<div class="player" id="${t}">\n      ${"number"==typeof e.lives?i(['<div class="lives">',s(e),"</div>"]):""}\n        <div class="text">\n          ${"string"==typeof e.name?i(['<p class="name"'+(this.myId()===t?' style="color: #8BE1FF;"':"")+">",e.name,"</p>"]):""}\n          ${"number"==typeof e.score?i(['<p class="score"'+(this.myId()===t?' style="color: #8BE1FF;"':"")+">",e.score,"</p>"]):""}\n        </div>\n      </div>`))])}};t.exports={client:n}}},e={},function i(s){if(e[s])return e[s].exports;var n=e[s]={exports:{}};return t[s](n,n.exports,i),n.exports}(877);var t,e}));