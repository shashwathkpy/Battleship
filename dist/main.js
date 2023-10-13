(()=>{"use strict";const t=class{constructor(t){this.length=t,this.hitCount=0,this.sunk=!1}hit(){this.hitCount++,this.isSunk()}isSunk(){return this.length==this.hitCount&&(this.sunk=!0),this.sunk}},e=class{constructor(){this.board=this.buildGrid(),this.attacks=[],this.justSunk=!1}buildGrid(){let t=[];for(let e=0;e<10;e++){t.push([]);for(let s=0;s<10;s++)t[e].push(null)}return t}placeShip(e,s,o){const i=new t(o);let n=!1;const l=e[0],a=e[1];if(s){if(!(l+i.length<=this.board.length))return!1;for(let t=0;t<i.length;t++)if(this.board[l+t][a])return n=!0,!1;if(!n){for(let t=0;t<i.length;t++)this.getAdjacent(l+t,a),this.board[l+t][a]=i;return!0}}else{if(!(a+i.length<=this.board.length))return!1;for(let t=0;t<i.length;t++)if(this.board[l][a+t])return n=!0,!1;if(!n){for(let t=0;t<i.length;t++)this.getAdjacent(l,a+t),this.board[l][a+t]=i;return!0}}}validPos(t,e,s,o){return t<0||e<0||t>s-1||e>o-1?0:1}getAdjacent(e,s){let o=10,i=10,n=[];return this.validPos(e,s-1,o,i)&&(n.push([e,s-1]),this.board[e][s-1]instanceof t||(this.board[e][s-1]=1),this.justSunk&&this.attacks.push([e,s-1])),this.validPos(e-1,s-1,o,i)&&(this.board[e-1][s-1]=1,this.justSunk&&this.attacks.push([e-1,s-1])),this.validPos(e-1,s,o,i)&&(n.push([e-1,s]),this.board[e-1][s]instanceof t||(this.board[e-1][s]=1),this.justSunk&&this.attacks.push([e-1,s])),this.validPos(e-1,s+1,o,i)&&(this.board[e-1][s+1]=1,this.justSunk&&this.attacks.push([e-1,s+1])),this.validPos(e,s+1,o,i)&&(n.push([e,s+1]),this.board[e][s+1]instanceof t||(this.board[e][s+1]=1),this.justSunk&&this.attacks.push([e,s+1])),this.validPos(e+1,s+1,o,i)&&(this.board[e+1][s+1]=1,this.justSunk&&this.attacks.push([e+1,s+1])),this.validPos(e+1,s,o,i)&&(n.push([e+1,s]),this.board[e+1][s]instanceof t||(this.board[e+1][s]=1),this.justSunk&&this.attacks.push([e+1,s])),this.validPos(e+1,s-1,o,i)&&(this.board[e+1][s-1]=1,this.justSunk&&this.attacks.push([e+1,s-1])),this.justSunk=!1,n}recieveAttack(e){for(let t=0;t<this.attacks.length;t++)if(this.attacks[t][0]==e[0]&&this.attacks[t][1]==e[1])return"alreadyHit";return this.attacks.push(e),this.board[e[0]][e[1]]instanceof t&&(this.board[e[0]][e[1]].hit(),!0)}allSunk(){for(let e=0;e<this.board.length;e++)for(let s=0;s<this.board.length;s++)if(this.board[e][s]instanceof t&&!this.board[e][s].isSunk())return!1;return!0}},s=class{constructor(t){this.enemyBoard=t,this.attackedCoord,this.possibleAttacks=this.attackList()}attackList(){let t=[];for(let e=0;e<10;e++)for(let s=0;s<10;s++)t.push([e,s]);return t=this.scramble(t),t}attack(t){return this.attackedCoord=t,this.enemyBoard.recieveAttack(t)}smartAttack(t,e){let s=this.enemyBoard.getAdjacent(t[0],t[1]);s=this.scramble(s);let o=[];if("horizontal"==e){for(let e=0;e<s.length;e++)s[e][0]==t[0]&&o.push(s[e]);for(let t=0;t<o.length;t++)this.possibleAttacks.push(o[t]);return o.length}if("vertical"==e){for(let e=0;e<s.length;e++)s[e][1]==t[1]&&o.push(s[e]);for(let t=0;t<o.length;t++)this.possibleAttacks.push(o[t]);return o.length}for(let t=0;t<s.length;t++)this.possibleAttacks.push(s[t]);return s.length}scramble(t){for(let e=t.length-1;e>0;e--){const s=Math.floor(Math.random()*(e+1));[t[e],t[s]]=[t[s],t[e]]}return t}};function o(){const o=new e,n=new e;let l=[5,4,3,3,2];for(let t=0;t<l.length;t++){let e=!1;for(;!e;){const s=[Math.floor(10*Math.random()),Math.floor(10*Math.random())];let o=Math.random()<.5;e=n.placeShip(s,o,l[t])}}const a=new s(o),r=new s(n),h=document.createElement("div");h.classList.add("board"),document.querySelector("body");const c=document.querySelector("#boardArea");c.appendChild(h);let d=[5,4,3,3,2,0],u=d.shift();const p=document.createElement("button"),f=document.querySelector("#content");p.textContent="ROTATE",p.id="rotateBtn",f.appendChild(p);let k=!1;p.onclick=function(){k=!1===k,console.log(k)};const m=document.querySelector("#instruction");m.textContent="Place your ships";for(let e=0;e<10;e++)for(let s=0;s<10;s++){const i=document.createElement("div");i.classList.add("tile"),i.id=`${e},${s}`,i.onclick=function(){const e=this.id.split(",");if(o.placeShip([parseInt(e[0]),parseInt(e[1])],k,u)){u=d.shift();for(let e=0;e<10;e++)for(let s=0;s<10;s++)if(o.board[e][s]instanceof t){const t=document.getElementById(`${e},${s}`);t.classList.add("playerShip"),t.classList.add("ship")}}0==d.length&&(document.querySelectorAll(".tile").forEach((t=>{t.onclick=null,t.onmouseenter=null,t.onmouseleave=null})),c.removeChild(h),f.removeChild(p),b(o),b(n),m.textContent="Shoot an enemy tile.")},i.onmouseenter=function(){const t=document.querySelectorAll(".tile");for(let e=0;e<t.length;e++)if(k){if(t[e].id==this.id&&parseInt(this.id[0])+u<=10)for(let s=e;s<10*u+e;s+=10)t[s].classList.add("placementTile")}else if(t[e].id==this.id&&parseInt(this.id[2])+u<=10)for(let s=e;s<u+e;s++)t[s].classList.add("placementTile")},i.onmouseleave=function(){document.querySelectorAll(".placementTile").forEach((t=>{t.classList.remove("placementTile")}))},h.appendChild(i)}function b(e){const s=document.createElement("div");0==document.getElementsByClassName("board").length?s.id="1":s.id="2",s.classList.add("board"),c.appendChild(s);let l=null,h=[];for(let c=0;c<e.board.length;c++)for(let d=0;d<e.board[c].length;d++){const u=document.createElement("div");u.classList.add("tile"),u.id=`${c},${d},${s.id}`,e.board[c][d]instanceof t&&(u.classList.add("ship"),"1"==s.id&&u.classList.add("playerShip")),"2"==s.id?(u.classList.add("computerTile"),u.onmouseenter=function(){this.classList.add("shootHover")},u.onmouseleave=function(){this.classList.remove("shootHover")},u.onclick=function(){const t=r.attack([c,d]);if(u.style.cursor="default","alreadyHit"!=t){if(t)this.classList.add("hit"),m.textContent="You hit an enemy ship, shoot again!";else{m.textContent="Shoot an enemy tile.",this.classList.add("miss");const t=document.querySelectorAll(".playerTile");let e=!0,s=!1;for(;e;){let i=a.possibleAttacks.pop(),n=a.attack(i);for(;"alreadyHit"==n;)n=a.attack(a.possibleAttacks.pop());t.forEach((t=>{const i=t.id.split(","),r=[parseInt(i[0]),parseInt(i[1])];if(r==a.attackedCoord.toString())if(n){console.log(r),t.classList.add("hit");let e=o.board[i[0]][i[1]];console.log(e),h.push([r[0],r[1]]);let n=null;if(e.hitCount>1&&!e.sunk){if(console.log(r+", "+l),l[0]!=r[0]){n="vertical";let t=a.possibleAttacks.pop();t[1]==r[1]&&a.possibleAttacks.push(t)}if(l[1]!=r[1]){n="horizontal";let t=a.possibleAttacks.pop();t[0]==r[0]&&a.possibleAttacks.push(t)}}l=r,s=!0;let c=a.smartAttack(l,n);if(e.sunk){for(let t=0;t<c;t++)a.possibleAttacks.pop();for(let t=0;t<h.length;t++)console.log("Ship Array:"+h[t][0]),o.justSunk=!0,o.getAdjacent(h[t][0],h[t][1])}}else t.classList.add("miss"),e=!1}))}}if(o.allSunk()||n.allSunk()){n.allSunk()?m.textContent="Congratulations, you sank all the enemy ships!":m.textContent="All your ships have sank, we need a better strategy.",document.querySelectorAll(".computerTile").forEach((t=>{t.onclick=null,t.classList.remove("computerTile"),t.onmouseenter=null}));const t=document.createElement("button");t.textContent="RESTART",f.appendChild(t),t.onclick=function(){i(),f.removeChild(t)}}}}):u.classList.add("playerTile"),s.appendChild(u)}}}function i(){const t=document.querySelector("#boardArea");for(;t.childNodes.length>0;)t.removeChild(t.lastChild);o()}o()})();