// Mobile Header + Menu Sheet + Side Drawer
// Three nav patterns selectable via props

function MobileHeader({ navPattern, lang, setLang, onMenu, page, navigate }) {
  return (
    <header className="m-header" data-nav={navPattern}>
      <a href="#" onClick={e => { e.preventDefault(); navigate('home'); }}>
        <img className="logo" src="../../assets/logo_icon.svg" alt="MARA"/>
      </a>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {navPattern !== 'tabbar' && (
          <button className="m-iconbtn" onClick={onMenu} aria-label="Menu">
            <span className="bar"/>
          </button>
        )}
      </div>
    </header>
  );
}

// ---------- Menu Sheet (full-screen) ----------
function MenuSheet({ lang, setLang, navigate, onClose, page }) {
  const T = labels(lang);
  const [openGroup, setOpenGroup] = React.useState(null);

  const items = [
    { key: 'home', label: T.home },
    { key: 'about', label: T.about, sub: [
      { key: 'about', label: T.aboutUs },
      { key: 'about', label: T.team },
      { key: 'about', label: T.partners },
    ]},
    { key: 'events', label: T.events },
    { key: 'passport', label: T.passport, sub: [
      { key: 'passport', label: T.passportInfo },
      { key: 'passport', label: T.passportFaq },
    ]},
    { key: 'donate', label: T.donate },
  ];

  return (
    <>
      <div className="m-menu-sheet" role="dialog">
        <div className="head">
          <img src="../../assets/logo_icon.svg" width="34" height="34" alt="MARA"/>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="items">
          {items.map(item => item.sub ? (
            <div key={item.label}>
              <button
                className="item"
                onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
              >
                <span>{item.label}</span>
                <span className="chev" style={{ transform: openGroup === item.label ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
              </button>
              {openGroup === item.label && (
                <div className="sub">
                  {item.sub.map(s => (
                    <a key={s.label} onClick={() => { navigate(s.key); onClose(); }}>{s.label}</a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button key={item.label} className="item" onClick={() => { navigate(item.key); onClose(); }}>
              <span>{item.label}</span>
              <span className="chev">›</span>
            </button>
          ))}

          <div className="group-label">{T.language}</div>
          <div className="lang-row">
            <button className={lang === 'be' ? 'active' : ''} onClick={() => setLang('be')}>BE</button>
            <button className={lang === 'nl' ? 'active' : ''} onClick={() => setLang('nl')}>NL</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Side Drawer (from left) ----------
function SideDrawer({ lang, setLang, navigate, onClose, page }) {
  const T = labels(lang);
  const items = [
    { key: 'home', label: T.home },
    { key: 'about', label: T.about },
    { key: 'events', label: T.events },
    { key: 'passport', label: T.passport },
    { key: 'donate', label: T.donate },
  ];
  return (
    <div className="m-drawer" role="dialog">
      <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EBEBEB' }}>
        <img src="../../assets/logo_icon.svg" width="32" height="32" alt="MARA"/>
        <button className="m-iconbtn" onClick={onClose} style={{ width: 40, height: 40, boxShadow: 'none', background: '#F6F6F6' }}>
          <span style={{ color: '#ED1C24', fontSize: 24, lineHeight: 1 }}>×</span>
        </button>
      </div>
      <nav style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => { navigate(item.key); onClose(); }}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '18px 24px',
              font: page === item.key ? '500 17px Roboto' : '400 17px Roboto',
              color: page === item.key ? '#ED1C24' : '#231F20',
              borderLeft: page === item.key ? '3px solid #ED1C24' : '3px solid transparent',
            }}
          >
            <span>{item.label}</span>
            <span style={{ color: '#D0D0D0', fontSize: 14 }}>›</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: 16, borderTop: '1px solid #EBEBEB' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#808080', textTransform: 'uppercase', marginBottom: 8 }}>{T.language}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setLang('be')}
            style={{ flex: 1, padding: 12, borderRadius: 6, background: lang === 'be' ? '#ED1C24' : '#F6F6F6', color: lang === 'be' ? '#fff' : '#231F20', fontWeight: 500 }}
          >BE</button>
          <button
            onClick={() => setLang('nl')}
            style={{ flex: 1, padding: 12, borderRadius: 6, background: lang === 'nl' ? '#ED1C24' : '#F6F6F6', color: lang === 'nl' ? '#fff' : '#231F20', fontWeight: 500 }}
          >NL</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Bottom Tab Bar ----------
function TabBar({ page, navigate, lang }) {
  const T = labels(lang);
  const tabs = [
    { key: 'home',   label: T.tabHome,    icon: '⌂' },
    { key: 'events', label: T.tabEvents,  icon: '◉' },
    { key: 'donate', label: T.tabDonate,  donate: true },
    { key: 'passport', label: T.tabHelp,  icon: '❉' },
    { key: 'about',  label: T.tabInfo,    icon: 'ⓘ' },
  ];
  return (
    <nav className="m-tabbar">
      {tabs.map(t => t.donate ? (
        <button key={t.key} className={`donate-tab ${page === t.key ? 'active' : ''}`} onClick={() => navigate(t.key)}>
          <div className="dot">♥</div>
          <span>{t.label}</span>
        </button>
      ) : (
        <button key={t.key} className={page === t.key ? 'active' : ''} onClick={() => navigate(t.key)}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ---------- Labels (NL/BE) ----------
function labels(lang) {
  const nl = {
    home: 'Home', about: 'Over ons', events: 'Evenementen', donate: 'Doneren', passport: 'Vreemdelingenpaspoort',
    aboutUs: 'Over ons', team: 'Team', partners: 'Partners', passportInfo: 'Informatie', passportFaq: 'Veelgestelde vragen',
    language: 'Taal',
    tabHome: 'Home', tabEvents: 'Agenda', tabDonate: 'Steun', tabHelp: 'Hulp', tabInfo: 'Info',
  };
  const be = {
    home: 'Галоўная', about: 'Пра нас', events: 'Падзеі', donate: 'Падтрымаць', passport: 'Пашпарт іншаземца',
    aboutUs: 'Пра нас', team: 'Каманда', partners: 'Партнёры', passportInfo: 'Інфармацыя', passportFaq: 'Пытанні',
    language: 'Мова',
    tabHome: 'Дом', tabEvents: 'Падзеі', tabDonate: 'Падтр.', tabHelp: 'Дапам.', tabInfo: 'Інфа',
  };
  return lang === 'be' ? be : nl;
}

Object.assign(window, { MobileHeader, MenuSheet, SideDrawer, TabBar, labels });
