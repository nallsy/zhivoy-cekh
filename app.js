const $=id=>document.getElementById(id);
let running=false,t=0,events=2;
const base={output:92,oee:84,load:76,down:18,defect:1.8,risk:78,weldLoad:88};
function render(){
  let s=running?Math.min(t,8):0;
  const output=running?Math.max(85,92-Math.min(s,7)):92;
  const oee=running?Math.max(77,84-Math.min(s,7)):84;
  const load=running?Math.min(95,76+s*2):76;
  const down=running?18+s*4:18;
  const risk=running&&s>=4?96:running?Math.min(96,78+s*4):78;
  const weld=running?Math.min(97,88+s*2):88;
  $('output').textContent=output+'%';$('carsMade').textContent=output;$('oee').textContent=oee+'%';$('load').textContent=load+'%';$('downtime').textContent=down+' мин';$('defect').textContent=(running&&s>=5?2.4:1.8)+'%';
  $('risk').textContent=risk+'%';$('riskBar').style.width=risk+'%';$('loadWeld').textContent=weld+'%';$('barWeld').style.width=weld+'%';$('forecast').textContent=(running&&s>=5?'85 авто':'100 авто');$('loss').textContent=(running&&s>=5?'7 авто':'7 авто');$('timeRisk').textContent=(running&&s>=4?'СЕЙЧАС':'~60 мин');
  $('wip').textContent=(running&&s>=5?'24 кузова':running?'16 кузовов':'13 кузовов');$('qWeld').textContent=(running&&s>=5?11:running?5:3);$('qPaint').textContent=(running&&s>=5?4:2);$('qAssembly').textContent=(running&&s>=5?5:3);$('qQuality').textContent=running&&s>=5?2:1;
  $('chartLabel').textContent=output+'%';$('bottleneck').textContent='Сварка';$('bottleneckMini').textContent='Сварка';
  $('clock').textContent='10:'+String(Math.min(40,t*5)).padStart(2,'0');
  if(running&&s>=5){
    $('mode').textContent='КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ';$('mode').style.color='#ff8f8f';$('mode').style.background='#3c191d';
    $('welding').classList.add('active');$('weldStatus').textContent='ОТКАЗ';$('weldStatus').className='status bad';
    $('riskText').textContent='WR-04 остановлен. Очередь перед сваркой растёт, прогноз выпуска снижен. AI предлагает немедленное ППР.';
    $('recommendation').textContent='Остановить накопление очереди: выполнить ППР сейчас или перераспределить поток. Система оценивает последствия до изменения плана.';
    $('eventCounter').textContent='4 события';
  } else if(running){
    $('mode').textContent='ПРЕДАВАРИЙНЫЙ РЕЖИМ';$('mode').style.color='#ffd17a';$('mode').style.background='#3b2d13';
    $('welding').classList.add('active');$('weldStatus').textContent='РИСК '+risk+'%';$('weldStatus').className='status warn';
  }
  if(!running||s<5){$('welding').classList.remove('active');}
  $('line').setAttribute('points',running&&s>=5?'0,55 80,60 160,57 240,65 320,70 400,84 480,105 560,120 640,130 720,140 800,150':'0,65 80,62 160,60 240,68 320,58 400,61 480,54 560,58 640,52 720,55 800,48');
  if(running&&s>=5){
    $('incidents').innerHTML='<div class="incident"><span class="badge" style="background:#3c191d;color:#ff8f8f">КРИТИЧНО</span><div><b>WR-04 остановлен</b><small>Сбой сварочного участка · очередь +8 кузовов</small></div></div><div class="incident"><span class="badge yellow">ПРОГНОЗ</span><div><b>Потеря 7 автомобилей</b><small>AI · если не вмешаться до конца смены</small></div></div><div class="incident"><span class="badge yellow">УЗКОЕ МЕСТО</span><div><b>Сварка ограничивает выпуск</b><small>Загрузка 97% · растёт WIP</small></div></div><div class="incident"><span class="badge green">AI</span><div><b>Сформирована рекомендация</b><small>ППР или перераспределение потока</small></div></div>';
  }
}
$('scenarioBtn').onclick=()=>{if(!running){running=true;t=0;$('scenarioBtn').textContent='⏸ Сценарий запущен';}else{running=false;t=0;$('scenarioBtn').textContent='▶ Запустить сценарий отказа';location.reload();}};
$('calculate').onclick=()=>{const a=$('action').value;const vals={none:['85 авто','42 мин','7 авто','Без вмешательства прогнозируется потеря 7 автомобилей.'],maintenance:['91 авто','14 мин','1 авто','ППР сейчас снижает риск аварийного простоя: потенциально сохраняется 6 автомобилей.'],redirect:['89 авто','25 мин','3 авто','Перераспределение потока уменьшает очередь: потенциально сохраняется 4 автомобиля.'],delay:['87 авто','32 мин','5 авто','Перенос ППР увеличивает окно риска: потенциальные потери выше.']}[a];$('wfOutput').textContent=vals[0];$('wfDown').textContent=vals[1];$('wfLoss').textContent=vals[2];$('effect').textContent=vals[3];};

function updateEconomics(){
  const h=Number($('savedHours').value)||0;
  const c=Number($('carsPerHour').value)||0;
  const m=Number($('margin').value)||0;
  const base=h*c*m, low=base*0.5, high=base*2;
  const fmt=n=>new Intl.NumberFormat('ru-RU').format(Math.round(n))+' ₸';
  $('econValue').textContent=fmt(base);
  $('econLow').textContent=fmt(low);
  $('econBase').textContent=fmt(base);
  $('econHigh').textContent=fmt(high);
}
['savedHours','carsPerHour','margin'].forEach(id=>$(id).addEventListener('input',updateEconomics));
setInterval(()=>{if(running){t++;if(t>8)t=8;}render();},1000);render();updateEconomics();
