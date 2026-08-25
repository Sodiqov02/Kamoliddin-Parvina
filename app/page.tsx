'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState('дорогой гость');
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('guest')?.trim();
    if (!value) return;
    const timer = window.setTimeout(() => setGuest(value.slice(0, 48)), 0);
    return () => window.clearTimeout(timer);
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
          <p className="eyebrow">С любовью приглашаем вас</p>
          <div className="monogram" aria-hidden="true">K <span>·</span> P</div>
          <h1>Свадебное<br />приглашение</h1>
          <p className="cover-date">KAMOLIDDIN · PARVINA</p>
          <button className="open-button" onClick={openInvitation} type="button">
            <span>Открыть приглашение</span>
            <span className="button-arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`story ${opened ? 'story--visible' : ''}`}
        aria-label="Свадебное приглашение Kamoliddin и Parvina"
        tabIndex={-1}
      >
        <article className="scene scene--names">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Две судьбы. Одна история.</p>
          <div className="names">
            <h2 className="reveal reveal--2">Kamoliddin</h2>
            <span className="ampersand reveal reveal--3">&amp;</span>
            <h2 className="reveal reveal--4">Parvina</h2>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true">
            <span>листайте вверх</span>
            <i>↑</i>
          </div>
        </article>

        <article className="scene scene--welcome">
          <div className="grain" />
          <div className="scene-card">
            <p className="scene-kicker reveal reveal--1">Это послание — для вас</p>
            <p className="guest-name reveal reveal--2">{guest},</p>
            <p className="welcome-copy reveal reveal--3">
              Совсем скоро состоится день, который станет началом нашей семейной истории.
              Нам особенно важно разделить его с близкими людьми.
            </p>
            <p className="welcome-signature reveal reveal--4">Будем счастливы видеть вас рядом 🤍</p>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>дальше</span><i>↑</i></div>
        </article>

        <article className="scene scene--families">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Hurmat bilan</p>
          <h2 className="families-title reveal reveal--2">Aziz<br />mehmonlar</h2>
          <div className="families-list">
            <div className="family-elder reveal reveal--3">
              <b>Axmedov Elmirza aka oilasi</b>
            </div>
            <div className="family-divider reveal reveal--4" aria-hidden="true">&amp;</div>
            <div className="family-elder reveal reveal--4">
              <b>Normurodov Alisher aka oilasi</b>
            </div>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>дата</span><i>↑</i></div>
        </article>

        <article className="scene scene--date">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Дата торжества</p>
          <div className="date-lockup date-lockup--pending">
            <span className="date-day reveal reveal--2">—</span>
            <div className="date-meta reveal reveal--3"><b>дата</b><span>будет указана</span></div>
          </div>
          <div className="calendar calendar--pending reveal reveal--4" aria-label="Дата будет указана позже">
            <span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span>
            {Array.from({ length: 14 }, (_, index) => <i aria-hidden="true" key={index} />)}
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>программа</span><i>↑</i></div>
        </article>

        <article className="scene scene--program">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">В этот особенный вечер</p>
          <h2 className="section-title reveal reveal--2">Программа</h2>
          <ol className="timeline timeline--confirmed">
            <li className="reveal reveal--3">
              <time>18:00</time>
              <span><b>Свадебное торжество</b><small>ждём вас в Ofarin toʻyxona</small></span>
            </li>
          </ol>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>место</span><i>↑</i></div>
        </article>

        <article className="scene scene--place">
          <div className="grain" />
          <div className="place-orbit" aria-hidden="true" />
          <p className="scene-kicker reveal reveal--1">Ждём вас здесь</p>
          <h2 className="place-name reveal reveal--2">Ofarin<br />toʻyxona</h2>
          <p className="place-copy reveal reveal--3">Начало торжества · 18:00</p>
          <a
            className="map-button reveal reveal--4"
            href="https://maps.app.goo.gl/TgTqMce928wAXUiv8"
            target="_blank"
            rel="noreferrer"
          >
            Открыть на карте <span>↗</span>
          </a>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>финал</span><i>↑</i></div>
        </article>

        <article className="scene scene--finale">
          <div className="grain" />
          <div className="final-rings reveal reveal--1" aria-hidden="true"><i /><i /></div>
          <p className="scene-kicker reveal reveal--2">До встречи на нашей свадьбе</p>
          <h2 className="final-title reveal reveal--3">Будем ждать<br />именно вас</h2>
          <p className="final-date reveal reveal--4">OFARIN TOʻYXONA · 18:00</p>
          <p className="final-names reveal reveal--5">Kamoliddin &amp; Parvina</p>
        </article>
      </section>
    </main>
  );
}
