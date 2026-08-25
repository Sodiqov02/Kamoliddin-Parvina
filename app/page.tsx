'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState('Aziz mehmonimiz');
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('guest')?.trim();
    if (value) setGuest(value.slice(0, 48));
  }, []);

  useEffect(() => {
    document.body.classList.toggle('invitation-open', opened);
    return () => document.body.classList.remove('invitation-open');
  }, [opened]);

  useEffect(() => {
    if (!opened || !storyRef.current) return;
    const scenes = Array.from(storyRef.current.querySelectorAll<HTMLElement>('.scene'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('scene--active', entry.isIntersecting)),
      { root: storyRef.current, threshold: 0.55 },
    );
    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [opened]);

  function openInvitation() {
    setOpened(true);
    window.setTimeout(() => storyRef.current?.focus(), 650);
  }

  return (
    <main className="invitation-shell">
      <section className={`cover ${opened ? 'cover--opened' : ''}`} aria-hidden={opened}>
        <div className="grain" />
        <div className="cover-ornament cover-ornament--top" />
        <div className="cover-ornament cover-ornament--bottom" />
        <div className="cover-content">
          <p className="eyebrow">Sizni mehr bilan taklif qilamiz</p>
          <div className="monogram" aria-hidden="true">K <span>·</span> P</div>
          <h1>Toʻy<br />taklifnomasi</h1>
          <p className="cover-date">26 · 09 · 2026</p>
          <button className="open-button" onClick={openInvitation} type="button">
            <span>Taklifnomani ochish</span>
            <span className="button-arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`story ${opened ? 'story--visible' : ''}`}
        aria-label="Toʻy taklifnomasi"
        tabIndex={-1}
      >
        <article className="scene scene--names">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Ikki taqdir. Bir hikoya.</p>
          <div className="names">
            <h2 className="reveal reveal--2">Kamoliddin</h2>
            <span className="ampersand reveal reveal--3">&amp;</span>
            <h2 className="reveal reveal--4">Parvina</h2>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true">
            <span>yuqoriga suring</span>
            <i>↑</i>
          </div>
        </article>

        <article className="scene scene--welcome">
          <div className="grain" />
          <div className="scene-card">
            <p className="scene-kicker reveal reveal--1">Bu taklif siz uchun</p>
            <p className="guest-name reveal reveal--2">{guest}!</p>
            <p className="welcome-copy reveal reveal--3">
              Hayotimizdagi eng quvonchli kunlardan birini siz bilan birga nishonlashni istaymiz.
            </p>
            <p className="welcome-signature reveal reveal--4">Sizni toʻyimizga taklif qilamiz.</p>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>davomi</span><i>↑</i></div>
        </article>

        <article className="scene scene--date">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Toʻy kuni</p>
          <div className="date-lockup">
            <span className="date-day reveal reveal--2">26</span>
            <div className="date-meta reveal reveal--3"><b>sentabr</b><span>shanba · 2026</span></div>
          </div>
          <div className="calendar reveal reveal--4" aria-label="26-sentabr 2026">
            <span>DU</span><span>SE</span><span>CH</span><span>PA</span><span>JU</span><span>SH</span><span>YA</span>
            {[21,22,23,24,25,26,27,28,29,30,1,2,3,4].map((day, index) => (
              <i className={day === 26 ? 'chosen' : index > 9 ? 'muted' : ''} key={`${day}-${index}`}>{day}</i>
            ))}
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>dastur</span><i>↑</i></div>
        </article>

        <article className="scene scene--program">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Ushbu unutilmas oqshomda</p>
          <h2 className="section-title reveal reveal--2">Dastur</h2>
          <ol className="timeline">
            <li className="reveal reveal--2"><time>17:00</time><span><b>Mehmonlarni kutib olish</b><small>uchrashamiz va quchoqlashamiz</small></span></li>
            <li className="reveal reveal--3"><time>18:00</time><span><b>Tantanali marosim</b><small>eng muhim «ha»</small></span></li>
            <li className="reveal reveal--4"><time>19:00</time><span><b>Bayram oqshomi</b><small>kechki ovqat, musiqa va raqslar</small></span></li>
          </ol>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>manzil</span><i>↑</i></div>
        </article>

        <article className="scene scene--place">
          <div className="grain" />
          <div className="place-orbit" aria-hidden="true" />
          <p className="scene-kicker reveal reveal--1">Toʻy manzili</p>
          <h2 className="place-name reveal reveal--2">Ofarin<br />toʻyxona</h2>
          <p className="place-copy reveal reveal--3">Boshlanish vaqti<br />18:00</p>
          <button className="map-button reveal reveal--4" type="button" onClick={() => window.open('https://maps.app.goo.gl/TgTqMce928wAXUiv8', '_blank', 'noopener,noreferrer')}>Xaritada ochish <span>↗</span></button>
          <p className="placeholder-note reveal reveal--4">Hurmat bilan<br />Axmedov Elmirza aka oilasi<br />Normurodov Alisher aka oilasi</p>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>yakun</span><i>↑</i></div>
        </article>

        <article className="scene scene--finale">
          <div className="grain" />
          <div className="final-rings reveal reveal--1" aria-hidden="true"><i /><i /></div>
          <p className="scene-kicker reveal reveal--2">Toʻyimizda uchrashguncha</p>
          <h2 className="final-title reveal reveal--3">Sizni toʻyimizda<br />kutib qolamiz 🤍</h2>
          <p className="final-date reveal reveal--4">26 · 09 · 2026</p>
          <p className="final-names reveal reveal--5">Kamoliddin &amp; Parvina</p>
        </article>
      </section>
    </main>
  );
}
