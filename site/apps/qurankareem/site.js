(() => {
  const supported = [
    ['en','English'],['ar','العربية'],['ur','اردو'],['tr','Türkçe'],['fr','Français'],['es','Español'],
    ['hi','हिन्दी'],['id','Bahasa Indonesia'],['fa','فارسی'],['fil','Filipino'],['it','Italiano'],['de','Deutsch'],['nl','Nederlands'],
  ];
  const rtl = new Set(['ar','ur','fa']);
  const pathname = location.pathname;
  const page = pathname.includes('/privacy/') ? 'privacy' : pathname.includes('/delete-account/') ? 'deletion' : pathname.includes('/about/') ? 'about' : 'home';
  const root = page === 'home' ? './' : '../';
  const hrefs = { home: root, privacy: root + 'privacy/', deletion: root + 'delete-account/', about: root + 'about/' };
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  let storedLanguage = '';
  try { storedLanguage = localStorage.getItem('qk-site-language') || ''; } catch {}
  const browserLanguage = (navigator.language || 'en').toLowerCase().split('-')[0];
  let language = supported.some(([code]) => code === queryLanguage) ? queryLanguage
    : supported.some(([code]) => code === storedLanguage) ? storedLanguage
    : supported.some(([code]) => code === browserLanguage) ? browserLanguage : 'en';

  const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const link = (key, label, current = false) => `<a href="${hrefs[key]}?lang=${encodeURIComponent(language)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  const paragraph = (text) => `<p>${esc(text)}</p>`;
  const section = (title, body) => `<section class="panel"><h2>${esc(title)}</h2>${body}</section>`;
  const sourceLink = (href, label) => `<a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

  function render(t) {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl.has(language) ? 'rtl' : 'ltr';
    document.title = `${t.app} — ${({home:t.homeTitle,privacy:t.privacyTitle,deletion:t.deletionTitle,about:t.aboutTitle})[page]}`;
    const select = `<label class="language"><span>${esc(t.language)}</span><select id="language" aria-label="${esc(t.language)}">${supported.map(([code,name]) => `<option value="${code}"${code === language ? ' selected' : ''}>${esc(name)}</option>`).join('')}</select></label>`;
    const nav = `<nav class="nav" aria-label="${esc(t.app)}">${link('home',t.home,page==='home')}${link('privacy',t.privacy,page==='privacy')}${link('deletion',t.deletion,page==='deletion')}${link('about',t.about,page==='about')}</nav>`;
    let content = '';
    if (page === 'home') {
      content = `<header class="hero"><h1>${esc(t.homeTitle)}</h1>${paragraph(t.homeIntro)}<p class="notice">${esc(t.translationNote)}</p></header><div class="cards"><a class="card" href="${hrefs.privacy}?lang=${language}"><h2>${esc(t.homePrivacyTitle)}</h2><p>${esc(t.homePrivacyText)}</p></a><a class="card" href="${hrefs.deletion}?lang=${language}"><h2>${esc(t.homeDeleteTitle)}</h2><p>${esc(t.homeDeleteText)}</p></a><a class="card" href="${hrefs.about}?lang=${language}"><h2>${esc(t.homeAboutTitle)}</h2><p>${esc(t.homeAboutText)}</p></a></div>`;
    } else if (page === 'privacy') {
      content = `<header class="hero"><h1>${esc(t.privacyTitle)}</h1><p class="meta">${esc(t.effectiveDate)}</p>${paragraph(t.privacyIntro)}<p class="notice">${esc(t.translationNote)}</p></header><article class="panel"><h2>${esc(t.infoTitle)}</h2><ul>${['accountData','syncedData','aiData','subscriptionData','contentData','deviceData'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ul><h2>${esc(t.useTitle)}</h2>${paragraph(t.useText)}<h2>${esc(t.providersTitle)}</h2>${paragraph(t.providersText)}<h2>${esc(t.securityTitle)}</h2>${paragraph(t.securityText)}<h2>${esc(t.choicesTitle)}</h2>${paragraph(t.choicesText)}<p><a class="text-link" href="${hrefs.deletion}?lang=${language}">${esc(t.deletionLink)}</a></p><h2>${esc(t.childrenTitle)}</h2>${paragraph(t.childrenText)}</article>`;
    } else if (page === 'deletion') {
      content = `<header class="hero"><h1>${esc(t.deletionTitle)}</h1>${paragraph(t.deletionIntro)}<p class="notice">${esc(t.translationNote)}</p></header><article class="panel"><ol>${['step1','step2','step3','step4'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ol>${paragraph(t.verifyText)}<h2>${esc(t.localTitle)}</h2>${paragraph(t.localText)}<h2>${esc(t.deletedTitle)}</h2>${paragraph(t.deletedText)}<h2>${esc(t.notDeletedTitle)}</h2><ul>${['downloadsRemain','subscriptionRemains','storeRecords'].map(k=>`<li>${esc(t[k])}</li>`).join('')}</ul>${paragraph(t.needHelp)}</article>`;
    } else {
      const credits = `<section class="panel"><h2>${esc(t.sourcesTitle)}</h2>${paragraph(t.sourcesIntro)}<ul><li>${sourceLink('https://api-docs.quran.com/docs/tutorials/fonts/font-rendering/','Quran Foundation — QCF V4 Tajweed fonts')}: ${esc(t.qcfCredit)}</li><li>${sourceLink('https://github.com/quran-ws/quran-svg','quran-ws/quran-svg')}: ${esc(t.svgCredit)}</li><li>${sourceLink('https://tanzil.net/docs/Text_License','Tanzil Project — Quran text license')}: ${esc(t.tanzilCredit)}</li><li>${sourceLink('https://api-docs.quran.com/docs/api-reference/','Quran Foundation / Quran.com Content API')}: ${esc(t.tafsirCredit)}</li><li>${sourceLink('https://everyayah.com/','EveryAyah.com')} · ${sourceLink('https://alquran.cloud/','AlQuran Cloud')}: ${esc(t.recitationCredit)}</li></ul><p>${esc(t.sourceTerms)}</p><p>${link('privacy',t.privacy)} · ${link('deletion',t.deletion)}</p></section>`;
      content = `<header class="hero"><h1>${esc(t.aboutTitle)}</h1>${paragraph(t.aboutIntro)}<p class="notice">${esc(t.translationNote)}</p></header>${section(t.readingTitle,paragraph(t.readingText))}${section(t.tajwidTitle,paragraph(t.tajwidText))}${section(t.tafsirTitle,paragraph(t.tafsirText))}${section(t.personalTitle,paragraph(t.personalText))}${section(t.aiTitle,paragraph(t.aiText))}${credits}`;
    }
    document.getElementById('app').innerHTML = `<div class="top"><a class="brand" href="${hrefs.home}?lang=${language}">${esc(t.app)}</a>${select}</div>${nav}${content}<footer class="footer"><p>${esc(t.contact)}: <a class="ltr" href="mailto:trendytech355@gmail.com">trendytech355@gmail.com</a></p><p>${link('privacy',t.privacy)} · ${link('deletion',t.deletion)} · ${link('about',t.about)}</p></footer>`;
    document.getElementById('language').addEventListener('change', (event) => {
      language = event.target.value;
      try { localStorage.setItem('qk-site-language', language); } catch {}
      const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState({}, '', url);
      render(window.qkTranslations[language] || window.qkTranslations.en);
    });
  }

  fetch(root + 'translations.json').then((response) => {
    if (!response.ok) throw new Error('Unable to load translations');
    return response.json();
  }).then((translations) => {
    window.qkTranslations = translations;
    render(translations[language] || translations.en);
  }).catch(() => {
    document.getElementById('app').textContent = 'Quran Kareem pages are temporarily unavailable. Please try again later.';
  });
})();
