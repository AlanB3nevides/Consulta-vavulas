/* Desenhos esquemáticos ilustrativos por tipo de instrumento (SVG próprio). Usado pela ficha.html */
(()=>{
const A='var(--accent)',M='var(--muted)',T='var(--text)',F='rgba(45,212,168,.16)',W='rgba(56,189,248,.20)',K='stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"',K0='stroke-linejoin="round" stroke-linecap="round"';
const tx=(x,y,s,z=11,c=M,w=600,a='middle')=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="${z}" font-weight="${w}" fill="${c}" font-family="inherit">${s}</text>`;
const ln=(a,b,c,d,col=A,ex='')=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" ${/stroke-width/.test(ex)?K0:K} ${ex}/>`;
const box=(x,y,w,h,s)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${F}" stroke="${A}" ${K}/>`+tx(x+w/2,y+h/2+4,s,12,T,700);
const pipe=()=>`<line x1="20" y1="140" x2="340" y2="140" stroke="${M}" stroke-width="6" stroke-linecap="round"/>`+tx(40,164,'LINHA')+tx(320,164,'LINHA');
const flow=()=>`<path d="M58 122 H92 M85 115 L92 122 L85 129" fill="none" stroke="${M}" ${K}/>`;
const valve=()=>`<polygon points="146,114 180,140 146,166" fill="${F}" stroke="${A}" ${K}/><polygon points="214,114 180,140 214,166" fill="${F}" stroke="${A}" ${K}/>`;
const tank=(top=44)=>`<rect x="110" y="${top}" width="130" height="${170-top}" rx="6" fill="none" stroke="${M}" stroke-width="3"/><rect x="112" y="84" width="126" height="84" fill="${W}"/>`+ln(112,84,238,84,'#38bdf8','stroke-width="1.5" stroke-dasharray="5 4"')+tx(175,186,'TANQUE');
const D={
 valvula_pneumatica:()=>pipe()+valve()+ln(180,140,180,92)+box(138,64,84,28,'ATUADOR'),
 valvula_controle:()=>pipe()+valve()+ln(180,140,180,104)+`<path d="M138 104 A42 42 0 0 1 222 104 Z" fill="${F}" stroke="${A}" ${K}/>`+tx(180,92,'ATUADOR',11,T,700),
 chave_nivel_alto:p=>tank()+ln(240,64,282,64)+`<circle cx="226" cy="64" r="5" fill="${A}"/>`+box(282,50,56,28,p)+tx(310,96,'NÍVEL ALTO',10),
 chave_nivel_baixo:p=>tank()+ln(240,142,282,142)+`<circle cx="226" cy="142" r="5" fill="${A}"/>`+box(282,128,56,28,p)+tx(310,174,'NÍVEL BAIXO',10),
 transmissor_nivel:()=>tank(56)+box(148,28,64,28,'LT')+ln(180,56,180,150,A,'stroke-dasharray="6 4"')+tx(224,128,'SENSOR',10,M,600,'start'),
 chave_fluxo:p=>pipe()+flow()+box(150,56,60,30,p)+ln(180,86,180,116)+`<rect x="175" y="116" width="10" height="26" rx="2" fill="${F}" stroke="${A}" ${K}/>`,
 transmissor_vazao:()=>pipe()+flow()+`<rect x="138" y="118" width="84" height="44" rx="6" fill="${F}" stroke="${A}" ${K}/>`+ln(180,118,180,90)+box(146,60,68,30,'FIT'),
 transmissor_pressao:()=>pipe()+flow()+ln(180,140,180,104)+`<circle cx="180" cy="80" r="26" fill="${F}" stroke="${A}" ${K}/>`+tx(180,85,'PT',13,T,700),
 chave_pressao:p=>pipe()+flow()+ln(180,140,180,92)+box(148,60,64,32,p),
 transmissor_temperatura:()=>pipe()+flow()+ln(180,88,180,100)+box(146,60,68,28,'TT')+`<rect x="173" y="100" width="14" height="62" rx="7" fill="${F}" stroke="${A}" ${K}/>`,
 oximetro_inline:()=>pipe()+flow()+box(140,50,80,30,'OIT')+ln(180,80,180,96)+`<rect x="164" y="96" width="32" height="64" rx="6" fill="${F}" stroke="${A}" ${K}/>`+tx(212,134,'O₂',13,A,700,'start'),
 sensor_rotacheck:()=>`<circle cx="130" cy="106" r="42" fill="none" stroke="${M}" stroke-width="3"/><circle cx="130" cy="106" r="7" fill="${M}"/>`+ln(130,64,130,148,M,'stroke-width="2"')+ln(88,106,172,106,M,'stroke-width="2"')+`<path d="M130 48 A58 58 0 0 1 184 74 M176 70 L184 74 L180 82" fill="none" stroke="${A}" ${K}/>`+ln(172,106,236,106,A,'stroke-dasharray="6 4"')+box(236,90,70,32,'ZI')+tx(130,176,'EIXO EM ROTAÇÃO',10)
};
window.desenho=o=>{const f=D[o.Tipo];if(!f)return'';
  return `<svg viewBox="0 0 360 192" role="img" aria-label="Desenho esquemático ilustrativo de ${o.TAG}">`+tx(180,20,o.TAG,16,A,800)+f(o.Prefixo)+'</svg>';};
})();
