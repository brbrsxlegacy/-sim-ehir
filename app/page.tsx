"use client";

import { useMemo, useState } from "react";

type Screen = "home" | "create" | "lobby" | "game" | "results";

const defaultCategories = ["İsim", "Şehir", "Hayvan", "Bitki", "Eşya", "Ünlü"];

function SparkLogo() {
  return (
    <div className="brand" aria-label="İsim Şehir AI">
      <span className="brand-mark">İŞ</span>
      <span className="brand-name">İsim Şehir <b>AI</b></span>
    </div>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [rounds, setRounds] = useState(5);
  const [seconds, setSeconds] = useState(60);
  const [categories, setCategories] = useState(defaultCategories);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedPower, setSelectedPower] = useState("double");
  const [notice, setNotice] = useState("");

  const canContinue = name.trim().length >= 2;
  const code = useMemo(() => roomCode || "K7M4Q2", [roomCode]);

  function openCreate() {
    if (!canContinue) {
      setNotice("Önce en az 2 harfli bir oyuncu adı yaz.");
      return;
    }
    setNotice("");
    setScreen("create");
  }

  function createRoom() {
    setRoomCode(Math.random().toString(36).slice(2, 8).toUpperCase());
    setScreen("lobby");
  }

  function joinRoom() {
    if (!canContinue || roomCode.trim().length < 5) {
      setNotice("Oyuncu adını ve geçerli oda kodunu yaz.");
      return;
    }
    setNotice("");
    setScreen("lobby");
  }

  function toggleCategory(category: string) {
    setCategories((current) =>
      current.includes(category)
        ? current.length > 3 ? current.filter((item) => item !== category) : current
        : [...current, category],
    );
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="logo-button" onClick={() => setScreen("home")}><SparkLogo /></button>
        <div className="ai-pill"><span className="live-dot" /> GROQ AI</div>
      </header>

      {screen === "home" && (
        <section className="home-screen screen-enter">
          <div className="hero-copy">
            <div className="eyebrow"><Icon>✦</Icon> Klasik oyun, akıllı kapışma</div>
            <h1>Bir harf.<br /><span>Bin ihtimal.</span></h1>
            <p>İsim Şehir artık cevapları kendi kontrol ediyor. Odayı kur, arkadaşlarını çağır, özel güçlerle zirveye oyna.</p>
          </div>

          <div className="play-card glass-card">
            <label htmlFor="player-name">Oyuncu adın</label>
            <div className="input-wrap">
              <Icon>☺</Icon>
              <input id="player-name" value={name} onChange={(event) => setName(event.target.value.slice(0, 18))} placeholder="Örn. Barbaros" autoComplete="nickname" />
              <span className="counter">{name.length}/18</span>
            </div>

            <button className="primary-button" onClick={openCreate}><Icon>＋</Icon> Yeni oda oluştur <span>›</span></button>

            <div className="divider"><span>veya kodla katıl</span></div>

            <div className="join-row">
              <input aria-label="Oda kodu" value={roomCode} onChange={(event) => setRoomCode(event.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6))} placeholder="ODA KODU" />
              <button onClick={joinRoom}>Katıl</button>
            </div>
            {notice && <p className="notice">{notice}</p>}
          </div>

          <div className="feature-strip">
            <div><Icon>✓</Icon><span><b>AI hakem</b><small>Uydurma cevaba geçit yok</small></span></div>
            <div><Icon>⚡</Icon><span><b>Özel güçler</b><small>Rakiplerini şaşırt</small></span></div>
            <div><Icon>♟</Icon><span><b>30 oyuncu</b><small>Kalabalık odalar</small></span></div>
          </div>
        </section>
      )}

      {screen === "create" && (
        <section className="panel-screen screen-enter">
          <button className="back-button" onClick={() => setScreen("home")}>‹ Geri</button>
          <div className="section-heading">
            <span className="section-icon">⚙</span>
            <div><p>ODA AYARLARI</p><h1>Kapışmayı hazırla</h1></div>
          </div>

          <div className="settings-grid">
            <div className="glass-card setting-card">
              <div className="setting-title"><span>Tur sayısı</span><strong>{rounds} tur</strong></div>
              <input type="range" min="3" max="10" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} />
              <div className="range-labels"><span>3</span><span>10</span></div>
            </div>
            <div className="glass-card setting-card">
              <div className="setting-title"><span>Tur süresi</span><strong>{seconds} sn</strong></div>
              <div className="segmented">
                {[45, 60, 90].map((value) => <button key={value} className={seconds === value ? "active" : ""} onClick={() => setSeconds(value)}>{value}</button>)}
              </div>
            </div>
          </div>

          <div className="glass-card categories-card">
            <div className="setting-title"><span>Kategoriler</span><strong>{categories.length} seçili</strong></div>
            <div className="category-grid">
              {defaultCategories.map((category, index) => (
                <button key={category} className={categories.includes(category) ? "selected" : ""} onClick={() => toggleCategory(category)}>
                  <span>{["Aa", "⌂", "♞", "♧", "◇", "★"][index]}</span>{category}<b>✓</b>
                </button>
              ))}
            </div>
            <p className="hint">En az 3 kategori seçili kalmalıdır.</p>
          </div>

          <div className="glass-card power-info">
            <span className="bolt">⚡</span>
            <div><b>Özel güçler açık</b><p>Her oyuncu oyun boyunca 3 farklı gücü birer kez kullanabilir.</p></div>
            <span className="toggle"><i /></span>
          </div>

          <button className="primary-button create-final" onClick={createRoom}>Odayı oluştur <span>›</span></button>
        </section>
      )}

      {screen === "lobby" && (
        <section className="panel-screen lobby-screen screen-enter">
          <div className="lobby-hero">
            <div className="status-chip"><span className="live-dot" /> ODA HAZIR</div>
            <p>Arkadaşların bu kodla katılabilir</p>
            <button className="room-code" onClick={() => navigator.clipboard?.writeText(code)}>{code}<span>▣</span></button>
            <small>Kopyalamak için koda dokun</small>
          </div>

          <div className="glass-card players-card">
            <div className="setting-title"><span>Oyuncular</span><strong>1 / 30</strong></div>
            <div className="player-row">
              <span className="avatar">{(name.trim()[0] || "O").toUpperCase()}</span>
              <div><b>{name || "Oyuncu"}</b><small>Oda sahibi • Oyunda</small></div>
              <span className="crown">♛</span>
            </div>
            <div className="waiting-dots"><i /><i /><i /><span>Oyuncular bekleniyor…</span></div>
          </div>

          <div className="lobby-summary">
            <span><b>{rounds}</b> tur</span><span><b>{seconds}</b> saniye</span><span><b>{categories.length}</b> kategori</span>
          </div>
          <button className="primary-button" onClick={() => setScreen("game")}>Oyunu başlat <Icon>▶</Icon></button>
          <button className="ghost-button" onClick={() => setScreen("home")}>Odadan ayrıl</button>
        </section>
      )}

      {screen === "game" && (
        <section className="game-screen screen-enter">
          <div className="game-status">
            <div><small>TUR 1 / {rounds}</small><b>Harf Kapışması</b></div>
            <div className="timer"><span>00</span><b>:</b><span>{seconds}</span></div>
          </div>
          <div className="letter-orbit"><span>H</span><small>Bu harfle başla</small></div>

          <div className="answer-list">
            {categories.map((category, index) => (
              <label key={category} className="answer-field">
                <span className="answer-icon">{["Aa", "⌂", "♞", "♧", "◇", "★"][defaultCategories.indexOf(category)]}</span>
                <span className="answer-label">{category}</span>
                <input value={answers[category] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [category]: event.target.value }))} placeholder="Cevabını yaz…" autoCapitalize="words" />
                {index === 0 && answers[category] && <b className="valid-mark">✓</b>}
              </label>
            ))}
          </div>

          <div className="power-dock">
            <span>GÜÇ SEÇ</span>
            {[{ id: "double", icon: "2×", name: "Puan Katla" }, { id: "joker", icon: "✦", name: "AI Joker" }, { id: "shield", icon: "⬡", name: "Kalkan" }].map((power) => (
              <button key={power.id} className={selectedPower === power.id ? "active" : ""} onClick={() => setSelectedPower(power.id)}><b>{power.icon}</b><small>{power.name}</small></button>
            ))}
          </div>
          <button className="primary-button submit-button" onClick={() => setScreen("results")}>Cevapları gönder <span>✓</span></button>
        </section>
      )}

      {screen === "results" && (
        <section className="panel-screen results-screen screen-enter">
          <div className="result-burst">✦</div>
          <p className="result-kicker">TUR 1 TAMAMLANDI</p>
          <h1>AI hakem kararını verdi</h1>
          <div className="score-card glass-card">
            <div><span>Bu tur</span><strong>+{Object.values(answers).filter(Boolean).length * (selectedPower === "double" ? 20 : 10)}</strong></div>
            <div><span>Toplam puan</span><strong>{Object.values(answers).filter(Boolean).length * (selectedPower === "double" ? 20 : 10)}</strong></div>
          </div>
          <div className="rule-examples">
            <div><span className="score unique">10</span><p><b>Benzersiz doğru cevap</b><small>Başka kimsede yoksa</small></p></div>
            <div><span className="score same">5</span><p><b>Aynı doğru cevap</b><small>İki kişi “Zeynep” yazarsa</small></p></div>
            <div><span className="score wrong">0</span><p><b>Yanlış veya uydurma</b><small>Groq AI tarafından reddedilir</small></p></div>
          </div>
          <button className="primary-button" onClick={() => { setAnswers({}); setScreen("game"); }}>Sonraki tur <span>›</span></button>
          <button className="ghost-button" onClick={() => setScreen("home")}>Ana menü</button>
        </section>
      )}

      <footer>Firebase ile canlı • Groq ile akıllı</footer>
    </main>
  );
}
