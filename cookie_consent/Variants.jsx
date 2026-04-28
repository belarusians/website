/* Cookie consent — V2.d (quiet) — desktop + mobile.
   Buttons strictly follow .mara-btn from the design system:
   shadow-only hover, font-weight 400, no transform.
*/

const COPY = {
  be: {
    title: "Cookies для рэкламы",
    body: "Мы лічым канверсію рэкламы, якую запускаем у Google і Meta. Іншага мы не адсочваем.",
    accept: "Прыняць",
    reject: "Адхіліць",
    privacy: "Палітыка прыватнасці",
    reopen: "Cookies",
  },
  nl: {
    title: "Cookies voor advertenties",
    body: "We meten conversies van advertenties die we op Google en Meta laten lopen. Verder volgen we niets.",
    accept: "Accepteren",
    reject: "Weigeren",
    privacy: "Privacybeleid",
    reopen: "Cookies",
  },
  en: {
    title: "Ad cookies",
    body: "We measure conversions for the ads we run on Google and Meta. Nothing else is tracked.",
    accept: "Accept",
    reject: "Decline",
    privacy: "Privacy policy",
    reopen: "Cookies",
  },
};

/* ============================================================
   Banner — shared between desktop + mobile via class modifier
   ============================================================ */
function ConsentBanner({ lang, mode = "desktop" }) {
  const [shown, setShown] = React.useState(true);
  const t = COPY[lang];
  const cls = `cc cc--quiet cc--${mode}`;

  return (
    <>
      {shown && (
        <div className={cls}>
          <h3 className="cc__title">{t.title}</h3>
          <p className="cc__body">{t.body}</p>
          <div className="cc__row">
            <a href="#" className="cc__privacy">{t.privacy}</a>
            <div className="cc__actions">
              <button className="btn btn--ghost" onClick={() => setShown(false)}>{t.reject}</button>
              <button className="btn btn--primary" onClick={() => setShown(false)}>{t.accept}</button>
            </div>
          </div>
        </div>
      )}
      {!shown && (
        <button className={`cc-reopen cc-reopen--${mode}`} onClick={() => setShown(true)}>
          <span className="cc-reopen__dot" />
          {t.reopen}
        </button>
      )}
    </>
  );
}

/* ============================================================
   Desktop frame
   ============================================================ */
function SiteFrame({ children, height = 560 }) {
  return (
    <div className="site-frame" style={{ height }}>
      <div className="site-frame__chrome">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <div className="site-frame__addr">belarusians.nl</div>
      </div>
      <div className="site-frame__body">
        <div className="site-frame__header">
          <img src="logo_icon.svg" alt="" className="site-frame__logo" />
          <span className="site-frame__wordmark">MÁRA</span>
          <nav className="site-frame__nav">
            <span>Home</span><span>Імпрэзы</span><span>Пра нас</span>
            <span className="site-frame__donate">Падтрымаць</span>
          </nav>
        </div>
        <div className="site-frame__hero">
          <div className="site-frame__h1" />
          <div className="site-frame__line" />
          <div className="site-frame__line" style={{ width: "82%" }} />
          <div className="site-frame__line" style={{ width: "67%" }} />
          <div className="site-frame__cards"><div /><div /><div /></div>
        </div>
        {children}
      </div>
    </div>
  );
}

function LangChip({ lang, setLang }) {
  return (
    <div className="lang-chip" role="tablist" aria-label="Language">
      {["be", "nl", "en"].map(l => (
        <button
          key={l}
          role="tab"
          aria-selected={lang === l}
          className={lang === l ? "active" : ""}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   Mobile content (inside iOS frame)
   ============================================================ */
function MobileSite({ children }) {
  return (
    <div className="m-site">
      <div className="m-site__header">
        <img src="logo_icon.svg" alt="" className="m-site__logo" />
        <span className="m-site__wordmark">MÁRA</span>
        <span className="m-site__menu">≡</span>
      </div>
      <div className="m-site__hero">
        <div className="m-site__h1" />
        <div className="m-site__line" />
        <div className="m-site__line" style={{ width: "82%" }} />
        <div className="m-site__line" style={{ width: "70%" }} />
        <div className="m-site__card" />
        <div className="m-site__card" />
      </div>
      {children}
      <nav className="m-tabbar">
        <button className="active">
          <span className="ico">⌂</span>
          <span>Дом</span>
        </button>
        <button>
          <span className="ico">◉</span>
          <span>Падзеі</span>
        </button>
        <button className="donate-tab">
          <span className="dot">♥</span>
          <span>Падтр.</span>
        </button>
        <button>
          <span className="ico">❉</span>
          <span>Дапам.</span>
        </button>
        <button>
          <span className="ico">ⓘ</span>
          <span>Інфа</span>
        </button>
      </nav>
    </div>
  );
}

/* ============================================================
   Boards
   ============================================================ */
function DesktopBoard() {
  const [lang, setLang] = React.useState("be");
  return (
    <div className="board">
      <LangChip lang={lang} setLang={setLang} />
      <SiteFrame>
        <ConsentBanner lang={lang} mode="desktop" />
      </SiteFrame>
      <div className="board__caption">
        Bottom-left card. Buttons match .mara-btn — shadow-only hover, no background change. Decline / Accept dismiss.
      </div>
    </div>
  );
}

function MobileBoard() {
  const [lang, setLang] = React.useState("be");
  return (
    <div className="board board--mobile">
      <LangChip lang={lang} setLang={setLang} />
      <div className="phone-wrap">
        <IOSDevice width={360} height={720}>
          <MobileSite>
            <ConsentBanner lang={lang} mode="mobile" />
          </MobileSite>
        </IOSDevice>
      </div>
      <div className="board__caption">
        Mobile: full-width bottom sheet, safe-area inset. Buttons stack to equal-width row. Privacy link sits above on its own line.
      </div>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas
      title="Cookie consent — MÁRA"
      subtitle="Quiet card, desktop + mobile. Cookies measure ad conversion only (Google Ads + Meta Pixel)."
    >
      <DCSection id="primary" title="Final">
        <DCArtboard id="desktop" label="Desktop" width={960} height={620}>
          <DesktopBoard />
        </DCArtboard>
        <DCArtboard id="mobile" label="Mobile" width={520} height={820}>
          <MobileBoard />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
