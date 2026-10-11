(()=>{
const mode=window.PAGE_MODE;const search=document.getElementById('search'),network=document.getElementById('network'),rows=document.getElementById('rows'),count=document.getElementById('count'),cardsBox=document.getElementById('cards');let valves=[];
const asiKeys=['Rede_ASI','Endereco_ASI','Comando_ASI','Confirmacao_aberta_ASI','Confirmacao_fechada_ASI','Lift_Up_ASI','Lift_Down_ASI'];
const ioKeys=['Entradas_fisicas','Saida_valvula','Saida_Lift_Up','Saida_Lift_Down','Outras_saidas'];
const cols=mode==='asi'?['TAG','Rede_ASI','Endereco_ASI','Comando_ASI','Confirmacao_aberta_ASI','Confirmacao_fechada_ASI','Lift_Up_ASI','Lift_Down_ASI']:['TAG','Entradas_fisicas','Saida_valvula','Saida_Lift_Up','Saida_Lift_Down','Outras_saidas','Revisao'];
/* Campos exibidos nos cartões (celular). [rótulo, campo, tamanho: 'half' = meia largura]. Campos vazios são omitidos. */
const cardFields=mode==='asi'?[['Rede AS-i','Rede_ASI','half'],['Endereço AS-i','Endereco_ASI','half'],['Comando AS-i','Comando_ASI'],['Confirmação aberta','Confirmacao_aberta_ASI'],['Confirmação fechada','Confirmacao_fechada_ASI'],['Lift Up','Lift_Up_ASI'],['Lift Down','Lift_Down_ASI']]:[['Entrada física','Entradas_fisicas'],['Saída da válvula','Saida_valvula'],['Lift Up','Saida_Lift_Up'],['Lift Down','Saida_Lift_Down'],['Outras saídas','Outras_saidas']];
const mq=window.matchMedia('(max-width:760px)');
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function hasAny(v,keys){return keys.some(k=>String(v[k]??'').trim()!=='');}
function url(tag){return 'detalhe.html?tag='+encodeURIComponent(tag)+'&mode='+mode;}
function cardHtml(v){
  const items=cardFields.filter(f=>String(v[f[1]]??'').trim()!=='').map(f=>'<div class="vf'+(f[2]==='half'?' half':'')+'"><dt>'+esc(f[0])+'</dt><dd>'+esc(v[f[1]])+'</dd></div>').join('');
  return '<a class="vcard" href="'+esc(url(v.TAG))+'" aria-label="Abrir detalhes de '+esc(v.TAG)+'"><div class="vcard-head"><span class="tag">'+esc(v.TAG)+'</span><span class="chev" aria-hidden="true">›</span></div><dl class="vcard-body">'+items+'</dl></a>';
}
function render(){const q=search.value.trim().toLowerCase(),net=network.value;const filtered=valves.filter(v=>{const fields=cols.map(k=>String(v[k]??''));return (!q||fields.some(x=>x.toLowerCase().includes(q)))&&(!net||v.Rede_ASI===net)});count.textContent=filtered.length.toLocaleString('pt-BR')+' resultado(s) de '+valves.length.toLocaleString('pt-BR');
  if(mq.matches&&cardsBox){
    rows.innerHTML='';
    cardsBox.innerHTML=filtered.length?filtered.map(cardHtml).join(''):'<div class="empty">Nenhum resultado encontrado.</div>';
    return;
  }
  if(cardsBox)cardsBox.innerHTML='';
  rows.innerHTML=filtered.length?filtered.map(v=>'<tr class="clickable-row" tabindex="0" role="link" aria-label="Abrir detalhes de '+esc(v.TAG)+'" data-tag="'+esc(v.TAG)+'">'+cols.map((k,i)=>'<td>'+(i===0?'<span class="tag">'+esc(v[k])+'</span>':esc(v[k]||'—'))+'</td>').join('')+'</tr>').join(''):'<tr><td colspan="'+cols.length+'" class="empty">Nenhum resultado encontrado.</td></tr>';rows.querySelectorAll('tr[data-tag]').forEach(row=>{const go=()=>location.href=url(row.dataset.tag);row.addEventListener('click',go);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});}
fetch('./valvulas.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(d=>{if(!Array.isArray(d.valvulas))throw new Error('O JSON não contém a lista "valvulas".');const all=d.valvulas;valves=all.filter(v=>hasAny(v,mode==='asi'?asiKeys:ioKeys));const nets=[...new Set(valves.map(v=>v.Rede_ASI).filter(Boolean))].sort();network.innerHTML='<option value="">'+(mode==='asi'?'Todas as redes AS-i':'Todas as redes')+'</option>'+nets.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');render();}).catch(e=>{count.textContent='Não foi possível carregar valvulas.json';const msg=esc(e.message)+'. Confira se o JSON está na mesma pasta e abra pelo GitHub Pages ou por um servidor local.';rows.innerHTML='<tr><td colspan="'+cols.length+'" class="empty">'+msg+'</td></tr>';if(cardsBox)cardsBox.innerHTML='<div class="empty">'+msg+'</div>';});
search.addEventListener('input',render);network.addEventListener('change',render);document.getElementById('clear').addEventListener('click',()=>{search.value='';network.value='';render();});
(mq.addEventListener?mq.addEventListener('change',render):mq.addListener(render));
document.querySelectorAll('.nav a').forEach(a=>{if(a.dataset.page===mode)a.classList.add('active')});
/* botão "voltar ao topo" (útil em listas longas no celular) */
const up=document.createElement('button');up.type='button';up.className='totop';up.textContent='↑ Topo';up.setAttribute('aria-label','Voltar ao topo');up.hidden=true;document.body.appendChild(up);
up.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('scroll',()=>{up.hidden=window.scrollY<700},{passive:true});
})();
