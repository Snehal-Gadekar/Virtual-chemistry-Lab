const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

async function jget(url, opt={}){ const r=await fetch(url,opt); if(!r.ok) throw new Error(r.status); return r.json(); }

function qs(name){ const u=new URLSearchParams(location.search); return u.get(name); }

function setText(id,val){ const el=document.getElementById(id); if(el) el.textContent=val; }

function tags(parent, list){
  parent.innerHTML="";
  list.forEach(c=>{
    const t=document.createElement("div");
    t.className="tag"; t.draggable=true; t.dataset.id=c.id; t.textContent=c.id;
    t.addEventListener("dragstart",e=>{ e.dataTransfer.setData("text/plain", c.id); });
    parent.appendChild(t);
  });
}

function fillSelect(sel, list){
  sel.innerHTML = `<option value="">Select</option>` + list.map(c=>`<option value="${c.id}">${c.id}</option>`).join("");
}

async function initIndex(){}

async function initHistory(){
  const body = document.getElementById("histBody");
  const empty = document.getElementById("empty");

  // Fetch history from backend
  const hist = await (await fetch("/api/history")).json();

  // Load deleted IDs from localStorage
  const deletedIds = JSON.parse(localStorage.getItem("deletedHistory") || "[]");

  // Filter out deleted records
  const filteredHist = hist.filter(x => !deletedIds.includes(x.id));

  if(!filteredHist.length){
    empty.style.display = "block";
    body.innerHTML = "";
    return;
  }

  let n = 1;
  body.innerHTML = filteredHist.map(x=>(
    `<tr>
      <td>${n++}</td>
      <td>${x.user}</td>
      <td>${x.chemicals.join(" + ")}</td>
      <td>${x.result}</td>
      <td>${new Date(x.time).toLocaleString()}</td>
    </tr>`
  )).join("");

  // Delete History button (frontend only, persists in localStorage)
  const deleteBtn = document.getElementById("deleteHistoryBtn");
  deleteBtn.addEventListener("click", ()=>{
    const idsToDelete = filteredHist.map(x => x.id);
    const updatedDeleted = [...deletedIds, ...idsToDelete];
    localStorage.setItem("deletedHistory", JSON.stringify(updatedDeleted));
    body.innerHTML = "";
    empty.style.display = "block";
  });
}


async function initResult(){
  const id=qs("id");
  if(!id) return;
  const r=await jget(`/api/result/${id}`);
  setText("who", r.user || "—");
  setText("combo", (r.chemicals||[]).join(" + ") || "—");
  setText("resultText", r.result || "—");
  setText("safetyText", r.safety || "—");
  setText("theoryText", r.description || "—");
  setText("time", r.time ? new Date(r.time).toLocaleString() : "—");
  const liq=$("#liquid"), beaker=$("#beaker"), spark=$("#spark");
  if(liq && r.color) liq.style.background = `linear-gradient(180deg, ${r.color}, rgba(255,255,255,0.08))`;
  if(beaker && r.animation) triggerReactionFX(beaker, spark, r.animation);
}

async function initExperiment(){
  const userInput=$("#userName");
  const chemA=$("#chemA"), chemB=$("#chemB");
  const addA=$("#addA"), addB=$("#addB");
  const added=$("#added");
  const drop=$("#beakerDrop");
  const liq=$("#liquid"), beaker=$("#beaker"), spark=$("#spark");
  const tagsWrap=$("#chemTags");

  const chems = await jget("/api/chemicals");
  fillSelect(chemA, chems);
  fillSelect(chemB, chems);
  tags(tagsWrap, chems);

  const chosen=[];
  function renderChosen(){
  added.innerHTML = chosen.map(x => `<div class="tag">${x}</div>`).join("");

  const level = Math.min(100, chosen.length * 25);
  if (liq) {
    liq.style.height = `${level}%`;

    // Always pick last added chemical for color
    const lastChem = chems.find(c => c.id === chosen[chosen.length - 1]);
    if (lastChem && lastChem.color) {
      liq.style.background = lastChem.color;
    } else {
      liq.style.background = "rgba(150,150,255,0.5)"; // fallback color
    }
  }
}

  function addFrom(select){
    const v=select.value;
    if(!v) return;
    if(chosen.length>=2) return;
    if(!chosen.includes(v)){ chosen.push(v); renderChosen(); pulse(beaker); pour(liq); }
  }

  addA.addEventListener("click", ()=>addFrom(chemA));
  addB.addEventListener("click", ()=>addFrom(chemB));

  drop.addEventListener("dragover", e=>{ e.preventDefault(); drop.classList.add("active"); });
  drop.addEventListener("dragleave", ()=>drop.classList.remove("active"));
  drop.addEventListener("drop", e=>{
    e.preventDefault(); drop.classList.remove("active");
    const id = e.dataTransfer.getData("text/plain");
    if(id && chosen.length<2 && !chosen.includes(id)){ chosen.push(id); renderChosen(); pulse(beaker); pour(liq); }
  });

  $("#mixBtn").addEventListener("click", async () => {
    const user = userInput.value.trim() || "Guest";
    if (chosen.length < 2) { alert("Select two chemicals"); return; }

    const a = chosen[0], b = chosen[1];

    pour(liq);

    setTimeout(async () => {
        const res = await jget("/api/mix", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({ user, chemA: a, chemB: b })
        });

        const reaction = await jget(`/api/result/${res.id}`);

        if (liq && reaction.color) {
            liq.style.background = `linear-gradient(180deg, ${reaction.color}, rgba(255,255,255,0.08))`;
        }

        // Play the correct animation
        triggerReactionFX(beaker, spark, reaction.animation);

        // Wait enough time for animation to complete
        let waitTime = 1300;
        if(["pulse-strong"].includes(reaction.animation)) waitTime = 1500;
        else if(["cloudy-dense","milk-cloud"].includes(reaction.animation)) waitTime = 1700;
        else if(["fade-out","fade-green"].includes(reaction.animation)) waitTime = 1200;

        setTimeout(() => {
            // clear chosen chemicals and liquid
            chosen.length = 0;
            added.innerHTML = "";
            liq.style.height = "0%";
            window.location.href = `result.html?id=${res.id}`;
        }, waitTime);
    }, 150);
});
}


document.addEventListener("DOMContentLoaded", ()=>{
  const p=document.body.dataset.page;
  if(p==="index") initIndex();
  if(p==="history") initHistory();
  if(p==="result") initResult();
  if(p==="experiment") initExperiment();
});

document.getElementById("deleteHistoryBtn").addEventListener("click", function() {
    const historyTable = document.getElementById("historyTable"); 
    const rows = historyTable.rows.length;
    for (let i = rows - 1; i > 0; i--) {
        historyTable.deleteRow(i);
    }
});
