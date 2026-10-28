"use client";

import { useEffect, useRef, useState } from "react";
import {
  coupleNames,
  calendarLinks,
  monthCells,
  normalizeGuest,
  numericDate,
  startTime,
  wedding,
  writtenDate,
} from "./wedding";

function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`botanical ${className}`}
      viewBox="0 0 160 260"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 250C85 190 61 116 119 20M66 198C32 198 16 175 22 153C49 153 65 171 66 198ZM74 167C109 167 127 148 124 124C94 127 80 145 74 167ZM79 128C49 121 39 99 47 79C72 86 83 104 79 128ZM95 88C125 89 143 70 139 49C113 54 101 68 95 88ZM112 42C91 28 94 9 104 3C120 16 122 29 112 42Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M65 198L35 166M74 167L113 136M79 128L56 91M95 88L129 60M112 42L105 13"
        stroke="currentColor"
        strokeWidth=".7"
      />
    </svg>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={down ? "arrow-down" : ""}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function MusicControl({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  async function toggle() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else {
      try {
        await audio.current.play();
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <div className="music-control">
      <audio
        ref={audio}
        src={src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        disabled={failed}
      >
        {failed
          ? "Musiqa mavjud emas"
          : playing
            ? "Musiqani toʻxtatish"
            : "Musiqani yoqish"}
      </button>
    </div>
  );
}

export default function Invitation() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [guest, setGuest] = useState("Aziz mehmonimiz");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarMenu = useRef<HTMLDivElement>(null);
  const calendarTrigger = useRef<HTMLButtonElement>(null);
  const lastCalendarTrigger = useRef<HTMLButtonElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const names = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () =>
      setGuest(
        normalizeGuest(
          new URLSearchParams(window.location.search).get("guest"),
        ),
      );
    update();
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("popstate", update);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (
      phase !== "open" ||
      !story.current ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    story.current
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (!calendarOpen) return;
    calendarMenu.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setCalendarOpen(false);
        lastCalendarTrigger.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!calendarMenu.current?.contains(target) && !calendarTrigger.current?.contains(target) && !lastCalendarTrigger.current?.contains(target)) setCalendarOpen(false);
    }
    function onFocusIn(event: FocusEvent) {
      const target = event.target as Node;
      if (!calendarMenu.current?.contains(target) && !calendarTrigger.current?.contains(target) && !lastCalendarTrigger.current?.contains(target)) setCalendarOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [calendarOpen]);

  function openInvitation() {
    if (phase !== "closed") return;
    setPhase("opening");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const device = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const constrained =
      device.connection?.saveData || (device.deviceMemory ?? 8) <= 2;
    timer.current = setTimeout(
      () => {
        setPhase("open");
        requestAnimationFrame(() => {
          story.current?.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
          names.current?.focus({ preventScroll: true });
        });
      },
      reduced || constrained ? 120 : 1300,
    );
  }

  function toggleCalendar(event: React.MouseEvent<HTMLButtonElement>) {
    lastCalendarTrigger.current = event.currentTarget;
    setCalendarOpen((open) => !open);
  }

  const links = calendarLinks();

  return (
    <main className={`invitation phase-${phase}`}>
      <a className="skip-link" href="#names">
        Taklifnomaga oʻtish
      </a>
      <section
        className="cover"
        aria-labelledby="cover-title"
        hidden={phase === "open"}
      >
        <header className="cover-header">
          <span>Mehr bilan, siz uchun</span>
          <span>{numericDate}</span>
        </header>
        <div className="cover-body">
          <div className="cover-heading">
            <h1 id="cover-title">Toʻy taklifnomasi</h1>
            <p>{coupleNames}</p>
          </div>
          <div className="envelope-stage" aria-hidden="true">
            <Botanical className="envelope-sprig" />
            <div className="envelope">
              <div className="envelope-lining" />
              <div className="letter">
                <span>Ikki qalb. Bir taqdir.</span>
                <strong>
                  {wedding.groom}
                  <br />
                  &amp; {wedding.bride}
                </strong>
                <span>{writtenDate}</span>
              </div>
              <div className="envelope-fold envelope-fold-left" />
              <div className="envelope-fold envelope-fold-right" />
              <div className="envelope-fold envelope-fold-bottom" />
              <div className="envelope-flap" />
              <div className="wax-seal">
                <span>
                  K <i>&amp;</i> P
                </span>
              </div>
            </div>
          </div>
          <button
            className="button open-button"
            type="button"
            onClick={openInvitation}
            aria-busy={phase === "opening"}
            aria-controls="story"
          >
            <span>Taklifnomani ochish</span>
            <Arrow />
          </button>
          <p className="cover-details">
            {writtenDate} · {startTime}
            <br />
            {wedding.venue}
          </p>
        </div>
        <footer className="cover-footer">
          <span>{wedding.families}</span>
          <span>Ikki qalb. Bir taqdir.</span>
        </footer>
      </section>

      <div
        id="story"
        ref={story}
        className="story"
        data-open={phase === "open"}
      >
        <nav className="navigation" aria-label="Taklifnoma boʻlimlari">
          <a
            className="wordmark"
            href="#names"
            aria-label={`K & P — ${coupleNames}`}
          >
            K <span>&amp;</span> P
          </a>
          <div>
            <a href="#invitation">Taklifnoma</a>
            <a href="#date">Sana</a>
            <a href="#location">Manzil</a>
          </div>
        </nav>

        <section className="names-scene page-width" aria-labelledby="names">
          <div className="names-meta">
            <p>Nikoh toʻyimizga taklif qilamiz</p>
            <p>
              {writtenDate} · {wedding.weekday}
            </p>
          </div>
          <h2 id="names" ref={names} tabIndex={-1} className="names-title">
            <span>{wedding.groom}</span>
            <span className="second-name">
              <i aria-hidden="true">&amp;</i>
              <span className="sr-only">va </span>
              {wedding.bride}
            </span>
          </h2>
          <div className="names-bottom">
            <p>
              Ikki qalb.
              <br />
              Bir taqdir.
            </p>
            <Botanical />
            <a href="#moment">
              Bizning lahzamiz <Arrow down />
            </a>
          </div>
        </section>

        <section
          id="moment"
          className="moment-scene page-width"
          aria-labelledby="moment-title"
        >
          <div className="moment-side">
            <h2 id="moment-title" data-reveal>
              Bir muhabbat.
              <br />
              Bir umr.
            </h2>
            <p data-reveal>Hayotimizning yangi sahifasi.</p>
            <span className="portrait-date" data-reveal>
              {numericDate}
            </span>
          </div>
          <figure data-reveal>
            <div className="portrait-frame">
              {/* The supplied privacy treatment is preserved byte for byte. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wedding.portrait}
                width="1100"
                height="1021"
                alt="Kamoliddin va Parvinaxon birga, yuzlarida yumshoq yurak shaklidagi xiralik"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 700px) calc(100vw - 40px), 65vw"
              />
            </div>
            <figcaption>
              {coupleNames}
              <span>Ikki qalb. Bir taqdir.</span>
            </figcaption>
          </figure>
        </section>

        <section
          id="invitation"
          className="personal-scene"
          aria-labelledby="invitation-title"
        >
          <div className="personal-inner page-width">
            <div className="personal-mark" aria-hidden="true">
              <Botanical />
              <span>
                K <i>&amp;</i> P
              </span>
            </div>
            <div className="personal-copy">
              <h2 id="invitation-title" data-reveal>
                Sizga taklif
              </h2>
              <p className="guest-name" data-reveal>
                {guest}!
              </p>
              <p data-reveal>
                Hayotimizdagi eng quvonchli kunimizni siz bilan birga
                nishonlashni istaymiz. Sizni nikoh toʻyimizga taklif qilamiz.
              </p>
              <p data-reveal>
                Sizning tashrifingiz va ezgu tilaklaringiz biz uchun qadrlidir.
              </p>
              <p className="family-signature" data-reveal>
                Hurmat bilan,
                <br />
                {wedding.families}
              </p>
            </div>
          </div>
        </section>

        <section
          id="date"
          className="date-scene page-width"
          aria-labelledby="date-title"
        >
          <div className="date-copy">
            <h2 id="date-title" data-reveal>
              Unutilmas sana
            </h2>
            <p className="date-display" data-reveal>
              <span>{wedding.date.day}</span>
              {wedding.monthName}
              <br />
              {wedding.date.year}
            </p>
            <p data-reveal>
              {wedding.weekday} · Boshlanishi {startTime}
            </p>
            <button
              ref={calendarTrigger}
              type="button"
              className="button"
              onClick={toggleCalendar}
              aria-expanded={calendarOpen}
              aria-controls="calendar-options"
              data-reveal
            >
              Taqvimga qoʻshish <Arrow />
            </button>
            <div id="calendar-options" className="calendar-options" ref={calendarMenu} role="group" aria-label="Taqvimni tanlang" hidden={!calendarOpen}>
              <p className="calendar-options-title">Taqvimni tanlang</p>
              <a href={links.google} target="_blank" rel="noopener noreferrer">Google Calendar <Arrow /></a>
              <a href="kamoliddin-parvinaxon.ics" download="kamoliddin-parvinaxon.ics">Apple Calendar <span>.ics</span> <Arrow /></a>
              <a href={links.outlook} target="_blank" rel="noopener noreferrer">Outlook Calendar <Arrow /></a>
              <p className="calendar-options-note">Google va Outlook’da yakun uchun 1 soat texnik vaqt qoʻyiladi; toʻyning tugash vaqti tasdiqlanmagan.</p>
              <p className="calendar-options-note">Apple faylida eslatma bir kun oldin. Google va Outlook’da eslatmani oʻzingiz sozlang. Havola ochilmasa, .ics faylini yuklang.</p>
            </div>
          </div>
          <div className="calendar-wrap" data-reveal>
            <h3>
              {wedding.monthName} {wedding.date.year}
            </h3>
            <table
              className="calendar"
              aria-label={`${writtenDate}, ${wedding.weekday}`}
            >
              <thead>
                <tr>
                  {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: monthCells().length / 7 }, (_, row) => (
                  <tr key={row}>
                    {monthCells()
                      .slice(row * 7, row * 7 + 7)
                      .map((day, column) => (
                        <td
                          key={column}
                          className={
                            day === wedding.date.day ? "selected-day" : ""
                          }
                        >
                          {day === wedding.date.day ? (
                            <button
                              type="button"
                              onClick={toggleCalendar}
                              aria-expanded={calendarOpen}
                              aria-controls="calendar-options"
                              aria-label={`${writtenDate} — taqvimga qoʻshish`}
                            >
                              {day}
                              <svg
                                viewBox="0 0 60 60"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M30 52C21 44 4 32 7 19C10 7 24 9 30 17C37 7 51 9 54 20C57 32 40 46 30 52Z"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                              </svg>
                            </button>
                          ) : (
                            day
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="calendar-caption">
              Bir kun. Bir umrga tatigulik xotira.
            </p>
          </div>
        </section>

        <section
          className="celebration-scene"
          aria-labelledby="celebration-title"
        >
          <div className="page-width celebration-inner">
            <h2 id="celebration-title" data-reveal>
              Baxtimizga
              <br />
              sherik boʻling.
            </h2>
            <div>
              <p data-reveal>
                Yaqinlarimiz davrasida, mehr va ezgu tilaklar bilan yangi
                hayotimizni boshlaymiz.
              </p>
              <p data-reveal>
                Ushbu quvonchli oqshomni siz bilan baham koʻrishdan baxtiyormiz.
              </p>
            </div>
          </div>
        </section>

        <section
          id="location"
          className="location-scene page-width"
          aria-labelledby="location-title"
        >
          <div>
            <h2 id="location-title" data-reveal>
              Oqshom manzili
            </h2>
            <p className="venue-name" data-reveal>
              {wedding.venue}
            </p>
          </div>
          <div className="location-details">
            <p data-reveal>
              {writtenDate}
              <br />
              {wedding.weekday} · {startTime}
            </p>
            {wedding.mapUrl ? (
              <a
                className="button"
                href={wedding.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xaritada ochish <Arrow />
              </a>
            ) : (
              <p className="location-note" data-reveal>
                Aniq manzilni taklif qilgan oilalardan bilib olishingiz mumkin.
              </p>
            )}
          </div>
        </section>

        <footer className="finale" aria-labelledby="finale-title">
          <div className="page-width">
            <Botanical />
            <h2 id="finale-title" data-reveal>
              Sizni toʻyimizda
              <br />
              kutib qolamiz!
            </h2>
            <p className="finale-names" data-reveal>
              {wedding.groom}
              <span>&amp;</span>
              <br className="mobile-break" />
              {wedding.bride}
            </p>
            <div className="finale-bottom">
              <p>
                {numericDate} · {startTime}
              </p>
              <a href="#names">
                Boshiga qaytish <Arrow />
              </a>
            </div>
          </div>
        </footer>
        {wedding.musicSrc && <MusicControl src={wedding.musicSrc} />}
      </div>
    </main>
  );
}
