function rand(a,b){ return Math.random()*(b-a)+a; }

function bubbles(container, n=12, dur=[1,2]){
  const wrap=document.createElement("div");
  wrap.className="mix-bubble-container";
  container.appendChild(wrap);
  for(let i=0;i<n;i++){
    const d=document.createElement("div");
    d.className="mix-bubble";
    const s=rand(6,16);
    d.style.width=`${s}px`; d.style.height=`${s}px`;
    d.style.left=`${rand(8,92)}%`;
    d.style.animationDuration=`${rand(dur[0],dur[1])}s`;
    d.style.opacity=String(rand(0.6,0.95));
    wrap.appendChild(d);
    d.addEventListener("animationend", ()=>d.remove());
  }
  setTimeout(()=>wrap.remove(), Math.ceil(dur[1]*1000)+800);
}

function pulse(el, cls="mix-pulse", t=500){
  if(!el) return; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), t);
}

function sparkOn(el){ if(el) el.style.opacity="1"; }
function sparkOff(el){ if(el) el.style.opacity="0"; }

function pour(liquidEl){
  if(!liquidEl) return;
  liquidEl.style.filter="brightness(1.1) saturate(1.1)";
  setTimeout(()=>{ liquidEl.style.filter=""; }, 300);
}

function cloud(el, density=1){
  if(!el) return;
  const fog=document.createElement("div");
  fog.style.position="absolute";
  fog.style.inset="0";
  fog.style.pointerEvents="none";
  fog.style.background=`radial-gradient(180px 120px at 50% 70%, rgba(255,255,255,${0.08*density}), transparent 60%),
                        radial-gradient(220px 160px at 40% 80%, rgba(255,255,255,${0.06*density}), transparent 60%)`;
  fog.style.opacity="0";
  fog.style.transition="opacity .5s ease";
  el.appendChild(fog);
  requestAnimationFrame(()=>{ fog.style.opacity="1"; });
  setTimeout(()=>{ fog.style.opacity="0"; setTimeout(()=>fog.remove(),300); }, 1200);
}

function fadeColor(liquidEl, to, ms=1200){
  if(!liquidEl) return;
  liquidEl.style.transition="background .6s ease";
  liquidEl.style.background = `linear-gradient(180deg, ${to}, rgba(255,255,255,0.08))`;
}

function swirl(el){
  if(!el) return;
  el.style.transition="transform .6s ease";
  el.style.transform="rotate(2deg) scale(1.01)";
  setTimeout(()=>{ el.style.transform=""; }, 600);
}

function smoke(el, count=6){
  if(!el) return;
  for(let i=0; i<count; i++){
    const s = document.createElement("div");
    s.style.position="absolute";
    s.style.bottom="50%";
    s.style.left=`${50 + Math.random()*20-10}%`;
    s.style.width=`${6 + Math.random()*4}px`;
    s.style.height=`${6 + Math.random()*4}px`;
    s.style.borderRadius="50%";
    s.style.background="rgba(255,255,255,0.85)";
    s.style.filter="blur(2px)";
    s.style.transform="translate(-50%,0)";
    s.style.opacity="0.9";
    el.appendChild(s);

    const a = s.animate([
      { transform:`translate(-50%,0) scale(1)`, opacity:0.9 },
      { transform:`translate(${rand(-60,60)}px,-80px) scale(${1 + Math.random()})`, opacity:0 }
    ], { duration:1200 + Math.random()*400, easing:"ease-out" });

    a.onfinish = ()=>s.remove();
  }
}
function sparks(el, count=8){
  if(!el) return;
  for(let i=0;i<count;i++){
    const sp = document.createElement("div");
    sp.style.position="absolute";
    sp.style.width="4px";
    sp.style.height="4px";
    sp.style.background="yellow";
    sp.style.borderRadius="50%";
    sp.style.left=`${rand(30,70)}%`;
    sp.style.bottom="50%";
    el.appendChild(sp);

    const a = sp.animate([
      { transform:`translate(0,0)`, opacity:1 },
      { transform:`translate(${rand(-50,50)}px,${-rand(80,120)}px)`, opacity:0 }
    ], { duration:500 + rand(0,300), easing:"ease-out" });

    a.onfinish = ()=> sp.remove();
  }
}
function foam(el, n=20){
  if(!el) return;
  for(let i=0;i<n;i++){
    const f = document.createElement("div");
    f.className="mix-foam";
    f.style.width=`${rand(4,10)}px`;
    f.style.height=`${rand(4,10)}px`;
    f.style.borderRadius="50%";
    f.style.background="rgba(255,255,255,0.9)";
    f.style.position="absolute";
    f.style.bottom="0";
    f.style.left=`${rand(10,90)}%`;
    el.appendChild(f);

    const a = f.animate([
      { transform:"translateY(0)", opacity:1 },
      { transform:`translateY(-${rand(60,120)}px)`, opacity:0 }
    ], { duration:800 + rand(0,400), easing:"ease-out" });

    a.onfinish = ()=> f.remove();
  }
}
function flash(el, color="rgba(255,255,0,0.6)", duration=400){
  if(!el) return;
  const f = document.createElement("div");
  f.style.position="absolute";
  f.style.inset="0";
  f.style.background=color;
  f.style.opacity="0";
  f.style.pointerEvents="none";
  el.appendChild(f);

  f.animate([
    { opacity:0 },
    { opacity:1 },
    { opacity:0 }
  ], { duration: duration, easing:"ease-out" }).onfinish = ()=> f.remove();
}


function triggerReactionFX(beaker, sparkEl, name){
  if(name==="pulse-bubbles"){ pulse(beaker, "mix-pulse", 900); bubbles(beaker, 16, [0.8,1.6]); sparkOn(sparkEl); setTimeout(()=>sparkOff(sparkEl), 500); }
  else if(name==="pulse-strong"){ pulse(beaker, "mix-pulse", 1200); bubbles(beaker, 22, [0.6,1.2]); cloud(beaker, 1); }
  else if(name==="fizz-fast"){ bubbles(beaker, 26, [0.5,1.0]); pulse(beaker, "mix-pulse", 500); }
  else if(name==="fizz-soft"){ bubbles(beaker, 18, [0.8,1.6]); }
  else if(name==="cloudy-fall"){ cloud(beaker, 1.2); }
  else if(name==="cloudy-dense"){ cloud(beaker, 1.6); }
  else if(name==="swirl-color"){ swirl(beaker); bubbles(beaker, 10, [0.8,1.5]); }
  else if(name==="swirl-deep"){ swirl(beaker); bubbles(beaker, 14, [0.8,1.5]); }
  else if(name==="fade-out"){ fadeColor(document.getElementById("liquid"), "rgba(255,255,255,0.12)"); }
  else if(name==="fade-green"){ fadeColor(document.getElementById("liquid"), "rgba(140,220,160,0.45)"); }
  else if(name==="smoke-line"){ smoke(beaker); }
  else if(name==="milk-cloud"){ cloud(beaker, 1.8); }
  else if(name==="spark-burst"){ sparks(beaker, 12); flash(beaker,"rgba(255,200,0,0.5)"); }
else if(name==="fizz-foam"){ bubbles(beaker, 20, [0.7,1.4]); foam(beaker, 15); }
else if(name==="smoke-heavy"){ smoke(beaker); smoke(beaker); cloud(beaker, 1.5); }
else if(name==="swirl-bubbles"){ swirl(beaker); bubbles(beaker, 18, [0.8,1.5]); }
else if(name==="flash"){ flash(beaker,"rgba(255,100,50,0.5)"); }

}

window.triggerReactionFX = triggerReactionFX;
window.pulse = pulse;
window.pour = pour;
