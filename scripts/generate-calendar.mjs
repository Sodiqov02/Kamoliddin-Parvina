import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createCalendarEvent } from '../app/wedding.ts';

const path = 'public/kamoliddin-parvinaxon.ics';
const contents = createCalendarEvent();
const withoutStamp = (value) => value.replace(/DTSTAMP:[^\r\n]+/, 'DTSTAMP:STAMP');
if (!existsSync(path) || withoutStamp(readFileSync(path, 'utf8')) !== withoutStamp(contents)) {
  writeFileSync(path, contents, 'utf8');
}
console.log('CALENDAR_ASSET_OK');
