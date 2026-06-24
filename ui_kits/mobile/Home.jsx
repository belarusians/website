// Mobile Home screen — 3 variants

function MobileHome({ lang, variant = 'editorial', navigate }) {
  if (variant === 'cards')     return <MobileHomeCards lang={lang} navigate={navigate}/>;
  if (variant === 'immersive') return <MobileHomeImmersive lang={lang} navigate={navigate}/>;
  return <MobileHomeEditorial lang={lang} navigate={navigate}/>;
}

// ---------- Variant A: Editorial (matches desktop vibe) ----------
function MobileHomeEditorial({ lang, navigate }) {
  const T = {
    nl: {
      eyebrow: 'MARA — Vereniging van Belarusen in Nederland',
      title: 'De grootste gemeenschap van Belarussen in Nederland',
      sub: 'Wij verenigen, ondersteunen en vertegenwoordigen de Belarussische diaspora in Nederland sinds 2006.',
      upcoming: 'Aankomend',
      seeAll: 'Alles bekijken',
      latestNews: 'Laatste nieuws',
      featured: {
        date: '12 maart 2026',
        title: 'MARA ontvangt prijs voor maatschappelijke bijdrage',
        body: 'Onze vereniging kreeg erkenning van de gemeente Amsterdam voor het werk met Belarussische en Oekraïense gemeenschappen.',
      },
      news: [
        { d: '8 mrt', t: 'Vrouwen van Belarus — tentoonstelling geopend' },
        { d: '2 mrt', t: 'Nieuwe begeleiding bij paspoortaanvragen' },
        { d: '25 feb', t: 'Kupalle 2026 — vroegboektarief' },
      ],
      achievements: [
        { n: '1,200+', c: 'Leden' },
        { n: '18', c: 'Jaar actief' },
        { n: '42', c: 'Partners' },
      ],
      newsletter: 'Blijf op de hoogte',
      newsletterSub: 'Eens per maand. Evenementen, nieuws, oproepen.',
      place: 'Amsterdam',
    },
    be: {
      eyebrow: 'MARA — Суполка беларусаў у Нідэрландах',
      title: 'Найбуйнейшая суполка беларусаў у Нідэрландах',
      sub: 'Мы аб\'ядноўваем, падтрымліваем і прадстаўляем беларускую дыяспару ў Нідэрландах з 2006 года.',
      upcoming: 'Неўзабаве',
      seeAll: 'Усе падзеі',
      latestNews: 'Апошнія навіны',
      featured: {
        date: '12 сакавіка 2026',
        title: 'MARA атрымала прэмію за грамадзкі ўнёсак',
        body: 'Наша суполка атрымала прызнанне Амстэрдамскай муніцыпалітэтаў за працу з беларускай і ўкраінскай грамадамі.',
      },
      news: [
        { d: '8 сак', t: 'Жанчыны Беларусі — выстава адкрытая' },
        { d: '2 сак', t: 'Новая падтрымка пры атрыманні пашпарта' },
        { d: '25 лют', t: 'Купалле 2026 — ранняе браніраванне' },
      ],
      achievements: [
        { n: '1 200+', c: 'Сяброў' },
        { n: '18', c: 'Год працуем' },
        { n: '42', c: 'Партнёраў' },
      ],
      newsletter: 'Будзьце ў курсе',
      newsletterSub: 'Раз на месяц. Падзеі, навіны, заклікі.',
      place: 'Амстэрдам',
    },
  }[lang];

  const upcoming = lang === 'nl' ? [
    { live: 'Live inschrijven', d: '20 juni', t: 'Kupalle 2026 — Zomerfestival', l: 'Vondelpark, Amsterdam' },
    { d: '15 mei', t: 'Lezing: Belarussische literatuur nu', l: 'Nieuwe Kerk, Den Haag' },
    { d: '3 mei', t: 'Poolse-Belarussische fietstocht', l: 'Utrecht' },
  ] : [
    { live: 'Запіс адкрыты', d: '20 чэрв', t: 'Купалле 2026 — Летні фэст', l: 'Вондэлпарк, Амстэрдам' },
    { d: '15 мая', t: 'Лекцыя: сучасная беларуская літаратура', l: 'Nieuwe Kerk, Гаага' },
    { d: '3 мая', t: 'Польска-беларуская веларанда', l: 'Утрэхт' },
  ];

  return (
    <div>
      <section className="m-section" style={{ paddingTop: 8, paddingBottom: 16 }}>
        <div className="m-eyebrow">MARA</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted" style={{ marginBottom: 20 }}>{T.sub}</p>
      </section>

      <div className="m-featured">
        <div className="m-card">
          <div className="hero"/>
          <div className="m-card-body">
            <div style={{ fontSize: 11, color: '#808080', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
              {T.featured.date}
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.25, marginBottom: 8 }}>{T.featured.title}</div>
            <p style={{ fontSize: 14, color: '#4a4a4a', marginBottom: 0 }}>{T.featured.body}</p>
          </div>
        </div>
      </div>

      <section className="m-section-tight">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 0 8px' }}>
          <h2 className="m-h2" style={{ margin: 0 }}>{T.upcoming}</h2>
          <button onClick={() => navigate('events')} style={{ color: '#ED1C24', fontWeight: 500, fontSize: 13 }}>{T.seeAll} ›</button>
        </div>
      </section>
      <div className="m-hscroll">
        {upcoming.map((e, i) => (
          <div key={i} className="m-event">
            {e.live && <div className="live">{e.live}</div>}
            <div className="date">{e.d}</div>
            <div className="title">{e.t}</div>
            <div className="loc">◦ {e.l}</div>
          </div>
        ))}
      </div>

      <div className="m-spacer-m"/>
      <div className="m-achievement">
        {T.achievements.map((a, i) => (
          <div key={i}>
            <div className="num">{a.n}</div>
            <div className="cap">{a.c}</div>
          </div>
        ))}
      </div>

      <section className="m-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <h2 className="m-h2" style={{ margin: 0 }}>{T.latestNews}</h2>
          <button style={{ color: '#ED1C24', fontWeight: 500, fontSize: 13 }}>{T.seeAll} ›</button>
        </div>
      </section>
      <div className="m-news">
        {T.news.map((n, i) => (
          <div key={i} className="item">
            <div className="thumb" style={{
              background: i % 2 === 0
                ? 'linear-gradient(135deg, #ED1C24 0%, #AF0000 100%)'
                : 'linear-gradient(135deg, #4a2226 0%, #231F20 100%)',
            }}/>
            <div className="body">
              <div className="d">{n.d} · 2026</div>
              <div style={{ fontWeight: 500, lineHeight: 1.35, color: '#231F20' }}>{n.t}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="m-spacer-l"/>
      <section className="m-section">
        <h2 className="m-h2">{T.newsletter}</h2>
        <p className="m-body m-muted" style={{ marginBottom: 16 }}>{T.newsletterSub}</p>
      </section>
      <div className="m-form">
        <input className="input" placeholder={lang === 'nl' ? 'E-mail' : 'Электронная пошта'}/>
        <button className="m-btn m-btn-primary">{lang === 'nl' ? 'Aanmelden' : 'Падпісацца'}</button>
      </div>
    </div>
  );
}

// ---------- Variant B: Cards-first (denser, more scannable) ----------
function MobileHomeCards({ lang, navigate }) {
  const T = lang === 'nl'
    ? { hello: 'Hallo,', intro: 'Wat gebeurt er deze maand bij MARA', shortcuts: 'Snel naar', events: 'Deze maand', news: 'Lezen', community: 'De gemeenschap' }
    : { hello: 'Вітаем,', intro: 'Што адбываецца ў MARA гэтым месяцам', shortcuts: 'Хутка', events: 'Гэты месяц', news: 'Чытаць', community: 'Супольнасць' };

  const shortcuts = lang === 'nl' ? [
    { t: 'Vreemdelingen-\npaspoort', c: '#ED1C24', k: 'passport' },
    { t: 'Evenementen', c: '#231F20', k: 'events' },
    { t: 'Lidmaatschap', c: '#4B1D6B', k: 'about' },
    { t: 'Doneren', c: '#F64D04', k: 'donate' },
  ] : [
    { t: 'Пашпарт\nіншаземца', c: '#ED1C24', k: 'passport' },
    { t: 'Падзеі', c: '#231F20', k: 'events' },
    { t: 'Сяброўства', c: '#4B1D6B', k: 'about' },
    { t: 'Падтрымаць', c: '#F64D04', k: 'donate' },
  ];

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 12 }}>
        <div className="m-eyebrow">{T.hello}</div>
        <h1 className="m-h1" style={{ fontSize: 24 }}>{T.intro}</h1>
      </section>

      <section className="m-section" style={{ padding: '4px 16px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#808080', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>{T.shortcuts}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {shortcuts.map((s, i) => (
            <button key={i} onClick={() => navigate(s.k)}
              style={{
                background: s.c, color: '#fff',
                borderRadius: 12, padding: '22px 18px 18px',
                minHeight: 110,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                textAlign: 'left',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 /.10)',
              }}>
              <div style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 500, whiteSpace: 'pre-line' }}>{s.t}</div>
              <div style={{ fontSize: 18, opacity: .9, textAlign: 'right' }}>→</div>
            </button>
          ))}
        </div>
      </section>

      <section className="m-section" style={{ paddingBottom: 8 }}>
        <h2 className="m-h2">{T.events}</h2>
      </section>
      <div className="m-hscroll">
        {(lang === 'nl' ? [
          { d: '20 jun', t: 'Kupalle 2026', l: 'Vondelpark' },
          { d: '15 mei', t: 'Lezing literatuur', l: 'Den Haag' },
          { d: '3 mei',  t: 'Fietstocht', l: 'Utrecht' },
        ] : [
          { d: '20 чэрв', t: 'Купалле 2026', l: 'Вондэлпарк' },
          { d: '15 мая', t: 'Лекцыя', l: 'Гаага' },
          { d: '3 мая',  t: 'Веларанда', l: 'Утрэхт' },
        ]).map((e, i) => (
          <div key={i} className="m-event">
            <div className="date">{e.d}</div>
            <div className="title">{e.t}</div>
            <div className="loc">◦ {e.l}</div>
          </div>
        ))}
      </div>

      <section className="m-section">
        <h2 className="m-h2">{T.news}</h2>
        <div className="m-news" style={{ padding: 0 }}>
          {(lang === 'nl' ? [
            { d: '12 mrt', t: 'MARA ontvangt prijs voor maatschappelijke bijdrage' },
            { d: '8 mrt', t: 'Vrouwen van Belarus — tentoonstelling geopend' },
            { d: '25 feb', t: 'Kupalle 2026 — vroegboektarief beschikbaar' },
          ] : [
            { d: '12 сак', t: 'MARA атрымала прэмію за грамадскі ўнёсак' },
            { d: '8 сак', t: 'Жанчыны Беларусі — адкрылася выстава' },
            { d: '25 лют', t: 'Купалле 2026 — ранняе браніраванне' },
          ]).map((n, i) => (
            <div key={i} className="item">
              <div className="thumb" style={{
                background: ['linear-gradient(135deg,#ED1C24,#AF0000)','linear-gradient(135deg,#231F20,#4a2226)','linear-gradient(135deg,#4B1D6B,#8B2F8F)'][i],
              }}/>
              <div className="body">
                <div className="d">{n.d} · 2026</div>
                <div style={{ fontWeight: 500, lineHeight: 1.35 }}>{n.t}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Variant C: Immersive hero (bold, full-bleed) ----------
function MobileHomeImmersive({ lang, navigate }) {
  const T = lang === 'nl' ? {
    tag: 'Sinds 2006',
    title: 'Thuis voor Belarussen in Nederland',
    sub: 'MARA — vereniging, gemeenschap, stem.',
    cta: 'Word lid',
    events: 'Wat er gebeurt',
    seeAll: 'Alle evenementen',
    story: 'Ons verhaal',
    storyBody: '18 jaar lang brengen we Belarussen samen — voor cultuur, taal, rechten, en steun aan degenen die hulp nodig hebben.',
    readMore: 'Lees meer',
  } : {
    tag: 'З 2006 года',
    title: 'Дом для беларусаў у Нідэрландах',
    sub: 'MARA — суполка, грамада, голас.',
    cta: 'Далучыцца',
    events: 'Што адбываецца',
    seeAll: 'Усе падзеі',
    story: 'Наша гісторыя',
    storyBody: '18 гадоў мы аб\'ядноўваем беларусаў — дзеля культуры, мовы, правоў і падтрымкі тых, каму патрэбная дапамога.',
    readMore: 'Чытаць',
  };

  return (
    <div>
      {/* Immersive hero */}
      <div style={{
        margin: '0 16px 20px', borderRadius: 16,
        minHeight: 380, padding: '28px 24px 28px',
        color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background:
          'radial-gradient(circle at 15% 85%, rgba(175,0,0,0.6), transparent 60%),' +
          'radial-gradient(circle at 80% 20%, rgba(75,29,107,0.55), transparent 65%),' +
          'linear-gradient(160deg, #231F20 0%, #3a1a1c 100%)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 /.18)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .75, marginBottom: 14 }}>
            {T.tag}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-.015em', margin: '0 0 16px' }}>{T.title}</h1>
          <p style={{ fontSize: 16, opacity: .85, margin: 0 }}>{T.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('about')}
            style={{
              flex: 1, padding: '16px', borderRadius: 8,
              background: '#fff', color: '#231F20',
              fontWeight: 500, fontSize: 15,
            }}>{T.cta}</button>
          <button onClick={() => navigate('events')}
            style={{
              width: 56, padding: 16, borderRadius: 8,
              background: 'rgba(255,255,255,.14)', color: '#fff',
              border: '1px solid rgba(255,255,255,.3)',
            }}>→</button>
        </div>
      </div>

      <section className="m-section" style={{ paddingBottom: 8, paddingTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 className="m-h2" style={{ margin: 0 }}>{T.events}</h2>
          <button onClick={() => navigate('events')} style={{ color: '#ED1C24', fontWeight: 500, fontSize: 13 }}>{T.seeAll} ›</button>
        </div>
      </section>
      <div className="m-hscroll">
        {(lang === 'nl' ? [
          { live: 'Inschrijven open', d: '20 juni 2026', t: 'Kupalle 2026', l: 'Vondelpark, Amsterdam' },
          { d: '15 mei 2026', t: 'Lezing literatuur', l: 'Nieuwe Kerk, Den Haag' },
          { d: '3 mei 2026',  t: 'Fietstocht', l: 'Utrecht' },
        ] : [
          { live: 'Рэгістрацыя', d: '20 чэрв 2026', t: 'Купалле 2026', l: 'Вондэлпарк' },
          { d: '15 мая 2026', t: 'Лекцыя', l: 'Гаага' },
          { d: '3 мая 2026',  t: 'Веларанда', l: 'Утрэхт' },
        ]).map((e, i) => (
          <div key={i} className="m-event">
            {e.live && <div className="live">{e.live}</div>}
            <div className="date">{e.d}</div>
            <div className="title">{e.t}</div>
            <div className="loc">◦ {e.l}</div>
          </div>
        ))}
      </div>

      <div className="m-spacer-l"/>
      <div className="m-achievement" style={{ background:
          'radial-gradient(circle at 80% 20%, rgba(175,0,0,.65), transparent 60%), #ED1C24' }}>
        {(lang === 'nl'
          ? [{ n: '1,200+', c: 'Leden' }, { n: '18', c: 'Jaar' }, { n: '42', c: 'Partners' }]
          : [{ n: '1 200+', c: 'Сяброў' }, { n: '18', c: 'Год' }, { n: '42', c: 'Партнёраў' }]
        ).map((a, i) => (
          <div key={i}>
            <div className="num">{a.n}</div>
            <div className="cap">{a.c}</div>
          </div>
        ))}
      </div>

      <section className="m-section">
        <div className="m-eyebrow">{T.story}</div>
        <p className="m-body" style={{ fontSize: 17, lineHeight: 1.55, color: '#231F20' }}>{T.storyBody}</p>
        <button onClick={() => navigate('about')}
          style={{ color: '#ED1C24', fontWeight: 500, fontSize: 15, padding: '10px 0' }}>
          {T.readMore} →
        </button>
      </section>
    </div>
  );
}

Object.assign(window, { MobileHome });
