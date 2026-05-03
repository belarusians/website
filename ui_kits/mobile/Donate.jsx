// Mobile Donate screen — 3 variants

function MobileDonate({ lang, variant = 'hybrid' }) {
  if (variant === 'tiers')   return <MobileDonateTiers lang={lang}/>;
  if (variant === 'story')   return <MobileDonateStory lang={lang}/>;
  if (variant === 'classic') return <MobileDonateClassic lang={lang}/>;
  return <MobileDonateHybrid lang={lang}/>;
}

// ---------- HYBRID (final): 2-col tier grid, white cards + red accents only ----------
function MobileDonateHybrid({ lang }) {
  const T = donateT(lang);
  const [tier, setTier] = React.useState(1);
  const [freq, setFreq] = React.useState('one');

  const tiers = [{ a: 10 }, { a: 25 }, { a: 50 }, { a: 100 }];
  const custom = lang === 'nl' ? 'Ander bedrag' : 'Іншая сума';
  const whereH = lang === 'nl' ? 'Waar gaat het geld heen?' : 'Куды ідуць грошы?';
  const whereB = lang === 'nl'
    ? 'MARA wordt volledig door vrijwilligers gerund. Uw donatie dekt zaalhuur voor evenementen, paspoortbegeleiding en de lopende kosten van de gemeenschap. 100% gaat naar activiteiten — geen salarissen, geen overhead.'
    : 'MARA працуе выключна на валанцёрах. Ваш унёсак пакрывае арэнду для падзей, пашпартную падтрымку і бягучыя выдаткі грамады. 100% — на дзейнасць, без заробкаў і накладных выдаткаў.';
  const selectedAmount = tiers[tier]?.a ?? 25;

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 14 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted">{lang === 'nl' ? 'Kies wat uw bijdrage mogelijk maakt.' : 'Абярыце, што магчыма дзякуючы вам.'}</p>
      </section>

      <div className="m-radio-row">
        <button className={freq === 'one' ? 'active' : ''} onClick={() => setFreq('one')}>{T.oneTime}</button>
        <button className={freq === 'mon' ? 'active' : ''} onClick={() => setFreq('mon')}>{T.monthly}</button>
      </div>

      {/* 2-col grid of white tier cards — amount only */}
      <div style={{
        padding: '0 16px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {tiers.map((t, i) => {
          const selected = tier === i;
          return (
            <button key={i} onClick={() => setTier(i)}
              style={{
                background: selected ? '#ED1C24' : '#fff',
                color: selected ? '#fff' : '#231F20',
                padding: '26px 20px',
                borderRadius: 10,
                textAlign: 'center',
                minHeight: 88,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: selected
                  ? '0 10px 20px -6px rgba(237,28,36,.35)'
                  : '0 10px 15px -3px rgb(0 0 0 /.08)',
                transition: 'background .15s, color .15s, box-shadow .15s',
                position: 'relative',
              }}>
              <div style={{
                fontSize: 30, fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1,
              }}>€{t.a}</div>
              {selected && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 20, height: 20, borderRadius: 10,
                  background: '#fff', color: '#ED1C24',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>✓</div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        <input className="m-price-custom" placeholder={custom}/>
      </div>

      <div className="m-spacer-l"/>

      <div style={{ padding: '0 16px' }}>
        <button className="m-btn m-btn-primary">
          {T.submit} €{selectedAmount}{freq === 'mon' ? (lang === 'nl' ? '/maand' : '/мес') : ''}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#808080', marginTop: 10 }}>
          {T.secure}
        </div>
      </div>

      <div className="m-spacer-l"/>
      <section className="m-section">
        <h2 className="m-h2">{whereH}</h2>
        <p className="m-body">{whereB}</p>
      </section>
    </div>
  );
}

// Shared strings
function donateT(lang) {
  return lang === 'nl' ? {
    eyebrow: 'Steun MARA',
    title: 'Uw bijdrage maakt het verschil',
    sub: 'Vanaf €1. Elk bedrag helpt. 100% gaat naar de gemeenschap.',
    oneTime: 'Eenmalig', monthly: 'Maandelijks',
    amount: 'Bedrag', currency: '€', custom: 'Ander bedrag',
    name: 'Naam', email: 'E-mail',
    consent: 'Ik wil anoniem doneren',
    submit: 'Doneer', secure: 'Beveiligd via Mollie · iDEAL, kaart, SEPA',
    impact1: '€10', impact1t: 'Drukmateriaal voor één evenement',
    impact2: '€25', impact2t: 'Juridische consultatie voor één persoon',
    impact3: '€100', impact3t: 'Ondersteuning Belarussische school (1 week)',
    why: 'Waar gaat het geld heen?',
    whyBody: 'MARA is 100% vrijwilligers. Uw donatie gaat naar zaalhuur, paspoortbegeleiding, en culturele evenementen.',
    thanks: 'Al meer dan 400 mensen steunen ons',
    members: ['А.', 'М.', 'К.', 'Н.', 'В.'],
  } : {
    eyebrow: 'Падтрымайце MARA',
    title: 'Ваш унёсак — гэта розніца',
    sub: 'Ад €1. Любая сума дапаможа. 100% ідзе на грамаду.',
    oneTime: 'Разова', monthly: 'Штомесяц',
    amount: 'Сума', currency: '€', custom: 'Іншая сума',
    name: 'Імя', email: 'Email',
    consent: 'Ахвяраваць ананімна',
    submit: 'Ахвяраваць', secure: 'Бяспечна праз Mollie · iDEAL, карта, SEPA',
    impact1: '€10', impact1t: 'Матэрыялы для адной падзеі',
    impact2: '€25', impact2t: 'Юрыдычная кансультацыя для аднаго чалавека',
    impact3: '€100', impact3t: 'Беларуская школа (1 тыдзень)',
    why: 'Куды ідуць грошы?',
    whyBody: 'MARA — на 100% валанцёры. Ваш унёсак ідзе на арэнду, пашпартную падтрымку і культурныя падзеі.',
    thanks: 'Больш за 400 чалавек падтрымліваюць нас',
    members: ['А.', 'М.', 'К.', 'Н.', 'В.'],
  };
}

// ---------- Variant A: Classic donation form ----------
function MobileDonateClassic({ lang }) {
  const T = donateT(lang);
  const [freq, setFreq] = React.useState('one');
  const [amount, setAmount] = React.useState(25);
  const amounts = [10, 25, 50, 100, 250, 500];

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 14 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted">{T.sub}</p>
      </section>

      <div className="m-radio-row">
        <button className={freq === 'one' ? 'active' : ''} onClick={() => setFreq('one')}>{T.oneTime}</button>
        <button className={freq === 'mon' ? 'active' : ''} onClick={() => setFreq('mon')}>{T.monthly}</button>
      </div>

      <div className="m-field">
        <label>{T.amount}</label>
      </div>
      <div className="m-price-grid">
        {amounts.map(a => (
          <button key={a} className={`m-price ${amount === a ? 'active' : ''}`} onClick={() => setAmount(a)}>
            {T.currency}{a}
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 16px 0' }}>
        <input className="m-price-custom" placeholder={T.custom}/>
      </div>

      <div className="m-spacer-l"/>

      <div className="m-field"><label>{T.name}</label>
        <input className="m-form input" placeholder={T.name} style={{ width: '100%' }}/>
      </div>
      <div className="m-form" style={{ padding: '0 16px', marginBottom: 8 }}>
        <input className="input" placeholder={T.email}/>
      </div>

      <label className="m-check">
        <input type="checkbox"/>
        <span className="cb"/>
        <span>{T.consent}</span>
      </label>

      <div className="m-spacer-m"/>
      <div style={{ padding: '0 16px' }}>
        <button className="m-btn m-btn-primary">
          {T.submit} {T.currency}{amount}{freq === 'mon' ? '/mo' : ''}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#808080', marginTop: 10 }}>
          {T.secure}
        </div>
      </div>

      <div className="m-spacer-l"/>
      <section className="m-section">
        <h2 className="m-h2">{T.why}</h2>
        <p className="m-body">{T.whyBody}</p>
      </section>
    </div>
  );
}

// ---------- Variant B: Impact tiers (big colored cards, pick-one) ----------
function MobileDonateTiers({ lang }) {
  const T = donateT(lang);
  const [tier, setTier] = React.useState(1);
  const tiers = [
    { k: 0, a: T.impact1, t: T.impact1t, c: '#F5C84A', dark: '#231F20' },
    { k: 1, a: T.impact2, t: T.impact2t, c: '#ED1C24', dark: '#fff' },
    { k: 2, a: T.impact3, t: T.impact3t, c: '#4B1D6B', dark: '#fff' },
  ];
  const selected = tiers[tier];

  return (
    <div>
      <section className="m-section" style={{ paddingBottom: 14 }}>
        <div className="m-eyebrow">{T.eyebrow}</div>
        <h1 className="m-h1">{T.title}</h1>
        <p className="m-body m-muted">{lang === 'nl' ? 'Kies wat uw bijdrage mogelijk maakt.' : 'Абярыце, што магчыма дзякуючы вам.'}</p>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {tiers.map(t => (
          <button key={t.k}
            onClick={() => setTier(t.k)}
            style={{
              background: t.c, color: t.dark,
              padding: '22px 22px',
              borderRadius: 12,
              textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: tier === t.k
                ? '0 0 0 3px #231F20, 0 20px 25px -5px rgb(0 0 0 /.15)'
                : '0 10px 15px -3px rgb(0 0 0 /.10)',
              transition: 'box-shadow .2s, transform .1s',
              minHeight: 88,
            }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1 }}>{t.a}</div>
              <div style={{ fontSize: 13, marginTop: 8, opacity: .85, lineHeight: 1.35 }}>{t.t}</div>
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: tier === t.k ? t.dark : 'transparent',
              border: `2px solid ${t.dark}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.c, fontSize: 14, fontWeight: 700,
              flexShrink: 0, marginLeft: 16,
            }}>{tier === t.k ? '✓' : ''}</div>
          </button>
        ))}
      </div>

      <div className="m-spacer-m"/>
      <div className="m-radio-row" style={{ margin: '8px 0 20px' }}>
        <button className="active">{T.oneTime}</button>
        <button>{T.monthly}</button>
      </div>

      <div style={{ padding: '0 16px' }}>
        <button className="m-btn m-btn-primary">
          {T.submit} {selected.a}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#808080', marginTop: 10 }}>
          {T.secure}
        </div>
      </div>

      <div className="m-spacer-l"/>
      <section className="m-section" style={{ background: '#fff', margin: '0 16px', borderRadius: 12, boxShadow: '0 10px 15px -3px rgb(0 0 0/.08)' }}>
        <div style={{ display: 'flex', gap: -8, marginBottom: 12 }}>
          {T.members.map((m, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 18,
              background: ['#ED1C24','#231F20','#F64D04','#4B1D6B','#808080'][i],
              color: '#fff', fontWeight: 500, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: i === 0 ? 0 : -10, border: '2px solid #fff',
            }}>{m}</div>
          ))}
        </div>
        <div style={{ fontWeight: 500, fontSize: 15 }}>{T.thanks}</div>
      </section>
    </div>
  );
}

// ---------- Variant C: Story-driven (emotional hero + single CTA) ----------
function MobileDonateStory({ lang }) {
  const T = donateT(lang);
  const story = lang === 'nl'
    ? 'Elke week helpen we 8–12 Belarussen met paspoortaanvragen, huisvesting, of juridisch advies. Elke maand brengen we 300+ mensen samen bij culturele evenementen. Uw steun maakt dit mogelijk.'
    : 'Кожны тыдзень мы дапамагаем 8–12 беларусам з пашпартамі, жыллём ці юрыдычнымі парадамі. Кожны месяц 300+ чалавек збіраецца на культурных падзеях. Вы робіце гэта магчымым.';
  const [freq, setFreq] = React.useState('mon');
  const [amount, setAmount] = React.useState(10);

  return (
    <div>
      {/* Emotional hero */}
      <div style={{
        margin: '0 16px 20px', borderRadius: 16,
        padding: '32px 24px',
        color: '#fff',
        background:
          'radial-gradient(circle at 85% 15%, rgba(245,200,74,.35), transparent 60%),' +
          'radial-gradient(circle at 15% 90%, rgba(175,0,0,.7), transparent 60%),' +
          'linear-gradient(160deg, #ED1C24 0%, #AF0000 100%)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .85, marginBottom: 16 }}>
          {T.eyebrow}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-.01em', margin: 0 }}>
          {T.title}
        </h1>
      </div>

      <section className="m-section" style={{ paddingTop: 0 }}>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#231F20', margin: 0 }}>{story}</p>
      </section>

      <div className="m-radio-row">
        <button className={freq === 'one' ? 'active' : ''} onClick={() => setFreq('one')}>{T.oneTime}</button>
        <button className={freq === 'mon' ? 'active' : ''} onClick={() => setFreq('mon')}>{T.monthly}</button>
      </div>

      <div className="m-price-grid">
        {[5, 10, 25, 50, 100, 250].map(a => (
          <button key={a} className={`m-price ${amount === a ? 'active' : ''}`} onClick={() => setAmount(a)}>
            {T.currency}{a}
          </button>
        ))}
      </div>

      <div className="m-spacer-l"/>

      <div style={{ padding: '0 16px' }}>
        <button className="m-btn m-btn-primary">
          {T.submit} {T.currency}{amount}{freq === 'mon' ? (lang === 'nl' ? '/maand' : '/мес') : ''}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#808080', marginTop: 10 }}>
          {T.secure}
        </div>
      </div>

      <div className="m-spacer-l"/>
      <div className="m-achievement" style={{ background: '#fff', color: '#231F20', boxShadow: '0 10px 15px -3px rgb(0 0 0/.08)' }}>
        {(lang === 'nl'
          ? [{ n: '8–12', c: 'Elke week geholpen' }, { n: '300+', c: 'Maandelijks samen' }, { n: '100%', c: 'Naar gemeenschap' }]
          : [{ n: '8–12', c: 'Кожны тыдзень' }, { n: '300+', c: 'Штомесяц разам' }, { n: '100%', c: 'На грамаду' }]
        ).map((a, i) => (
          <div key={i}>
            <div className="num" style={{ color: '#ED1C24' }}>{a.n}</div>
            <div className="cap" style={{ color: '#808080' }}>{a.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MobileDonate });
