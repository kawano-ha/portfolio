// シンプルなインタラクティブ機能：プロジェクトの読み込み、reveal、tilt、モーダル
const projectsUrl = 'projects.json';

// helper: create element with class
const el = (tag, cls) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
};

async function loadProjects(){
  try{
    const res = await fetch(projectsUrl);
    const data = await res.json();
    renderProjects(data.projects);
    fillAbout(data.meta);
  }catch(e){
    console.error('projects load failed', e);
    document.getElementById('projects-grid').innerText = 'プロジェクトの読み込みに失敗しました。';
  }
}

function renderProjects(list){
  const grid = document.getElementById('projects-grid');
  list.forEach(p=>{
    const card = el('article','card reveal');
    card.tabIndex = 0;
    card.dataset.id = p.id;
    const h = el('h4'); h.textContent = p.title;
    const short = el('div','short'); short.textContent = p.short;
    const meta = el('p','meta'); meta.textContent = `役割: ${p.role} ・ 期間: ${p.period}`;
    const btn = el('button','btn');
    btn.textContent = '詳細を開く';
    btn.addEventListener('click', ()=>openModal(p));
    card.appendChild(h);
    card.appendChild(short);
    card.appendChild(meta);
    card.appendChild(btn);
    grid.appendChild(card);

    // tilt mousemove
    card.addEventListener('mousemove', (ev)=> {
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      const tx = x * 8;
      const ty = y * -8;
      card.style.transform = `translateY(-6px) rotateX(${ty}deg) rotateY(${tx}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', ()=> {
      card.style.transform = '';
    });
    card.addEventListener('focus', ()=> openModal(p));
  });

  setupReveal();
}

// reveal on scroll
function setupReveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('visible');
    });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(n=>obs.observe(n));
}

// modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalBody = document.getElementById('modal-body');
const modalLinks = document.getElementById('modal-links');
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });

function openModal(p){
  modalTitle.textContent = p.title;
  modalMeta.textContent = `役割: ${p.role} ・ 期間: ${p.period} ・ スタック: ${p.stack.join(', ')}`;
  modalBody.innerHTML = `<h5>概要</h5><p>${p.description}</p><h5>成果</h5><p>${p.result}</p>`;
  modalLinks.innerHTML = '';
  if(p.github) modalLinks.appendChild(linkEl('GitHub', p.github));
  if(p.demo) modalLinks.appendChild(linkEl('Demo', p.demo));
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function linkEl(text, href){
  const a = document.createElement('a');
  a.href = href; a.textContent = text; a.target = '_blank'; a.rel='noopener';
  return a;
}

// fill about and skills
function fillAbout(meta){
  document.getElementById('hero-sub').textContent = meta.tagline;
  document.getElementById('about-text').textContent = meta.about;
  const skills = document.getElementById('skills');
  skills.innerHTML = '';
  meta.skills.forEach(s=>{
    const li = document.createElement('li'); li.textContent = s;
    skills.appendChild(li);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
}

// small animated canvas (floating blobs)
function setupCanvas(){
  const c = document.getElementById('hero-canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.clientWidth; c.height = c.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  const blobs = Array.from({length:6}).map((_,i)=>({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    r: 40 + Math.random()*120,
    dx: (Math.random()-0.5)*0.3,
    dy: (Math.random()-0.5)*0.3,
    hue: 180 + Math.random()*60
  }));
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    blobs.forEach(b=>{
      b.x += b.dx; b.y += b.dy;
      if(b.x < -200) b.x = c.width + 200;
      if(b.x > c.width + 200) b.x = -200;
      if(b.y < -200) b.y = c.height + 200;
      if(b.y > c.height + 200) b.y = -200;
      const g = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      g.addColorStop(0, `hsla(${b.hue},80%,60%,0.35)`);
      g.addColorStop(1, `hsla(${b.hue},80%,60%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadProjects();
  setupCanvas();
});