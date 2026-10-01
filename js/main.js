(function () {
  const $ = id => document.getElementById(id);
  const C = SITE_CONFIG, anim = C.animationEnabled && !REDUCED;
  const root = document.documentElement.style;
  root.setProperty("--violet", C.colors.violet); root.setProperty("--cyan", C.colors.cyan); root.setProperty("--rose", C.colors.rose); root.setProperty("--text", C.colors.text); root.setProperty("--bg", C.colors.bg);

  /* Build page from config */
  document.title = C.name + " · Digital Universe";
  $("name").textContent = C.name.toUpperCase(); $("avatarText").textContent = C.avatar;
  $("statusText").textContent = C.status; $("footText").textContent = C.footer; $("subtitle").textContent = C.subtitle;
  const links = $("links");
  ACTIVE_BUTTONS.forEach(key => {            // only active AND having a URL are rendered
    const url = SOCIAL_LINKS[key], p = PLATFORMS[key]; if (!url || !p) return;
    const a = document.createElement("a"); a.className = "btn"; a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.style.setProperty("--c", p.c);
    a.setAttribute("aria-label", p.label + ": " + p.desc);
    a.innerHTML = `<span class="ico" aria-hidden="true">${p.g}</span><span class="txt"><b>${p.label}</b><small>${p.desc}</small></span><span class="arr" aria-hidden="true">➜</span>`;
    ButtonEngine.decorate(a, INTENSITY[C.animationIntensity] < .8); links.appendChild(a);
  });

  /* Wallpaper (on by default) */
  const wall = new WallpaperEngine($("wall"));
  if (C.wallpaperEnabled) { wall.randomize({ low: .5, medium: .8, high: 1.1 }[C.wallpaperIntensity] || 1); wall.start(); } else { $("wall").style.display = "none"; document.querySelector(".aurora").style.opacity = ".4"; }

  /* Rotating home messages (no quick repeats) */
  let queue = [];
  const nextMsg = () => { if (!queue.length) queue = Rand.shuffle(HOME_MESSAGES); return queue.pop(); };
  let msgTimer;
  const rotate = async () => { await TextEngine.play($("homeMsg"), nextMsg(), anim ? Rand.weighted([["fade", 3], ["blur", 3], ["slideUp", 3], ["words", 2], ["typewriter", 2], ["glow", 2], ["scramble", 1], ["wave", 1], ["spacing", 1]]) : "fade");
    msgTimer = setTimeout(rotate, C.messageIntervalSeconds * 1000); };

  /* Share */
  $("shareBtn").addEventListener("click", async () => {
    const data = { title: document.title, text: "Visit " + C.name + "'s digital universe", url: location.href };
    try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(location.href); UIEngine.toast("Link copied"); }
    catch (e) { const t = document.createElement("textarea"); t.value = location.href; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); UIEngine.toast("Link copied"); } catch (_) { UIEngine.toast("Copy the address bar link"); } t.remove(); }
  });

  /* Sound (never autoplays) */
  const sb = $("soundBtn"), setS = on => { sb.textContent = on ? "Sound on" : "Sound off"; sb.setAttribute("aria-pressed", on); };
  if (!C.soundEnabled) sb.title = "Starts only after you tap";
  sb.addEventListener("click", () => setS(SoundEngine.toggle()));

  /* Intro, then the main page */
  let started = false;
  const startMain = async () => {
    if (started) return; started = true;
    const intro = $("intro"), app = $("app");
    const reveal = () => { intro.style.display = "none"; app.classList.remove("hidden");
      const parts = [...document.querySelectorAll(".top,.avatar,h1,.subtitle,.msg,.btn,.foot")];
      if (anim) UIEngine.stagger(parts);
      UIEngine.pointer(document.querySelector(".profile"), $("spot"), $("avatar"));
      UIEngine.scrollReveal([...document.querySelectorAll(".btn")].slice(5)); rotate(); };
    anim ? await TransitionEngine.play(null, reveal) : reveal();
  };
  $("skip").addEventListener("click", startMain);

  (async function intro() {
    const w = Rand.fresh("welcome", WELCOME_MESSAGES);
    const fast = !anim;
    await TextEngine.play($("introWelcome"), w, fast ? "fade" : Rand.weighted([["blur", 3], ["chars", 3], ["typewriter", 2], ["glow", 2], ["scramble", 1], ["spacing", 2], ["scale", 1]]));
    await new Promise(r => setTimeout(r, fast ? 500 : 900));
    await TextEngine.play($("introBy"), "Created by " + C.name, fast ? "fade" : Rand.pick(["fade", "glow", "typewriter", "chars", "blur", "scale", "spacing", "glitch", "shimmer", "scramble", "wave"]));
    await new Promise(r => setTimeout(r, fast ? 600 : 1100));
    startMain();
  })();
})();
