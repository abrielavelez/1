/* Sugar · shared helpers: data loading, WhatsApp links, catalog rendering. */
const Sugar = (() => {
  const ROOT = document.body.dataset.root || "";
  const cache = {};
  async function data(name) {
    if (!cache[name]) cache[name] = fetch(ROOT + "data/" + name + ".json").then(r => {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
    return cache[name];
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
  const priceText = p => p.precioTexto || (p.precio != null ? money(p.precio) : "Consultar precio");

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3800);
  }

  /* WhatsApp: same number for both brands, from data/config.json */
  let waNumber = "";
  function waHref(text) {
    return waNumber ? "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text) : "#whatsapp";
  }
  function wireWa(root = document) {
    root.querySelectorAll("[data-wa]").forEach(a => {
      a.href = waHref(a.dataset.wa);
      a.target = "_blank"; a.rel = "noopener";
    });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href="#whatsapp"]');
    if (a) { e.preventDefault(); toast("Falta poner el número de WhatsApp en data/config.json"); }
  });

  async function init() {
    try {
      const cfg = await data("config");
      waNumber = String(cfg.whatsapp || "").replace(/\D/g, "");
      document.querySelectorAll("[data-ig]").forEach(a => {
        const user = cfg.instagram?.[a.dataset.ig];
        if (user) { a.href = "https://instagram.com/" + user; a.target = "_blank"; a.rel = "noopener"; }
      });
    } catch (e) { /* page still works without config */ }
    wireWa();
  }

  /* ---------- product cards ---------- */
  const EMO = { Collares: "🦴", Charms: "🍦", "Sparkle Kit": "✨", Bandanas: "🎀", Disfraces: "🎃", Llaveros: "🔑", Aretes: "🍒", Lazos: "🎀", match: "💞" };
  const TINTS = [["#FBE7A1", "#BFE3F7"], ["#C8F0D9", "#E6D9FF"], ["#FFD3E2", "#FBE7A1"], ["#BFE3F7", "#C8F0D9"], ["#E6D9FF", "#FFD3E2"]];
  function photo(p, i, key) {
    if (p.foto) return `<div class="ph"><img src="${esc(ROOT + "fotos/" + p.foto)}" alt="${esc(p.nombre)}" loading="lazy">${p.ejemplo ? '<span class="tagx">Ejemplo</span>' : ""}</div>`;
    const [c1, c2] = TINTS[i % TINTS.length];
    return `<div class="ph empty" style="--c1:${c1};--c2:${c2}"><span class="emo" aria-hidden="true">${EMO[key] || "💖"}</span><span class="soon">Foto pronto</span>${p.ejemplo ? '<span class="tagx">Ejemplo</span>' : ""}</div>`;
  }
  function card(p, i, opts = {}) {
    const msg = p.precio != null || p.precioTexto
      ? `Hola, quiero ${p.nombre} – ${priceText(p)}`
      : `Hola, quiero ${p.nombre} – ¿me pasas el precio?`;
    const incl = p.incluye ? `<div class="incl">${p.incluye.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : "";
    const cfg = p.configurable && opts.configurador ? `<a class="ghost-btn" href="${esc(opts.configurador)}">Arma el tuyo</a>` : "";
    return `<article class="card">${photo(p, i, opts.emo || p.categoria)}
      <div class="body"><h3>${esc(p.nombre)}</h3>${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}${incl}<div class="price">${esc(priceText(p))}</div></div>
      <div class="acts">${cfg}<a class="wa-btn" data-wa="${esc(msg)}" href="#whatsapp">Pedir por WhatsApp</a></div></article>`;
  }

  async function catalog({ marca, grid, chips, configurador }) {
    await ready;
    const d = await data("productos");
    const items = d.productos.filter(p => p.marca === marca && p.disponible !== false);
    const cats = (d.categorias[marca] || []).filter(c => items.some(p => p.categoria === c));
    let active = new URLSearchParams(location.search).get("cat");
    if (!cats.includes(active)) active = "Todo";
    function render() {
      chips.innerHTML = ["Todo", ...cats].map(c => `<button type="button" class="chip" aria-pressed="${c === active}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
      const list = active === "Todo" ? items : items.filter(p => p.categoria === active);
      grid.innerHTML = list.length ? list.map((p, i) => card(p, i, { configurador })).join("") : "";
      document.querySelector(".empty-msg")?.toggleAttribute("hidden", !!list.length);
      wireWa(grid);
    }
    chips.addEventListener("click", e => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      active = b.dataset.cat; render();
    });
    render();
  }

  async function match({ grid }) {
    await ready;
    const d = await data("productos");
    const list = (d.match || []).filter(p => p.disponible !== false);
    grid.innerHTML = list.map((p, i) => card(p, i, { emo: "match" })).join("");
    wireWa(grid);
  }

  const ready = init();
  return { data, ready, catalog, match, waHref, wireWa, toast, esc, money };
})();
