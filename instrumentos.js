(()=>{
const mode=window.PAGE_MODE,$=id=>document.getElementById(id);
const TIPOS={valvula_pneumatica:'Válvula pneumática',valvula_controle:'Válvula de controle',chave_nivel_alto:'Chave de nível alto',chave_nivel_baixo:'Chave de nível baixo',chave_fluxo:'Chave de fluxo',chave_pressao:'Chave de pressão',transmissor_pressao:'Transmissor de pressão',transmissor_temperatura:'Transmissor de temperatura',transmissor_vazao:'Transmissor de vazão',transmissor_nivel:'Transmissor de nível',sensor_rotacheck:'Sensor rotacheck',oximetro_inline:'Oxímetro inline'};
const FORMAS={remota:'I/O em remota',gateway:'Gateway AS-i (bit de dados)',asi_tag:'AS-i (sinal nomeado)',indireta:'Fonte indireta'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const empty=v=>v===null||v===undefined||String(v).trim()==='';
const nm=t=>TIPOS[t]||t,url=t=>'ficha.html?tag='+encodeURIComponent(t);
const prin=o=>[o.Saida_valvula,o.Entrada_analogica,o.Entrada_chave,o.Saida_analogica,o.Entradas_fisicas,o.Comando_ASI,o.Fonte_indireta].find(x=>!empty(x))||'';
function erro(e){const m=esc(e.message)+'. Confira se instrumentos.json está na mesma pasta e abra pelo GitHub Pages ou por um servidor local.';
  if(mode==='ficha'){$('title').textContent='Não foi possível abrir o instrumento';$('subtitle').textContent=e.message;$('ficha').innerHTML='<div class="empty">'+m+'</div>';}
  else{$('count').textContent='Não foi possível carregar instrumentos.json';$('rows').innerHTML='<tr><td colspan="6" class="empty">'+m+'</td></tr>';$('cards').innerHTML='<div class="empty">'+m+'</div>';}}

function lista(d){
  const S=d.instrumentos,LIM=300,mq=window.matchMedia('(max-width:760px)');let lim=LIM;
  const all=S.map(o=>({o,q:[o.TAG,o.Descricao,o.Equipamento,o.Setor,o.Subconjunto,nm(o.Tipo)].concat(o.Enderecos_IO.map(e=>e.Endereco)).join(' ').toLowerCase()}));
  const uniq=k=>[...new Set(S.map(o=>o[k]).filter(x=>!empty(x)))].sort();
  $('tipo').innerHTML+=uniq('Tipo').sort((a,b)=>nm(a).localeCompare(nm(b))).map(t=>'<option value="'+esc(t)+'">'+esc(nm(t))+'</option>').join('');
  $('equips').innerHTML=uniq('Equipamento').map(v=>'<option value="'+esc(v)+'">').join('');
  const cardHtml=o=>{const f=(l,v,h)=>empty(v)?'':'<div class="vf'+(h?' half':'')+'"><dt>'+esc(l)+'</dt><dd>'+esc(v)+'</dd></div>';
    return '<a class="vcard" href="'+esc(url(o.TAG))+'" aria-label="Abrir ficha de '+esc(o.TAG)+'"><div class="vcard-head"><span class="tag">'+esc(o.TAG)+'</span><span class="chev" aria-hidden="true">›</span></div><dl class="vcard-body">'+f('Tipo',nm(o.Tipo))+f('Descrição',o.Descricao)+f('Setor',o.Setor,1)+f('Área',o.Area_codigo,1)+f('Equipamento',o.Equipamento)+f('Endereço',prin(o))+'</dl></a>';};
  const rowHtml=o=>'<tr class="clickable-row" tabindex="0" role="link" aria-label="Abrir ficha de '+esc(o.TAG)+'" data-tag="'+esc(o.TAG)+'"><td><span class="tag">'+esc(o.TAG)+'</span></td><td>'+esc(nm(o.Tipo))+'</td><td>'+esc(o.Descricao||'—')+'</td><td>'+esc(o.Setor||(o.Area_codigo?'Área '+o.Area_codigo:'—'))+'</td><td>'+esc(o.Equipamento||'—')+'</td><td>'+esc(prin(o)||'—')+'</td></tr>';
  function render(){
    const terms=$('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean),t=$('tipo').value,e=$('equip').value.trim().toLowerCase();
    const res=all.filter(x=>(!t||x.o.Tipo===t)&&(!e||(x.o.Equipamento||'').toLowerCase().includes(e))&&terms.every(w=>x.q.includes(w))).map(x=>x.o);
    $('count').textContent=res.length.toLocaleString('pt-BR')+' resultado(s) de '+S.length.toLocaleString('pt-BR');
    const shown=res.slice(0,lim);
    if(mq.matches){$('rows').innerHTML='';$('cards').innerHTML=shown.length?shown.map(cardHtml).join(''):'<div class="empty">Nenhum resultado encontrado.</div>';}
    else{$('cards').innerHTML='';$('rows').innerHTML=shown.length?shown.map(rowHtml).join(''):'<tr><td colspan="6" class="empty">Nenhum resultado encontrado.</td></tr>';
      $('rows').querySelectorAll('tr[data-tag]').forEach(r=>{const go=()=>location.href=url(r.dataset.tag);r.addEventListener('click',go);r.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}});});}
    $('more').innerHTML=res.length>lim?'<button type="button" id="morebtn">Mostrar mais ('+(res.length-lim).toLocaleString('pt-BR')+' restantes)</button>':'';
    if($('morebtn'))$('morebtn').onclick=()=>{lim+=LIM;render();};
  }
  const reset=()=>{lim=LIM;render();};
  ['search','equip'].forEach(i=>$(i).addEventListener('input',reset));['tipo'].forEach(i=>$(i).addEventListener('change',reset));
  $('clear').addEventListener('click',()=>{['search','equip','tipo'].forEach(i=>$(i).value='');reset();});
  (mq.addEventListener?mq.addEventListener('change',render):mq.addListener(render));
  render();
}

function ficha(d){
  const tag=new URLSearchParams(location.search).get('tag'),o=d.instrumentos.find(x=>x.TAG===tag);
  if(!o)throw new Error('Instrumento "'+(tag||'')+'" não encontrado');
  document.title=o.TAG+' — Ficha técnica';$('title').textContent=o.TAG;$('modebadge').textContent=nm(o.Tipo);
  $('subtitle').textContent=o.Descricao||'Descrição não encontrada no arquivo';
  const inf=new Set(o.Campos_inferidos),pen=new Set(o.Campos_pendentes);
  const card=(label,key,val)=>{val=val===undefined?o[key]:val;const e=empty(val);
    return '<div class="address-card'+(e?' is-empty':'')+'"><strong>'+esc(label)+(inf.has(key)&&!e?'<span class="pill inf">inferido</span>':'')+(pen.has(key)?'<span class="pill pen">pendente de validação</span>':'')+'</strong><code>'+(e?(pen.has(key)?'Não encontrado no arquivo':'—'):esc(val))+'</code></div>';};
  const sec=(t,h)=>'<h2 class="sec">'+esc(t)+'</h2><div class="address-grid">'+h+'</div>';
  const io=e=>{const m=[e.Modulo&&'Módulo '+e.Modulo+(e.Modulo_IP?' ('+e.Modulo_IP+')':'')+(e.Modulo_catalogo?' · '+e.Modulo_catalogo:''),e.Gateway&&'Gateway '+e.Gateway,e.Slot!=null&&'Slot '+e.Slot,e.Cartao&&'Cartão '+e.Cartao,e.Canal!=null&&'Canal '+e.Canal,e.Dados&&'Dados '+e.Dados].filter(Boolean).join(' · ');
    return '<div class="address-card"><strong>'+esc(e.Papel)+'</strong><code>'+esc(e.Endereco)+'</code>'+(m?'<span class="meta">'+esc(m)+'</span>':'')+'<span class="meta">'+esc(FORMAS[e.Forma]||e.Forma)+' · programa '+esc(e.Programa)+'</span><details><summary>Ver origem no L5K</summary><code>'+esc(e.Trecho_L5K)+'</code></details></div>';};
  let h=sec('Identificação',card('Tipo','Tipo',nm(o.Tipo))+card('CLP','CLP')+card('Área (código da TAG)','Area_codigo'));
  let x=o.Enderecos_IO.map(io).join('');
  if(!x)x=card('Endereço de I/O','Endereco_IO',o.Endereco_IO);
  if(pen.has('Endereco_fisico'))x+=card('Endereço físico (porta IO-Link)','Endereco_fisico',null);
  h+=sec('Endereços e sinais (I/O, comandos e retornos)',x);
  if(!empty(o.Rede_ASI)){const a=[['Rede / gateway AS-i','Rede_ASI'],['Endereço AS-i','Endereco_ASI'],['Comando AS-i','Comando_ASI'],['Confirmação aberta','Confirmacao_aberta_ASI'],['Confirmação fechada','Confirmacao_fechada_ASI'],['Lift Up','Lift_Up_ASI'],['Lift Down','Lift_Down_ASI']];
    h+=sec('Rede AS-i',a.filter(([l,k])=>k==='Endereco_ASI'||!empty(o[k])).map(([l,k])=>card(l,k)).join(''));}
  if(o.Range_EU_max!==null||pen.has('Range')){const r=(a,b)=>empty(a)&&empty(b)?null:(a??'—')+' a '+(b??'—');
    h+=sec('Faixa e sinal',card('Range bruto','Range',r(o.Range_bruto_min,o.Range_bruto_max))+card('Range em escala (EU)','Range',r(o.Range_EU_min,o.Range_EU_max))+card('Sinal elétrico','Sinal_eletrico'));}
  $('ficha').innerHTML=h;
}
fetch('./instrumentos.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(d=>{if(!Array.isArray(d.instrumentos))throw new Error('O JSON não contém a lista "instrumentos"');(mode==='ficha'?ficha:lista)(d);}).catch(erro);
if(mode==='lista'){const up=document.createElement('button');up.type='button';up.className='totop';up.textContent='↑ Topo';up.hidden=true;up.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});document.body.appendChild(up);window.addEventListener('scroll',()=>{up.hidden=window.scrollY<700},{passive:true});}
})();
