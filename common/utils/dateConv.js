export const dateToDate = dtz => {
  dtz = dtz ?? {d: new Date(), tz: new Date().getTimezoneOffset()};
  return `${String(dtz.d.getFullYear())}-${String(dtz.d.getMonth() + 1).padStart(2, '0')}-${String(dtz.d.getDate()).padStart(2, '0')}${dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "+" : "-") + String(Math.floor(Math.abs(dtz.tz) / 60)).padStart(2, '0') + ":" + String(Math.abs(dtz.tz) % 60).padStart(2, '0') : ""}`;
};

export const dateToDateTime = dtz => {
  dtz = dtz ?? {d: new Date(), tz: new Date().getTimezoneOffset()};
  return `${String(dtz.d.getFullYear())}-${String(dtz.d.getMonth() + 1).padStart(2, '0')}-${String(dtz.d.getDate()).padStart(2, '0')}T${String(dtz.d.getHours()).padStart(2, '0')}:${String(dtz.d.getMinutes()).padStart(2, '0')}:${String(dtz.d.getSeconds()).padStart(2, '0')}${dtz.d.getMilliseconds() !== 0 ? '.' + (dtz.d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) : ""}${dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "+" : "-") + String(Math.floor(Math.abs(dtz.tz) / 60)).padStart(2, '0') + ":" + String(Math.abs(dtz.tz) % 60).padStart(2, '0') : ""}`;
};

export const dateToTime = dtz => {
  dtz = dtz ?? {d: new Date(), tz: new Date().getTimezoneOffset()};
  return `${String(dtz.d.getHours()).padStart(2, '0')}:${String(dtz.d.getMinutes()).padStart(2, '0')}:${String(dtz.d.getSeconds()).padStart(2, '0')}${dtz.d.getMilliseconds() !== 0 ? '.' + (dtz.d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) : ""}${dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "+" : "-") + String(Math.floor(Math.abs(dtz.tz) / 60)).padStart(2, '0') + ":" + String(Math.abs(dtz.tz) % 60).padStart(2, '0') : ""}`;
};

export const toDate = s => {
  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7)) - 1;
  const day = Number(s.slice(8, 10));
  const d = new Date(year, month, day);
  if (d.getMonth() !== month) {
    throw new dOMException(VALIDATION_ERR);
  }
  const tzMatch = s.match(/(?<sign>[+-])(?<hours>\d{2}):(?<minutes>\d{2})$/);
  const { sign, hours, minutes } = tzMatch?.groups ?? {};
  const tz = s.endsWith("Z")
    ? 0
    : tzMatch
    ? (sign === '-' ? 1 : -1) * (Number(hours) * 60 + Number(minutes))
    : null;
  return { d, tz };
};

export const toDateTime = s => {
  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(5, 7)) - 1;
  const day = Number(s.slice(8, 10));
  const hours = Number(s.slice(11, 13));
  const minutes = Number(s.slice(14, 16));
  const seconds = Number(s.slice(17, 19));
  const milliseconds = s.charAt(19) === '.' 
    ? Number(`0.${s.slice(20).replace(/[+\-Z].*/, '')}`) * 1000 
    : 0;
  const d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
  if (d.getMonth() !== month) {
    throw new domException(VALIDATION_ERR);
  }
  const tzMatch = s.match(/(?<sign>[+-])(?<hours>\d{2}):(?<minutes>\d{2})$/);
  const { sign, hours: tzHours, minutes: tzMinutes } = tzMatch?.groups ?? {};
  const tz = s.endsWith("Z")
    ? 0
    : tzMatch
    ? (sign === '+' ? 1 : -1) * (Number(tzHours) * 60 + Number(tzMinutes))
    : null;
  return { d, tz };
};

export const toTime = s => {
  const d = new Date();
  const tpos = s.indexOf("T") + 1;
  d.setHours(Number(s.slice(tpos, tpos + 2)));
  d.setMinutes(Number(s.slice(tpos + 3, tpos + 5)));
  d.setSeconds(Number(s.slice(tpos + 6, tpos + 8)));
  d.setMilliseconds(
    s.charAt(tpos + 8) === "."
      ? Number(`0.${s.slice(tpos + 9).replace(/[+\-Z].*/, '')}`) * 1000
      : 0
  );
  const tzMatch = s.match(/(?<sign>[+-])(?<hours>\d{2}):(?<minutes>\d{2})$/);
  const { sign, hours, minutes } = tzMatch?.groups ?? {};
  const tz = s.endsWith("Z")
    ? 0
    : tzMatch
    ? (sign === '-' ? 1 : -1) * (Number(hours) * 60 + Number(minutes))
    : null;
  return { d, tz };
};

export const toJSONDate = s => ({
  year: Number(s.slice(0, 4)),
  month: Number(s.slice(5, 7)),
  day: Number(s.slice(8, 10)),
});

export const toJSONDateTime = s => ({
  year: Number(s.slice(0, 4)),
  month: Number(s.slice(5, 7)),
  day: Number(s.slice(8, 10)),
  hour: Number(s.slice(11, 13)),
  minute: Number(s.slice(14, 16)),
  second: Number(s.slice(17).replace(/[+\-Z].*/, ''))
});

export const toJSONTime = s => ({
  hour: Number(s.slice(0, 2)),
  minute: Number(s.slice(3, 5)),
  second: Number(s.slice(5).replace(/[\+\-Z].*/, ''))
});

export const toJSONYearMonthDuration = s => {
  const match = s.match(/^-?P(?:(?<years>\d+)Y)?(?:(?<months>\d+)M)?$/);
  const { years = 0, months = 0 } = match?.groups ?? {};
  const totalMonths = Number(years) * 12 + Number(months);
  return {
    sign: s.startsWith("-") && totalMonths !== 0 ? -1 : 1,
    year: Math.floor(totalMonths / 12),
    month: totalMonths % 12,
  };
};

export const toJSONDayTimeDuration = s => {
  const match = s.match(/^-?P(?:(?<days>\d+)D)?(?:T(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+(\.\d+)?)S)?)?$/);
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = match?.groups ?? {};
  const totalSeconds = ((Number(days) * 24 + Number(hours)) * 60 + Number(minutes)) * 60 + Number(seconds);
  return {
    sign: s.startsWith("-") && totalSeconds !== 0 ? -1 : 1,
    day: Math.floor(totalSeconds / 86400),
    hour: Math.floor((totalSeconds % 86400) / 3600),
    minute: Math.floor((totalSeconds % 3600) / 60),
    second: totalSeconds % 60,
  };
};

export const toJSONDuration = s => {
  const match = s.match(/^(-)?P(?!$)(?:(?<years>\d+)Y)?(?:(?<months>\d+)M)?(?:(?<days>\d+)D)?(?:T(?!$)(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+(?:\.\d+)?)S)?)?$/);
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = match?.groups ?? {};
  const totalMonths = Number(years) * 12 + Number(months);
  const totalSeconds = ((Number(days) * 24 + Number(hours)) * 60 + Number(minutes)) * 60 + Number(seconds);
  return {
    sign: s.startsWith("-") && (totalMonths !== 0 || totalSeconds !== 0) ? -1 : 1,
    year: Math.floor(totalMonths / 12),
    month: totalMonths % 12,
    day: Math.floor(totalSeconds / 86400),
    hour: Math.floor((totalSeconds % 86400) / 3600),
    minute: Math.floor((totalSeconds % 3600) / 60),
    second: totalSeconds % 60,
  };
};