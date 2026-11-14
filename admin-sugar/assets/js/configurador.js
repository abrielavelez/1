/* Sugar Doggy Pops · "Arma su collar". All options and prices come from data/configurador.json. */
(async () => {
  const C = await Sugar.data("configurador");
  await Sugar.ready;
  const { esc, money } = Sugar;
  const $ = s => document.querySelector(s);
  const INK = "#2A1638";
  const BEADS = ["#E63B2E", "#3E9AD6", "#F5D738", "#34A96A", "#7B3AF5", "#E66A92", "#F28A2E"];

  const state = {
    step: 1, estilo: "letras", talla: "M", cordones: ["rojo-turquesa"],
    nombre: "ROCCO", charms: [], placa: "transparente", numero: "",
    llavero: false, palabra: "DOG MOM"
  };
  const estilo = () => C.estilos.find(e => e.id === state.estilo);
  const cordon = id => C.cordones.find(c => c.id === id);
  const charm = id => C.charms.find(c => c.id === id);
  const maxCords = () => state.estilo === "letras" ? 1 : C.maxCordones;
  const nombreUsado = () => {
    const n = state.nombre.trim().toUpperCase();
    return state.estilo === "dije" ? n.slice(0, 1) : n.slice(0, estilo().maxLetras);
  };
  const letras = s => s.replace(/\s/g, "").length;

  /* ---------- price ---------- */
  function lines() {
    const e = estilo(), L = [];
    let base = e.base;
    if (state.talla === "L" && e.tallaL != null) base = e.tallaL;
    L.push({ t: `${e.nombre} · talla ${state.talla}`, v: base });
    if (e.porLetra) L.push({ t: `${letras(nombreUsado())} letras (${nombreUsado() || "—"})`, v: e.porLetra * letras(nombreUsado()) });
    state.charms.forEach(id => { const c = charm(id); L.push({ t: `Charm ${c.nombre} (${c.tipo})`, v: c.precio }); });
    if (state.estilo === "placa" && state.numero.trim()) L.push({ t: "Número atrás de la placa", v: C.numeroAtras.precio });
    if (state.llavero) {
      const v = state.estilo === "placa" ? C.llavero.conPlaca : C.llavero.base + C.llavero.porLetra * letras(state.palabra.trim());
      L.push({ t: `Llavero match “${state.palabra.trim() || "—"}”`, v });
    }
    return L;
  }
  const total = () => lines().reduce((a, l) => a + l.v, 0);

  /* ---------- drawing ---------- */
  const ICON = {
    estrella: `<polygon points="${star(15, 7)}" fill="#F5D738" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    corazon: `<path d="M0,13 C-22,-1 -15,-18 0,-8 C15,-18 22,-1 0,13Z" fill="#E66A92" stroke="${INK}" stroke-width="2.5"/>`,
    cereza: `<path d="M-6,3 Q-3,-12 4,-16 Q4,-5 8,5" fill="none" stroke="#34A96A" stroke-width="3" stroke-linecap="round"/><circle cx="-7" cy="7" r="7" fill="#E63B2E" stroke="${INK}" stroke-width="2.5"/><circle cx="8" cy="8" r="7" fill="#E63B2E" stroke="${INK}" stroke-width="2.5"/>`,
    hueso: `<path d="M-12,-4 a5,5 0 1 1 4,-6 h16 a5,5 0 1 1 4,6 a5,5 0 1 1 -4,6 h-16 a5,5 0 1 1 -4,-6z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>`,
    nube: `<path d="M-14,6 a7,7 0 0 1 2,-13 a9,9 0 0 1 16,-2 a7,7 0 0 1 10,9 a6,6 0 0 1 -4,6z" fill="#CDB6FF" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    helado: `<path d="M-8,-1 L0,17 L8,-1Z" fill="#E9B872" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="0" cy="-6" r="10" fill="#F7A8C9" stroke="${INK}" stroke-width="2.5"/><circle cx="-3" cy="-9" r="1.6" fill="#E63B2E"/><circle cx="3" cy="-4" r="1.6" fill="#3E9AD6"/>`,
    sapo: `<ellipse cx="0" cy="4" rx="14" ry="10" fill="#6CCB7A" stroke="${INK}" stroke-width="2.5"/><circle cx="-7" cy="-6" r="5" fill="#6CCB7A" stroke="${INK}" stroke-width="2.5"/><circle cx="7" cy="-6" r="5" fill="#6CCB7A" stroke="${INK}" stroke-width="2.5"/><circle cx="-7" cy="-6" r="1.8" fill="${INK}"/><circle cx="7" cy="-6" r="1.8" fill="${INK}"/><path d="M-5,6 Q0,10 5,6" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
    florCristal: [0, 1, 2, 3, 4].map(i => { const a = i * 2 * Math.PI / 5 - Math.PI / 2; return `<circle cx="${(10 * Math.cos(a)).toFixed(1)}" cy="${(10 * Math.sin(a)).toFixed(1)}" r="8" fill="${i % 2 ? "#9AA8F5" : "#E63B2E"}" stroke="${INK}" stroke-width="2.5"/>`; }).join("") + `<circle r="6.5" fill="#FF5A6E" stroke="${INK}" stroke-width="2"/><circle cx="-2" cy="-2" r="2" fill="#fff" opacity=".9"/>`,
    brillo: `<path d="M0,-17 Q3,-3 17,0 Q3,3 0,17 Q-3,3 -17,0 Q-3,-3 0,-17Z" fill="#FFE48A" stroke="${INK}" stroke-width="2.5"/><circle cx="-1" cy="-1" r="2" fill="#fff"/>`
  };
  function star(R, r) { let p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; p.push((q * Math.cos(a)).toFixed(1) + "," + (q * Math.sin(a)).toFixed(1)); } return p.join(" "); }
  const icon = (id, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${ICON[id] || ICON.estrella}</g>`;
  const cordColors = () => state.cordones.flatMap(id => cordon(id)?.colores || []);

  function braid(cx, cy, r, cols) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="27"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cols[0]}" stroke-width="21"/>`;
    const N = 40;
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2, t = a * 180 / Math.PI + 90;
      for (const [dr, rot, k] of [[5, 38, i], [-5, -38, i + 1]]) {
        const x = cx + (r + dr) * Math.cos(a), y = cy + (r + dr) * Math.sin(a);
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8.5" ry="5" transform="rotate(${(t + rot).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${cols[k % cols.length]}" stroke="rgba(42,22,56,.4)" stroke-width="1.2"/>`;
      }
    }
    return s;
  }
  function cord(cx, cy, r, cols) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cols[0]}" stroke-width="8"/>`;
    const seg = 9, n = cols.length;
    for (let i = 1; i < n; i++) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cols[i]}" stroke-width="8" stroke-dasharray="${seg} ${seg * (n - 1)}" stroke-dashoffset="${-seg * i}"/>`;
    return s;
  }
  function bone(x, y, w, fill, stroke) {
    const h = w * .42, r = h * .42, a = `fill="${fill}" stroke="${stroke}" stroke-width="3"`;
    return `<g transform="translate(${x} ${y})"><rect x="${-w / 2 + r}" y="${-h / 2 + 4}" width="${w - 2 * r}" height="${h - 8}" ${a}/>` +
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => `<circle cx="${sx * (w / 2 - r)}" cy="${sy * (h / 2 - r * .7)}" r="${r}" ${a}/>`).join("") +
      `<rect x="${-w / 2 + r}" y="${-h / 2 + 5.5}" width="${w - 2 * r}" height="${h - 11}" fill="${fill}"/>` +
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => `<circle cx="${sx * (w / 2 - r)}" cy="${sy * (h / 2 - r * .7)}" r="${r - 1.5}" fill="${fill}"/>`).join("") + `</g>`;
  }
  const PLATE = { metal: ["#D9DEE6", "#8E97A6"], resina: ["#FFD3E2", "#C7577F"], transparente: ["rgba(255,255,255,.55)", "#9AB7C9"] };

  function draw() {
    const cols = cordColors().length ? cordColors() : ["#F5A3C7"];
    const cx = 150, cy = 128, r = 92, name = nombreUsado();
    let s = "";
    if (state.estilo === "letras") {
      s += cord(cx, cy, r, cols);
      s += `<path d="M${cx},${cy - r + 9} C${cx - 18},${cy - r - 6} ${cx - 10},${cy - r - 22} ${cx},${cy - r - 12} C${cx + 10},${cy - r - 22} ${cx + 18},${cy - r - 6} ${cx},${cy - r + 9}Z" fill="#E63B2E" stroke="${INK}" stroke-width="3"/>`;
      const n = name.length, step = 15;
      [...name].forEach((ch, i) => {
        const deg = 90 + (i - (n - 1) / 2) * -step, a = deg * Math.PI / 180;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), rot = deg - 90;
        if (ch === " ") return;
        s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"><rect x="-11" y="-12" width="22" height="24" rx="7" fill="${BEADS[i % BEADS.length]}" stroke="${INK}" stroke-width="2.5"/><text y="1" text-anchor="middle" dominant-baseline="central" font-family="Fredoka,Arial Rounded MT Bold,sans-serif" font-weight="700" font-size="16" fill="#fff" stroke="${INK}" stroke-width="2.5" paint-order="stroke">${esc(ch)}</text></g>`;
      });
    } else {
      s += braid(cx, cy, r, cols);
      s += `<rect x="${cx - 20}" y="${cy - r - 18}" width="40" height="36" rx="9" fill="${cols[0]}" stroke="${INK}" stroke-width="3"/><rect x="${cx - 9}" y="${cy - r - 7}" width="18" height="14" rx="4" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
      s += `<circle cx="${cx}" cy="${cy + r + 14}" r="7" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="${cy + r + 14}" r="7" fill="none" stroke="#CFD5DD" stroke-width="3"/>`;
      if (state.estilo === "placa") {
        const [f, st] = PLATE[state.placa];
        s += bone(cx, cy + r + 44, 120, f, st);
        const fs = Math.min(24, 90 / (Math.max(name.length, 1) * .66));
        s += `<text x="${cx}" y="${cy + r + 45}" text-anchor="middle" dominant-baseline="central" font-family="Fredoka,Arial Rounded MT Bold,sans-serif" font-weight="700" font-size="${fs.toFixed(1)}" fill="${state.placa === "metal" ? "#3A3F4A" : INK}">${esc(name || "NOMBRE")}</text>`;
      } else {
        s += `<g transform="translate(${cx} ${cy + r + 42})"><rect x="-20" y="-20" width="40" height="40" rx="13" fill="#CDB6FF" stroke="${INK}" stroke-width="3"/><text y="2" text-anchor="middle" dominant-baseline="central" font-family="Fredoka,Arial Rounded MT Bold,sans-serif" font-weight="700" font-size="26" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke">${esc(name || "A")}</text></g>`;
      }
    }
    const spots = [38, 142, 18, 162];
    state.charms.forEach((id, i) => {
      const a = spots[i] * Math.PI / 180, x = cx + (r + 6) * Math.cos(a), y = cy + (r + 6) * Math.sin(a);
      s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 14).toFixed(1)}" stroke="${INK}" stroke-width="2.5"/>` + icon(charm(id).icono, x, y + 30, 1.05);
    });
    if (state.llavero) {
      const kx = 318;
      s += `<circle cx="${kx}" cy="56" r="18" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="${kx}" cy="56" r="18" fill="none" stroke="#CFD5DD" stroke-width="4"/>`;
      s += `<rect x="${kx - 6}" y="72" width="12" height="70" rx="6" fill="${cols[0]}" stroke="${INK}" stroke-width="3"/>` + cols.slice(1).map((c, i) => `<rect x="${kx - 6}" y="${84 + i * 14}" width="12" height="7" fill="${c}"/>`).join("");
      const w = (state.palabra.trim() || "—").replace(/\s/g, "");
      [...w.slice(0, 8)].forEach((ch, i) => s += `<g transform="translate(${kx} ${158 + i * 22})"><rect x="-10" y="-10" width="20" height="20" rx="6" fill="${BEADS[(i + 2) % BEADS.length]}" stroke="${INK}" stroke-width="2.2"/><text y="1" text-anchor="middle" dominant-baseline="central" font-family="Fredoka,sans-serif" font-weight="700" font-size="13" fill="#fff" stroke="${INK}" stroke-width="2" paint-order="stroke">${esc(ch)}</text></g>`);
    }
    $("#art").innerHTML = s;
  }

  /* ---------- steps ---------- */
  const STEPS = ["Cuerda", "Nombre", "Charms", "Extras", "Resumen"];
  function renderSteps() {
    $("#steps").innerHTML = STEPS.map((t, i) => `<button type="button" role="tab" aria-selected="${state.step === i + 1}" data-step="${i + 1}"><b>${i + 1}</b>${t}</button>`).join("");
  }
  const swatch = cols => `background:linear-gradient(135deg,${cols.length > 1 ? cols.map((c, i) => `${c} ${i * 100 / cols.length}% ${(i + 1) * 100 / cols.length}%`).join(",") : `${cols[0]},${cols[0]}`})`;

  function panel() {
    const e = estilo(), p = $("#panel");
    if (state.step === 1) {
      p.innerHTML = `<h2>1 · Elige su collar y la cuerda</h2>
      <div class="opts3">${C.estilos.map(x => `<button type="button" class="opt" aria-pressed="${x.id === state.estilo}" data-estilo="${x.id}"><b>${esc(x.nombre)}</b><small>${esc(x.detalle)}</small><span class="from">desde ${money(x.base)}${x.porLetra ? " + " + money(x.porLetra) + "/letra" : ""}</span></button>`).join("")}</div>
      <h3>Talla</h3>
      <div class="opts3">${C.tallas.map(t => `<button type="button" class="opt" aria-pressed="${t.id === state.talla}" data-talla="${t.id}"><b>${t.id}</b><small>${t.cm}</small><small>${esc(t.ejemplos)}</small></button>`).join("")}</div>
      <p class="note">¿No sabes su talla? Mide su cuello con un hilo y suma 2 dedos. Todos los collares son ajustables.${e.tallaL != null ? ` Talla L de este collar: ${money(e.tallaL)} (se trenza con 4 hilos).` : ""}</p>
      <h3>Cuerda ${maxCords() > 1 ? `<small>(hasta ${maxCords()})</small>` : ""}</h3>
      ${["Mezclado", "Liso"].map(tipo => `<p class="sub">${tipo === "Liso" ? "Colores lisos" : "Mezclados"}</p><div class="swatches">${C.cordones.filter(c => c.tipo === tipo).map(c => `<button type="button" class="sw" aria-pressed="${state.cordones.includes(c.id)}" data-cord="${c.id}"><span style="${swatch(c.colores)}"></span>${esc(c.nombre)}</button>`).join("")}</div>`).join("")}`;
    } else if (state.step === 2) {
      const lim = e.maxLetras;
      p.innerHTML = `<h2>2 · Su nombre</h2>
      <label class="field" for="nameIn">${state.estilo === "dije" ? "Su inicial" : "Nombre de tu peludito"}<input id="nameIn" maxlength="${lim}" autocomplete="off" value="${esc(state.estilo === "dije" ? state.nombre.slice(0, 1) : state.nombre)}"></label>
      <p class="note">${state.estilo === "letras" ? `Cada letra suma ${money(e.porLetra)}. Hasta ${lim} letras.` : state.estilo === "placa" ? `Va grabado en la placa. Hasta ${lim} letras.` : "El dije lleva una letra."}</p>`;
      $("#nameIn").oninput = ev => { const v = ev.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ0-9 ]/g, ""); ev.target.value = v; state.nombre = v || ""; update(false); };
    } else if (state.step === 3) {
      p.innerHTML = `<h2>3 · Charms</h2><p class="note">Hasta ${C.maxCharms}. Toca de nuevo para quitarlo.</p>
      ${["Charm Up", "Sugar Premium"].map(tipo => { const list = C.charms.filter(c => c.tipo === tipo); return list.length ? `<p class="sub">${tipo} · ${money(list[0].precio)} c/u</p><div class="charms">${list.map(c => `<button type="button" class="ch" aria-pressed="${state.charms.includes(c.id)}" data-charm="${c.id}"><svg viewBox="-24 -24 48 48" aria-hidden="true">${icon(c.icono, 0, 0)}</svg>${esc(c.nombre)}</button>`).join("")}</div>` : ""; }).join("")}`;
    } else if (state.step === 4) {
      const llv = state.estilo === "placa" ? `${money(C.llavero.conPlaca)}` : `${money(C.llavero.base)} + ${money(C.llavero.porLetra)}/letra`;
      p.innerHTML = `<h2>4 · Extras</h2>
      ${state.estilo === "placa" ? `<h3>Placa</h3><div class="opts3">${C.placas.map(x => `<button type="button" class="opt" aria-pressed="${x.id === state.placa}" data-placa="${x.id}"><b>${esc(x.nombre)}</b></button>`).join("")}</div>
      <label class="field" for="numIn">Número atrás de la placa (opcional)<input id="numIn" inputmode="tel" maxlength="14" placeholder="099 123 4567" value="${esc(state.numero)}"></label>` : ""}
      <h3>Llavero match para ti</h3>
      <button type="button" class="toggle" aria-pressed="${state.llavero}" id="llvBtn">${state.llavero ? "✓ Llavero agregado" : "Agregar llavero match"} · ${llv}</button>
      ${state.llavero ? `<label class="field" for="palIn">Palabra del llavero<input id="palIn" maxlength="10" value="${esc(state.palabra)}"></label><div class="chipsx">${["DOG MOM", "CAT MOM", "DOG DAD", nombreUsado()].filter(Boolean).map(w => `<button type="button" class="chip" data-pal="${esc(w)}">${esc(w)}</button>`).join("")}</div>` : ""}
      <p class="note">El cierre lo elegimos nosotras para que combine con tus colores.</p>`;
      const ni = $("#numIn"); if (ni) ni.oninput = ev => { state.numero = ev.target.value; update(false); };
      const pi = $("#palIn"); if (pi) pi.oninput = ev => { ev.target.value = ev.target.value.toUpperCase(); state.palabra = ev.target.value; update(false); };
    } else {
      const L = lines();
      p.innerHTML = `<h2>5 · Tu pedido</h2>
      <ul class="sum">${L.map(l => `<li><span>${esc(l.t)}</span><b>${l.v ? money(l.v) : "Incluido"}</b></li>`).join("")}
      <li class="tot"><span>Total</span><b>${money(total())}</b></li></ul>
      <p class="note">Cuerda: ${state.cordones.map(id => cordon(id).nombre).join(" + ")}${state.estilo === "placa" ? ` · Placa: ${C.placas.find(x => x.id === state.placa).nombre}` : ""}</p>
      <a class="wa-btn big" data-wa="${esc(orderText())}" href="#whatsapp">Enviar pedido por WhatsApp</a>
      <p class="note">Se abre WhatsApp con tu pedido escrito. Te confirmamos disponibilidad y envío.</p>`;
      Sugar.wireWa(p);
    }
  }
  function orderText() {
    const e = estilo();
    return [
      "Hola Sugar Doggy Pops 🐶 quiero este collar:",
      `• Tipo: ${e.nombre}`,
      `• Talla: ${state.talla}`,
      `• Cuerda: ${state.cordones.map(id => cordon(id).nombre).join(" + ")}`,
      `• ${state.estilo === "dije" ? "Inicial" : "Nombre"}: ${nombreUsado() || "—"}`,
      state.estilo === "placa" ? `• Placa: ${C.placas.find(x => x.id === state.placa).nombre}` : null,
      state.estilo === "placa" && state.numero.trim() ? `• Número atrás: ${state.numero.trim()}` : null,
      `• Charms: ${state.charms.length ? state.charms.map(id => charm(id).nombre).join(", ") : "sin charms"}`,
      state.llavero ? `• Llavero match: ${state.palabra.trim()}` : null,
      `Total: ${money(total())}`
    ].filter(Boolean).join("\n");
  }
  function update(rePanel = true) {
    draw(); renderSteps();
    $("#total").textContent = money(total());
    $("#nextBtn").textContent = state.step < 5 ? "Siguiente →" : "Editar desde el inicio";
    if (rePanel) panel();
  }

  /* ---------- events ---------- */
  $("#steps").addEventListener("click", e => { const b = e.target.closest("[data-step]"); if (!b) return; state.step = +b.dataset.step; update(); });
  $("#nextBtn").addEventListener("click", () => { state.step = state.step < 5 ? state.step + 1 : 1; update(); $("#builder").scrollIntoView({ behavior: "smooth", block: "start" }); });
  $("#panel").addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.estilo) {
      state.estilo = t.dataset.estilo;
      state.cordones = state.cordones.slice(-maxCords());
      if (state.estilo === "dije") state.nombre = state.nombre.slice(0, 1) || "A";
      else if (state.nombre.length < 2) state.nombre = "ROCCO";
    }
    if (t.dataset.talla) state.talla = t.dataset.talla;
    if (t.dataset.cord) {
      const id = t.dataset.cord;
      if (state.cordones.includes(id)) { if (state.cordones.length > 1) state.cordones = state.cordones.filter(c => c !== id); }
      else state.cordones = [...state.cordones, id].slice(-maxCords());
    }
    if (t.dataset.charm) {
      const id = t.dataset.charm;
      if (state.charms.includes(id)) state.charms = state.charms.filter(c => c !== id);
      else if (state.charms.length < C.maxCharms) state.charms = [...state.charms, id];
      else Sugar.toast(`Máximo ${C.maxCharms} charms`);
    }
    if (t.dataset.placa) state.placa = t.dataset.placa;
    if (t.id === "llvBtn") state.llavero = !state.llavero;
    if (t.dataset.pal) state.palabra = t.dataset.pal;
    if (t.dataset.estilo || t.dataset.talla || t.dataset.cord || t.dataset.charm || t.dataset.placa || t.id === "llvBtn" || t.dataset.pal) update();
  });
  update();
})().catch(() => {
  document.getElementById("panel").innerHTML = '<p class="note">No se pudo cargar el configurador. Recarga la página.</p>';
});
