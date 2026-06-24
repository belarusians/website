// Mobile About / Events / Passport screens

function MobileAbout({ lang }) {
  const T = lang === 'nl' ? {
    eyebrow: 'Over ons', title: 'Wie wij zijn',
    sub: 'MARA is sinds 2006 de stem van de Belarussische gemeenschap in Nederland.',
    mission: 'Missie', missionBody: 'We verbinden Belarussen in Nederland, behouden onze cultuur en taal, en staan op voor mensenrechten — in Belarus en daarbuiten.',
    values: 'Waarden', v: ['Solidariteit', 'Cultuur', 'Democratie', 'Integratie', 'Onafhankelijkheid'],
    team: 'Team', teamBody: 'Een bestuur van 7 vrijwilligers en 40+ actieve leden organiseren onze evenementen en programma\'s.',
    partners: 'Partners', partnersBody: 'We werken samen met Nederlandse en internationale organisaties.',
    contact: 'Contact',
  } : {
    eyebrow: 'Пра нас', title: 'Хто мы',
    sub: 'З 2006 года MARA — голас беларускай супольнасці ў Нідэрландах.',
    mission: 'Місія', missionBody: 'Мы аб\'ядноўваем беларусаў у Нідэрландах, захоўваем культуру і мову, адстойваем правы чалавека — у Беларусі і па-за ёй.',
    values: 'Каштоўнасці', v: ['Салідарнасць', 'Культура', 'Дэмакратыя', 'Інтэграцыя', 'Незалежнасць'],
    team: 'Каманда', teamBody: 'Рада з 7 валанцёраў і 40+ актыўных сяброў арганізуюць нашы падзеі і праграмы.',
    partners: 'Партнёры', partnersBody: 'Мы супрацоўнічаем з галандскімі і міжнароднымі арганізацыямі.',
    contact: 'Кантакт',
  };

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 16 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted">{T.sub}</p>
      </section>

      <div className="m-about-photo"/>

      <section className="m-section m-about-section">
        <h3>{T.mission}</h3>
        <p className="m-body">{T.missionBody}</p>
      </section>

      <section className="m-section m-about-section">
        <h3>{T.values}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {T.v.map((v, i) => (
            <div key={i} style={{
              padding: '10px 16px', background: '#fff', borderRadius: 9999,
              boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
              fontSize: 14, fontWeight: 500,
              color: ['#ED1C24','#231F20','#4B1D6B','#F64D04','#AF0000'][i],
            }}>{v}</div>
          ))}
        </div>
      </section>

      <section className="m-section m-about-section">
        <h3>{T.team}</h3>
        <p className="m-body">{T.teamBody}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
          {['АБ','ММ','КК','НВ','ВС','АЛ'].map((n, i) => (
            <div key={i} style={{
              background: '#fff', padding: '14px 8px',
              borderRadius: 10, textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 24,
                background: ['#ED1C24','#231F20','#4B1D6B','#F64D04','#AF0000','#808080'][i],
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px', fontWeight: 500, fontSize: 16,
              }}>{n}</div>
              <div style={{ fontSize: 12, color: '#808080' }}>{lang === 'nl' ? 'Bestuur' : 'Рада'}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="m-section m-about-section">
        <h3>{T.partners}</h3>
        <p className="m-body">{T.partnersBody}</p>
      </section>
      <div className="m-partners">
        {['GEMEENTE', 'KUPALLE', 'BYPOL', 'RADA'].map(p => (
          <div key={p} className="m-partner">{p}</div>
        ))}
      </div>
    </div>
  );
}

function MobileEvents({ lang }) {
  const T = lang === 'nl' ? {
    eyebrow: 'Agenda', title: 'Evenementen',
    sub: 'Culturele avonden, lezingen, manifestaties en viering van onze tradities.',
    filter: 'Filter', all: 'Alles', cult: 'Cultuur', pol: 'Politiek', edu: 'Educatie',
    upcoming: 'Aankomend', past: 'Voorbije evenementen',
  } : {
    eyebrow: 'Падзеі', title: 'Мерапрыемствы',
    sub: 'Культурныя вечары, лекцыі, акцыі і святы нашых традыцый.',
    filter: 'Фільтр', all: 'Усе', cult: 'Культура', pol: 'Палітыка', edu: 'Адукацыя',
    upcoming: 'Неўзабаве', past: 'Мінулыя',
  };

  const [filter, setFilter] = React.useState('all');
  const events = lang === 'nl' ? [
    { m: 'JUN', d: '20', t: 'Kupalle 2026 — Zomerfestival', l: 'Vondelpark, Amsterdam', tag: 'cult', live: 'Inschrijven open' },
    { m: 'MEI', d: '15', t: 'Lezing: Belarussische literatuur nu', l: 'Nieuwe Kerk, Den Haag', tag: 'edu' },
    { m: 'MEI', d: '3',  t: 'Poolse-Belarussische fietstocht', l: 'Utrecht', tag: 'cult' },
    { m: 'APR', d: '25', t: 'Vrijheidsdag — manifestatie', l: 'Plein, Den Haag', tag: 'pol' },
    { m: 'APR', d: '10', t: 'Belarussische taalcursus start', l: 'Amsterdam', tag: 'edu' },
  ] : [
    { m: 'ЧЭР', d: '20', t: 'Купалле 2026 — Летні фэст', l: 'Вондэлпарк, Амстэрдам', tag: 'cult', live: 'Рэгістрацыя' },
    { m: 'МАЙ', d: '15', t: 'Лекцыя: сучасная літаратура', l: 'Nieuwe Kerk, Гаага', tag: 'edu' },
    { m: 'МАЙ', d: '3',  t: 'Польска-беларуская веларанда', l: 'Утрэхт', tag: 'cult' },
    { m: 'КРА', d: '25', t: 'Дзень Волі — акцыя', l: 'Plein, Гаага', tag: 'pol' },
    { m: 'КРА', d: '10', t: 'Курсы беларускай мовы', l: 'Амстэрдам', tag: 'edu' },
  ];
  const shown = filter === 'all' ? events : events.filter(e => e.tag === filter);

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 16 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted">{T.sub}</p>
      </section>

      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[['all', T.all], ['cult', T.cult], ['pol', T.pol], ['edu', T.edu]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{
              padding: '10px 18px', borderRadius: 9999,
              background: filter === k ? '#ED1C24' : '#fff',
              color: filter === k ? '#fff' : '#231F20',
              fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: '0 10px 15px -3px rgb(0 0 0/.08)',
            }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((e, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 12, padding: 14,
            display: 'flex', gap: 14, alignItems: 'flex-start',
            boxShadow: '0 10px 15px -3px rgb(0 0 0/.08)',
          }}>
            <div style={{
              width: 64, flexShrink: 0, textAlign: 'center',
              background: '#F6F6F6', borderRadius: 8,
              padding: '10px 4px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ED1C24', letterSpacing: '.08em' }}>{e.m}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: '#231F20', lineHeight: 1.1, marginTop: 2 }}>{e.d}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {e.live && (
                <div style={{
                  display: 'inline-block', background: '#ED1C24', color: '#fff',
                  padding: '3px 8px', fontSize: 10, fontWeight: 700,
                  letterSpacing: '.08em', textTransform: 'uppercase',
                  borderRadius: 3, marginBottom: 8,
                }}>{e.live}</div>
              )}
              <div style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3, color: '#231F20', marginBottom: 6 }}>{e.t}</div>
              <div style={{ fontSize: 12, color: '#808080' }}>◦ {e.l}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePassport({ lang }) {
  const T = lang === 'nl' ? {
    eyebrow: 'Begeleiding',
    title: 'Vreemdelingen-\npaspoort',
    sub: 'Een vreemdelingenpaspoort is een reisdocument voor mensen die in Nederland wonen maar geen geldig nationaal paspoort kunnen krijgen. MARA begeleidt Belarussen door de aanvraag bij de IND.',
    whoH: 'Wie komt in aanmerking?',
    whoB: 'Belarussen met een geldige Nederlandse verblijfsvergunning (asiel of regulier) die aantoonbaar geen geldig Belarussisch paspoort kunnen verkrijgen of vernieuwen.',
    howH: 'Hoe werkt de aanvraag?',
    step1: 'IND-aanvraagformulier invullen en indienen',
    step2: 'Bewijsstukken verzamelen (verblijfsvergunning, bewijs van weigering/onmogelijkheid)',
    step3: 'Afspraak op IND-loket voor biometrie',
    step4: 'Wachttijd: gemiddeld 6–12 maanden',
    costH: 'Kosten & tijdsduur',
    costL1: 'IND-leges', costV1: '€57,10',
    costL2: 'Doorlooptijd', costV2: '6–12 mnd',
    costL3: 'MARA-begeleiding', costV3: 'Gratis',
    links: 'Officiële IND-pagina',
    formH: 'Hulp aanvragen',
    formS: 'Vul het formulier in en een vrijwilliger neemt binnen 5 werkdagen contact op.',
    name: 'Naam', email: 'E-mail', phone: 'Telefoon (optioneel)',
    desc: 'Korte beschrijving van uw situatie',
    descP: 'Bijv. huidige verblijfsstatus, of u al iets heeft geprobeerd…',
    submit: 'Verstuur aanvraag',
    privacy: 'Uw gegevens worden alleen gebruikt om contact op te nemen.',
  } : {
    eyebrow: 'Падтрымка',
    title: 'Пашпарт\nіншаземца',
    sub: 'Пашпарт іншаземца — дакумент для тых, хто жыве ў Нідэрландах, але не можа атрымаць сапраўдны нацыянальны пашпарт. MARA дапамагае беларусам прайсці працэдуру ў IND.',
    whoH: 'Хто можа падаць?',
    whoB: 'Беларусы з сапраўдным нідэрландскім дазволам на знаходжанне (прытулак ці звычайны), якія дакументальна не могуць атрымаць ці абнавіць беларускі пашпарт.',
    howH: 'Як адбываецца працэс?',
    step1: 'Запоўніць і падаць заяву ў IND',
    step2: 'Сабраць дакументы (від на жыхарства, пацверджанне адмовы)',
    step3: 'Сустрэча ў IND для біяметрыі',
    step4: 'Чаканне: у сярэднім 6–12 месяцаў',
    costH: 'Кошт і час',
    costL1: 'Збор IND', costV1: '€57,10',
    costL2: 'Тэрмін', costV2: '6–12 мес',
    costL3: 'Падтрымка MARA', costV3: 'Бясплатна',
    links: 'Афіцыйная старонка IND',
    formH: 'Запыт на дапамогу',
    formS: 'Запоўніце форму — валанцёр адкажа на працягу 5 працоўных дзён.',
    name: 'Імя', email: 'Email', phone: 'Тэлефон (неабавязкова)',
    desc: 'Кароткае апісанне сітуацыі',
    descP: 'Напр., цяперашні статус, што ўжо спрабавалі…',
    submit: 'Адправіць',
    privacy: 'Даныя выкарыстоўваюцца толькі для сувязі.',
  };

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 16 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1" style={{ whiteSpace: 'pre-line' }}>{T.title}</h1>
        <p className="m-body">{T.sub}</p>
      </section>

      {/* Eligibility */}
      <section className="m-section" style={{ paddingTop: 0 }}>
        <h2 className="m-h2">{T.whoH}</h2>
        <p className="m-body">{T.whoB}</p>
      </section>

      {/* Process steps (not a form — an article list) */}
      <section className="m-section" style={{ paddingTop: 0 }}>
        <h2 className="m-h2">{T.howH}</h2>
        <ol style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {[T.step1, T.step2, T.step3, T.step4].map((s, i) => (
            <li key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              background: '#fff', borderRadius: 8, padding: '14px 14px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, flexShrink: 0,
                background: '#ED1C24', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>{i + 1}</div>
              <div style={{ fontSize: 14, lineHeight: 1.45, color: '#231F20', paddingTop: 3 }}>{s}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Cost & duration — data strip */}
      <section className="m-section" style={{ paddingTop: 0 }}>
        <h2 className="m-h2">{T.costH}</h2>
        <div style={{
          background: '#fff', borderRadius: 8, overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
        }}>
          {[[T.costL1, T.costV1], [T.costL2, T.costV2], [T.costL3, T.costV3]].map(([l, v], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,.06)',
            }}>
              <span style={{ fontSize: 14, color: '#666' }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: '#231F20' }}>{v}</span>
            </div>
          ))}
        </div>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 14, fontSize: 14, color: '#ED1C24',
          fontWeight: 500, textDecoration: 'none',
        }}>
          <span>{T.links}</span>
          <span style={{ fontSize: 14 }}>↗</span>
        </a>
      </section>

      {/* Request-help form */}
      <section className="m-section" style={{ paddingTop: 0 }}>
        <h2 className="m-h2">{T.formH}</h2>
        <p className="m-body m-muted" style={{ fontSize: 14, marginBottom: 16 }}>{T.formS}</p>

        {[T.name, T.email, T.phone].map((ph, i) => (
          <input key={i} className="input" placeholder={ph} style={{
            width: '100%', padding: '14px 16px', border: 0, borderRadius: 8,
            background: '#fff', fontSize: 15, marginBottom: 10,
            boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
          }}/>
        ))}
        <textarea placeholder={T.descP} rows={4} style={{
          width: '100%', padding: '14px 16px', border: 0, borderRadius: 8,
          background: '#fff', fontSize: 15, resize: 'none',
          fontFamily: 'inherit',
          boxShadow: '0 10px 15px -3px rgb(0 0 0/.06)',
        }}/>

        <div className="m-spacer-m"/>
        <button className="m-btn m-btn-primary">{T.submit}</button>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#808080', marginTop: 10 }}>
          {T.privacy}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { MobileAbout, MobileEvents, MobilePassport });
