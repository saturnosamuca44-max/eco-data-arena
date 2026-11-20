/* EcoData Arena — cenários escolhidos e robôs, motor visual 3.0
   Arte vetorial leve baseada nos conceitos Floresta 1 e Fábrica Tecnológica 2.
   Nenhum elemento altera colisão, pontuação ou física. */
(function(){
'use strict';
const PI=Math.PI, TAU=2*PI;
function circle(g,x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
function rounded(g,x,y,w,h,r,fill,stroke,lw=1){g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}}
function poly(g,points,fill){g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);g.closePath();g.fillStyle=fill;g.fill()}
function grad(g,y0,y1,stops){const v=g.createLinearGradient(0,y0,0,y1);stops.forEach(x=>v.addColorStop(x[0],x[1]));return v}
function line(g,x1,y1,x2,y2,col,w=2){g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.strokeStyle=col;g.lineWidth=w;g.stroke()}
function forest(g,t,camera){
 const tt=t*.001,gp=camera*.045;
 g.fillStyle=grad(g,0,460,[[0,'#75c9e7'],[.36,'#c0ecdf'],[.62,'#7bbf8e'],[1,'#245d43']]);g.fillRect(0,0,1000,460);
 circle(g,690,100,42,'#f9e3acaa');
 for(let i=0;i<7;i++){
  const x=((i*204+90-tt*5)%1260+1260)%1260-100,y=64+(i%3)*21;
  g.save();g.globalAlpha=.28;circle(g,x,y,26,'#ffffff');circle(g,x+25,y+2,21,'#ffffff');circle(g,x-24,y+8,17,'#ffffff');g.restore();
 }
 // Montanhas que descem em direção ao mar.
 poly(g,[[0,226],[120,144],[205,205],[319,123],[408,192],[508,139],[633,195],[755,142],[863,197],[1000,122],[1000,278],[0,278]],'#699f8e');
 poly(g,[[0,260],[102,187],[196,232],[284,166],[360,236],[495,174],[615,241],[760,179],[852,239],[1000,177],[1000,295],[0,295]],'#407d70');
 // Oceano ao fundo e delta do rio. Navio distante e mancha local de petróleo.
 g.fillStyle=grad(g,210,308,[[0,'#4eafd4'],[1,'#19718f']]);g.fillRect(365,222,430,80);
 g.save();g.globalAlpha=.72;
 g.fillStyle='#161f2b';g.beginPath();g.ellipse(670,253+Math.sin(tt*1.2)*1.2,62,14,0,0,TAU);g.fill();
 g.globalAlpha=.35;g.fillStyle='#15242a';g.beginPath();g.ellipse(660,263,92,14,0,0,TAU);g.fill();
 g.restore();
 poly(g,[[639,228],[712,228],[701,241],[651,241]],'#2c3840');
 rounded(g,659,217,27,11,2,'#e9edf0','#4f555f');rounded(g,670,202,5,16,1,'#e9edf0');line(g,673,201,673,188,'#343b40',2);
 for(let i=0;i<12;i++){const x=406+i*29,y=250+i%3*10;line(g,x,y,x+10,y+.7,'#b5e7dd99',1)}
 // Rio sinuoso, tornando-se mais largo em primeiro plano.
 g.beginPath();g.moveTo(472,239);g.bezierCurveTo(414,282,551,316,443,350);g.bezierCurveTo(349,400,478,425,389,460);
 g.lineTo(697,460);g.bezierCurveTo(639,421,562,387,622,345);g.bezierCurveTo(706,303,554,274,577,239);g.closePath();
 g.fillStyle=grad(g,235,460,[[0,'#3293b1'],[.62,'#2ca7bd'],[1,'#1b8497']]);g.fill();
 for(let i=0;i<17;i++){
  const x=433+(i%6)*37+Math.sin(tt*.7+i)*3,y=274+Math.floor(i/6)*54+i%2*10;
  line(g,x,y,x+10+3*Math.sin(tt+i),y,'#c7f8d577',1.7);
 }
 // Margens e rochedos gramados.
 poly(g,[[0,278],[265,251],[382,282],[408,345],[323,424],[365,460],[0,460]],'#4a935b');
 poly(g,[[1000,277],[824,251],[682,283],[649,348],[751,432],[709,460],[1000,460]],'#3d8759');
 poly(g,[[0,368],[128,326],[288,371],[277,408],[77,452],[0,460]],'#42764a');
 poly(g,[[1000,351],[912,310],[791,352],[818,412],[1000,459]],'#346b47');
 for(let i=0;i<19;i++){
  const x=(i*91+47)%1000,y=288+(i*61)%160;
  if(Math.abs(x-500)<95)continue;
  g.fillStyle=i%3===0?'#5b8050':'#71975a';g.beginPath();g.ellipse(x,y,16+(i%4)*6,8+(i%3)*3,-.2,0,TAU);g.fill();
 }
 // Painéis solares e turbina eólica distantes: sustentabilidade aplicada.
 g.save();g.translate(250,259);poly(g,[[0,0],[62,1],[52,23],[-11,23]],'#224455');for(let i=0;i<4;i++)for(let j=0;j<2;j++)rounded(g,i*14-4,j*9+3,12,7,1,'#70b8c1','#c7f9e6',.6);g.restore();
 line(g,812,235,812,169,'#e3f3dc',4);for(let k=0;k<3;k++){const a=tt*.48+k*TAU/3;line(g,812,169,812+23*Math.cos(a),169+23*Math.sin(a),'#e3f3dc',3)}
 // Árvores laterais em planos: copa e galhos balançam muito suavemente.
 function tree(x,y,size,salt){
  g.save();g.translate(x-gp*(salt*.16),y);g.scale(size,size);
  g.fillStyle='#614d35';g.beginPath();g.moveTo(-17,0);g.quadraticCurveTo(-1,-70,4,-139);g.quadraticCurveTo(5,-175,15,-188);g.lineTo(21,-183);g.quadraticCurveTo(12,-126,16,-72);g.lineTo(22,0);g.fill();
  line(g,7,-108,-53,-151,'#5b472f',9);line(g,12,-125,51,-179,'#634e33',8);
  g.translate(0,-161);g.rotate(Math.sin(tt*.6+salt)*.017);
  for(let i=0;i<10;i++){let a=i*2.399+salt,s=38+((i*37)%31),px=Math.cos(a)*s,py=Math.sin(a)*s*.48;
   circle(g,px,py,34+(i%3)*6,['#2f7550','#438f52','#62a65a','#30724c'][i%4]);
  }
  for(let j=0;j<6;j++){let a=j*TAU/6+salt;g.save();g.translate(Math.cos(a)*63,Math.sin(a)*29);g.rotate(Math.sin(tt*.9+j+salt)*.07);g.fillStyle='#9cdb62';g.beginPath();g.ellipse(0,0,7,15,.8,0,TAU);g.fill();g.restore()}
  g.restore();
 }
 tree(80,366,1.35,1);tree(928,370,1.35,2);tree(220,295,.55,3);tree(807,287,.51,4);
 for(let i=0;i<22;i++){
  const x=((i*151+tt*(i%2?9:-7))%1120+1120)%1120-50,y=58+(i*61)%340;
  if(x>360&&x<640&&y>300)continue;
  g.save();g.globalAlpha=.4;g.translate(x,y+Math.sin(tt+i)*3);g.rotate(tt*.45+i);
  g.fillStyle=['#c7f47d','#64a765','#d4e798'][i%3];g.beginPath();g.ellipse(0,0,3.7,8,.45,0,TAU);g.fill();g.restore();
 }
}
function factory(g,t,camera){
 const tt=t*.001,gp=camera*.036;
 g.fillStyle=grad(g,0,460,[[0,'#0b2737'],[.44,'#174e69'],[.8,'#0b4652'],[1,'#071b2b']]);g.fillRect(0,0,1000,460);
 for(let i=0;i<23;i++){
  const x=((i*113+40-gp*.45)%1150+1150)%1150-40;
  const h=82+(i*47)%150;
  rounded(g,x,265-h,32+(i%4)*8,h,2,i%4?'#20465b':'#1c5c65');
  for(let k=0;k<3;k++)rounded(g,x+7,270-h+k*20,12,7,2,'#69b9c233');
 }
 // Treliças e passarelas suspensas.
 rounded(g,0,78,1000,14,1,'#173540','#45869b',2);rounded(g,0,192,1000,12,1,'#183d4c','#5d8995',2);
 for(let i=0;i<13;i++){const x=i*83+((i%2)*17);line(g,x,0,x+28,78,'#2c5261',4);line(g,x,78,x+30,192,'#2c5861',3)}
 // Tanques e reatores de energia limpa, imersos na fábrica.
 const plants=[120,320,555,820];
 plants.forEach((x,i)=>{
  const y=145+(i%2)*32,w=78+(i%3)*16,h=175+(i%2)*36;
  rounded(g,x,y,w,h,14,'#092f3c','#6cbdc8',4);
  rounded(g,x+10,y+12,w-20,h-28,9,'#2b829182','#b3ebd344',2);
  g.save();g.globalAlpha=.13+(.08*Math.sin(tt*1.7+i));rounded(g,x+14,y+19,w-28,h-40,9,'#96ffe6');g.restore();
  for(let k=0;k<3;k++){circle(g,x+w/2,y+34+k*46,11+k%2*5,'#6df8b155');circle(g,x+w/2,y+34+k*46,4,'#b2fbe7')}
  line(g,x-18,y+27,x,y+27,'#438ea1',7);line(g,x+w,y+h-20,x+w+19,y+h-20,'#438ea1',7);
 });
 for(let i=0;i<5;i++){const x=35+i*219;rounded(g,x,311,165,115,7,'#123c4a','#4f9e9d',3);
  rounded(g,x+12,325,141,58,4,'#224a5f','#7bc2c1',1.5);
  for(let j=0;j<7;j++){const alpha=.24+.36*(.5+.5*Math.sin(tt*1.1+i+j));g.save();g.globalAlpha=alpha;rounded(g,x+20+j*18,337,9,8,2,j%3?'#8df6b7':'#5adeef');g.restore()}
  rounded(g,x+20,394,117,12,3,'#3d7889');
 }
 rounded(g,0,423,1000,37,2,'#08232e','#418d93',4);
 for(let i=0;i<14;i++){let x=i*83;rounded(g,x,426,45,14,2,'#1c5364','#347f91',1);line(g,x,448,x+50,448,'#60c9bd88',2)}
 // Animação suave de luzes dos circuitos e monitores.
 for(let i=0;i<34;i++){
  const x=14+(i*73)%980,y=35+(i*47)%330;
  const a=.2+.5*(.5+.5*Math.sin(tt*(.6+i%4*.16)+i));
  g.save();g.globalAlpha=a;circle(g,x,y,1.5+i%2,i%4?'#71ffe2':'#a1ecfc');g.restore();
 }
 for(let i=0;i<8;i++){
  const x=48+i*132,y=54+(i%2)*106;
  rounded(g,x,y,38,15,2,'#244c5e','#79adad',1);
  g.save();g.globalAlpha=.28+.5*(.5+.5*Math.sin(tt*1.2+i*1.8));rounded(g,x+5,y+4,27,5,2,i%2?'#5cdbde':'#9efab6');g.restore();
 }
 // Algumas plantas sobre estruturas mostram uma fábrica eco-tecnológica.
 for(let i=0;i<8;i++){
  const x=80+i*125,y=197+(i%3)*10;g.save();g.translate(x,y);g.rotate(Math.sin(tt*.6+i)*.03);
  line(g,0,0,0,-16,'#62bc7e',3);
  g.fillStyle='#63a867';g.beginPath();g.ellipse(-6,-14,8,4,-.6,0,TAU);g.ellipse(6,-18,8,4,.65,0,TAU);g.fill();g.restore();
 }
}
function robot(g,p,t,id,worldWidth,spectator){
 if(!p.alive)return;
 const palette=p.color|| (id===0?'#5df4b4':'#6cbcff');
 let shift=0;
 // Afaste ligeiramente os sprites na largada para os dois ficarem visíveis.
 const x=p.x+shift,y=p.y,run=p.grounded&&Math.abs(p.vx)>16;
 const air=!p.grounded,up=air&&p.vy<0;
 const swing=run?Math.sin(p.step*1.45):0;
 const bob=run?Math.abs(swing)*1.1:Math.sin(t/380+id)*.45;
 const face=p.facing||1;
 const leg=run?swing*5:air?up?5:-3:0;
 g.save();g.translate(x+16,y+22+bob);g.scale(face,1);g.rotate(air?(up?-.11:.07):run?swing*.04:0);
 // Brilho circular e sombra de propulsão.
 g.shadowBlur=9;g.shadowColor=palette;
 // Pernas articuladas. No salto elas se recolhem; na corrida alternam.
 g.lineCap='round';g.lineJoin='round';g.strokeStyle='#162d39';g.lineWidth=7;
 g.beginPath();g.moveTo(-7,13);g.lineTo(-7+leg,23-(up?4:0));g.moveTo(7,13);g.lineTo(7-leg,23-(up?4:0));g.stroke();
 line(g,-7,15,-7+leg,23-(up?4:0),palette,3);line(g,7,15,7-leg,23-(up?4:0),palette,3);
 rounded(g,-14+leg,20-(up?4:0),15,6,3,'#eff8f9','#172d37',1.8);
 rounded(g,2-leg,20-(up?4:0),15,6,3,'#eff8f9','#172d37',1.8);
 rounded(g,-12+leg,22-(up?4:0),10,3,2,palette);rounded(g,4-leg,22-(up?4:0),10,3,2,palette);
 // Backpack com painel solar para eco-robô ou processador para tec-robô.
 rounded(g,-21,-9,12,24,4,'#152e41',palette,2);
 rounded(g,-20,-6,9,13,1,id===0?'#265e6e':'#184f85','#c3f6fb',1);
 for(let j=0;j<3;j++)line(g,-18,-4+j*4,-13,-4+j*4,id===0?'#9ddbb8':'#8ad6ff',1);
 // Braços mecânicos com balanço oposto ao movimento.
 g.strokeStyle='#d3e7ee';g.lineWidth=8;
 g.beginPath();g.moveTo(-11,-6);g.lineTo(-17-swing*4,7+(up?-7:0));g.moveTo(11,-6);g.lineTo(17+swing*4,7+(up?-7:0));g.stroke();
 g.strokeStyle=palette;g.lineWidth=3;
 g.beginPath();g.moveTo(-13,-5);g.lineTo(-17-swing*4,7+(up?-7:0));g.moveTo(13,-5);g.lineTo(17+swing*4,7+(up?-7:0));g.stroke();
 circle(g,-17-swing*4,7+(up?-7:0),4,'#182d38');circle(g,17+swing*4,7+(up?-7:0),4,'#182d38');
 // Couraça branca e acento escolhido pelo usuário.
 rounded(g,-14,-12,28,29,8,'#e0eef0','#142a36',2.7);
 rounded(g,-11,-8,22,20,6,'#a1b7be',palette,2);
 rounded(g,-7,-5,14,12,4,'#0b303d');
 g.strokeStyle=palette;g.lineWidth=2.7;
 if(id===0){ // folhas luminosas
   g.beginPath();g.ellipse(-3,-1,3,5,-.6,0,TAU);g.ellipse(3,-1,3,5,.6,0,TAU);g.stroke();
 }else{
   for(let i=0;i<3;i++){line(g,-6,-3+i*4,6,-3+i*4,palette,1.5);circle(g,-8,-3+i*4,1.2,palette)}
 }
 // Capacete robótico arredondado e visor escuro expressivo.
 rounded(g,-19,-38,38,30,14,'#e8f4f2','#162c36',3.5);
 rounded(g,-16,-35,32,22,11,'#0a252c',palette,2.2);
 // Orelhas/headphones personalizadas.
 circle(g,-18,-24,8,'#d7f1ef');circle(g,18,-24,8,'#d7f1ef');
 circle(g,-18,-24,5,palette);circle(g,18,-24,5,palette);
 circle(g,-18,-24,2.2,'#13353d');circle(g,18,-24,2.2,'#13353d');
 const blink=(Math.floor((t+id*1000)/4400)%2===1)&&((t+id*1000)%4400<120);
 if(blink){line(g,-8,-25,-3,-25,'#bcffee',2);line(g,3,-25,8,-25,'#bcffee',2)}
 else {rounded(g,-10,-29,6,9,3,palette);rounded(g,4,-29,6,9,3,palette)}
 g.beginPath();g.arc(0,-20,3,0,PI);g.strokeStyle=palette;g.lineWidth=1.4;g.stroke();
 if(id===0){ // folha nascendo do capacete
   line(g,0,-38,0,-43,'#95f2b5',2);
   g.fillStyle='#86e46d';g.beginPath();g.ellipse(-5,-44,7,3,-.55,0,TAU);g.ellipse(5,-46,8,3,.55,0,TAU);g.fill();
 }else{ // antena do robô de banco de dados
   line(g,10,-38,11,-46,'#a2eefb',2);circle(g,11,-47,3,palette);
   rounded(g,-8,-40,13,3,1,'#48778d');
 }
 g.restore();g.shadowBlur=0;
 // Feedback individual de cada jogador e nome continuam preservados.
 g.save();g.font='800 11px system-ui';
 const name=String(p.name).slice(0,17),labelW=Math.min(178,Math.max(56,g.measureText(name).width+18));
 let nx=Math.max(2,Math.min((worldWidth||1000)-labelW-2,x+16-labelW/2));
 rounded(g,nx,y-35,labelW,19,6,'#092331ec',palette,1.2);
 g.fillStyle='#f5fffc';g.textAlign='center';g.fillText(name,nx+labelW/2,y-22);
 if(spectator){g.fillStyle='#c1cbd2';g.font='800 10px monospace';g.fillText('ESPECTADOR',x+16,y-42)}
 g.restore();
}
const MAPS={forest:'Floresta sustentável',technology:'Fábrica tecnológica'};
const World={
 map:'technology', MAPS,
 drawBackground(g,t,map,camera){g.save();if(map==='forest')forest(g,t,camera||0);else factory(g,t,camera||0);g.restore()},
 drawRobot:robot,
 renderThumb(canvas,map){if(!canvas)return;const g=canvas.getContext('2d');if(!g)return;g.clearRect(0,0,canvas.width,canvas.height);g.save();g.scale(canvas.width/1000,canvas.height/460);this.drawBackground(g,6500,map,0);g.restore();}
};
window.EcoWorld=World;
})();
