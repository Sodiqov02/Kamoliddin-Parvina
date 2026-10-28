'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState('Aziz mehmonimiz');
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('guest')?.trim();
    // This state intentionally synchronizes client-only URL data after static hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setGuest(value.slice(0, 48));
  }, []);

  useEffect(() => {
    if ((window as Window & { __invitationOpenedEarly?: boolean }).__invitationOpenedEarly) {
      // Preserve an opening that happened before React hydration completed.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpened(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('invitation-open', opened);
    if (opened) document.body.classList.remove('invitation-opening');
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
          <p className="cover-date">13 · 11 · 2026</p>
          <button className="open-button" data-open-invitation onClick={openInvitation} type="button">
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
            <h2 className="reveal reveal--4">Parvinaxon</h2>
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
            <span className="date-day reveal reveal--2">13</span>
            <div className="date-meta reveal reveal--3"><b>noyabr</b><span>juma · 2026</span></div>
          </div>
          <div className="calendar reveal reveal--4" aria-label="2026-yil 13-noyabr, juma">
            <span>DU</span><span>SE</span><span>CH</span><span>PA</span><span>JU</span><span>SH</span><span>YA</span>
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 5;
              const valid = day >= 1 && day <= 30;
              return <i className={day === 13 ? 'chosen' : !valid ? 'muted' : ''} key={index}>{valid ? day : ''}</i>;
            })}
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>dastur</span><i>↑</i></div>
        </article>

        <article className="scene scene--program">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Unutilmas oqshom</p>
          <h2 className="section-title reveal reveal--2">Sizni kutamiz</h2>
          <p className="program-intro reveal reveal--3">Aziz farzandlarimiz Kamoliddin va Parvinaxonning nikoh toʻylari munosabati bilan tashkil etilayotgan shodiyona kunimizga lutfan taklif etamiz.</p>
          <p className="program-time reveal reveal--4">13 noyabr · 18:00</p>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>manzil</span><i>↑</i></div>
        </article>

        <article className="scene scene--place">
          <div className="grain" />
          <div className="place-orbit" aria-hidden="true" />
          <p className="scene-kicker reveal reveal--1">Toʻy manzili</p>
          <h2 className="place-name reveal reveal--2">Shabnam<br />toʻyxonasi</h2>
          <p className="place-copy reveal reveal--3">Boshlanish vaqti<br />18:00</p>
          <p className="place-help reveal reveal--4">Manzil: Shabnam toʻyxonasi</p>
          <p className="placeholder-note reveal reveal--4">Hurmat bilan<br />Axmedovlar va Normurodovlar oilasi</p>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>yakun</span><i>↑</i></div>
        </article>

        <article className="scene scene--finale">
          <div className="grain" />
          <div className="final-rings reveal reveal--1" aria-hidden="true"><i /><i /></div>
          <p className="scene-kicker reveal reveal--2">Toʻyimizda uchrashguncha</p>
          <h2 className="final-title reveal reveal--3">Sizni toʻyimizda<br />kutib qolamiz 🤍</h2>
          <p className="final-date reveal reveal--4">13 · 11 · 2026</p>
          <p className="final-names reveal reveal--5">Kamoliddin &amp; Parvinaxon</p>
        </article>
      </section>
    </main>
  );
}
