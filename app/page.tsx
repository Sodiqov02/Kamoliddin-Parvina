'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState('дорогой гость');
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
          <p className="eyebrow">С любовью приглашаем вас</p>
          <div className="monogram" aria-hidden="true">K <span>·</span> P</div>
          <h1>Свадебное<br />приглашение</h1>
          <p className="cover-date">12 · 09 · 2026</p>
          <button className="open-button" onClick={openInvitation} type="button">
            <span>Открыть приглашение</span>
            <span className="button-arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`story ${opened ? 'story--visible' : ''}`}
        aria-label="Свадебное приглашение"
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
              совсем скоро состоится день, который станет началом нашей семейной истории.
              Нам особенно важно разделить его с близкими людьми.
            </p>
            <p className="welcome-signature reveal reveal--4">Будем счастливы видеть вас рядом 🤍</p>
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>дальше</span><i>↑</i></div>
        </article>

        <article className="scene scene--date">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">Сохраните эту дату</p>
          <div className="date-lockup">
            <span className="date-day reveal reveal--2">12</span>
            <div className="date-meta reveal reveal--3"><b>сентября</b><span>суббота · 2026</span></div>
          </div>
          <div className="calendar reveal reveal--4" aria-label="12 сентября 2026 года">
            <span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span>
            {[31,1,2,3,4,5,6,7,8,9,10,11,12,13].map((day, index) => (
              <i className={day === 12 ? 'chosen' : index === 0 ? 'muted' : ''} key={`${day}-${index}`}>{day}</i>
            ))}
          </div>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>программа</span><i>↑</i></div>
        </article>

        <article className="scene scene--program">
          <div className="grain" />
          <p className="scene-kicker reveal reveal--1">В этот особенный вечер</p>
          <h2 className="section-title reveal reveal--2">Программа</h2>
          <ol className="timeline">
            <li className="reveal reveal--2"><time>17:00</time><span><b>Сбор гостей</b><small>встречаемся и обнимаемся</small></span></li>
            <li className="reveal reveal--3"><time>18:00</time><span><b>Торжественная церемония</b><small>самое важное «да»</small></span></li>
            <li className="reveal reveal--4"><time>19:00</time><span><b>Праздничный вечер</b><small>ужин, музыка и танцы</small></span></li>
          </ol>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>место</span><i>↑</i></div>
        </article>

        <article className="scene scene--place">
          <div className="grain" />
          <div className="place-orbit" aria-hidden="true" />
          <p className="scene-kicker reveal reveal--1">Ждём вас здесь</p>
          <h2 className="place-name reveal reveal--2">Ofarin<br />toʻyxona</h2>
          <p className="place-copy reveal reveal--3">18:00<br />и точный адрес добавим сюда</p>
          <button className="map-button reveal reveal--4" type="button" onClick={() => window.open('https://maps.app.goo.gl/TgTqMce928wAXUiv8', '_blank', 'noopener,noreferrer')}>Открыть на карте <span>↗</span></button>
          <p className="placeholder-note reveal reveal--4">Hurmat bilan<br />Axmedov Elmirza aka oilasi<br />Normurodov Alisher aka oilasi</p>
          <div className="swipe-hint reveal reveal--5" aria-hidden="true"><span>финал</span><i>↑</i></div>
        </article>

        <article className="scene scene--finale">
          <div className="grain" />
          <div className="final-rings reveal reveal--1" aria-hidden="true"><i /><i /></div>
          <p className="scene-kicker reveal reveal--2">До встречи на нашей свадьбе</p>
          <h2 className="final-title reveal reveal--3">Будем ждать<br />именно вас</h2>
          <p className="final-date reveal reveal--4">12 · 09 · 2026</p>
          <p className="final-names reveal reveal--5">Kamoliddin &amp; Parvina</p>
        </article>
      </section>
    </main>
  );
}
