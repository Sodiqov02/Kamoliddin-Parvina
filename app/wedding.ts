export const wedding = {
  groom: "Kamoliddin",
  bride: "Parvinaxon",
  date: { year: 2026, month: 11, day: 13, hour: 18, minute: 0 },
  timeZone: "Asia/Tashkent",
  // Tashkent is UTC+05:00 at the confirmed event date.
  utcOffsetMinutes: 300,
  weekday: "Juma",
  monthName: "noyabr",
  venue: "Shabnam toʻyxonasi",
  families: "Axmedovlar va Normurodovlar oilasi",
  // Add only a confirmed Shabnam location, never a search or the previous venue.
  mapUrl: null as string | null,
  // Add a local, licensed audio file to public/ before setting this path.
  musicSrc: null as string | null,
  portrait: "kamoliddin-parvinaxon-couple.webp",
} as const;

export const coupleNames = `${wedding.groom} & ${wedding.bride}`;
export const writtenDate = `${wedding.date.day} ${wedding.monthName} ${wedding.date.year}`;
export const numericDate = `${wedding.date.day}.${String(wedding.date.month).padStart(2, "0")}.${wedding.date.year}`;
export const startTime = `${wedding.date.hour}:${String(wedding.date.minute).padStart(2, "0")}`;
export const invitationTitle = `${coupleNames} — toʻy taklifnomasi`;
export const invitationDescription = `${writtenDate} · ${wedding.weekday} · ${startTime} · ${wedding.venue}`;
export const calendarTitle = `${coupleNames} — Toʻy marosimi`;
export const calendarDescription = `${wedding.families}. Sizni toʻyimizda kutib qolamiz!`;
// The web calendar composers require an end. This is a placeholder, not the schedule.
export const calendarEndNote = "Taqvim uchun 1 soatlik texnik vaqt qoʻyildi; toʻyning tugash vaqti tasdiqlanmagan. Eslatmani bir kun oldinga oʻzingiz sozlang.";

export function calendarLinks() {
  const { year, month, day, hour, minute } = wedding.date;
  const start = new Date(Date.UTC(year, month - 1, day, hour, minute) - wedding.utcOffsetMinutes * 60_000);
  const end = new Date(start.getTime() + 60 * 60_000);
  const googleDate = (value: Date) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const google = new URL("https://calendar.google.com/calendar/render");
  google.search = new URLSearchParams({ action: "TEMPLATE", text: calendarTitle, dates: `${googleDate(start)}/${googleDate(end)}`, ctz: wedding.timeZone, location: wedding.venue, details: `${calendarDescription}\n\n${calendarEndNote}` }).toString();
  const outlook = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  outlook.search = new URLSearchParams({ path: "/calendar/action/compose", rru: "addevent", subject: calendarTitle, startdt: start.toISOString().replace(".000", ""), enddt: end.toISOString().replace(".000", ""), location: wedding.venue, body: `${calendarDescription}\n\n${calendarEndNote}` }).toString();
  return { google: google.href, outlook: outlook.href };
}

export function normalizeGuest(value: string | null): string {
  return (
    Array.from(
      (value ?? "")
        .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, "")
        .trim(),
    )
      .slice(0, 80)
      .join("") || "Aziz mehmonimiz"
  );
}

export function monthCells(
  year = wedding.date.year,
  month = wedding.date.month,
) {
  const mondayOffset =
    (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const count = Math.ceil((mondayOffset + days) / 7) * 7;
  return Array.from({ length: count }, (_, index) => {
    const day = index - mondayOffset + 1;
    return day > 0 && day <= days ? day : null;
  });
}

export function createCalendarEvent(now = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const { year, month, day, hour, minute } = wedding.date;
  const localStart = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const escape = (value: string) =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Golden Romance//Wedding Invitation//UZ",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${wedding.timeZone}`,
    `X-LIC-LOCATION:${wedding.timeZone}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0500",
    "TZOFFSETTO:+0500",
    "TZNAME:+05",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:kamoliddin-parvinaxon-20261113@golden-romance.local",
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${wedding.timeZone}:${localStart}`,
    `SUMMARY:${escape(calendarTitle)}`,
    `LOCATION:${escape(wedding.venue)}`,
    `DESCRIPTION:${escape(calendarDescription)}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P1D",
    `DESCRIPTION:${escape(calendarTitle)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545: fold at 75 octets, never split a UTF-8 character.
  return (
    lines
      .map((line) => {
        const chunks: string[] = [];
        let chunk = "";
        let length = 0;
        for (const char of line) {
          const bytes = new TextEncoder().encode(char).length;
          if (length + bytes > 75) {
            chunks.push(chunk);
            chunk = " ";
            length = 1;
          }
          chunk += char;
          length += bytes;
        }
        chunks.push(chunk);
        return chunks.join("\r\n");
      })
      .join("\r\n") + "\r\n"
  );
}
