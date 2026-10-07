/**
 * No One's Coming! — pitch page logger
 *
 * Paste this whole file into a Google Sheet's Apps Script editor
 * (Extensions → Apps Script), run setup() once, then deploy as a web app.
 * Full steps are in tracking/SETUP.md.
 */

const LOG_SHEET = 'Log';
const SUMMARY_SHEET = 'Summary';

/** Receives events from the pitch page. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sheet = logSheet_();
    sheet.appendRow([
      new Date(),
      clean_(d.recipient) || '(no name in link)',
      clean_(d.event),
      clean_(d.detail),
      clean_(d.visit),
      device_(String(d.ua || '')),
      clean_(d.screen),
      clean_(d.referrer),
      clean_(d.ua),
    ]);
  } catch (err) {
    // Ignore malformed requests rather than failing loudly.
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

/** Visiting the web app URL in a browser just confirms it's live. */
function doGet() {
  return ContentService.createTextOutput('Logger is running.');
}

/** Run once from the editor. Creates the Log and Summary tabs. */
function setup() {
  logSheet_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SUMMARY_SHEET);
  if (!s) s = ss.insertSheet(SUMMARY_SHEET, 0);
  s.clear();
  s.getRange('A1:G1').setValues([[
    'Recipient', 'First opened', 'Video', 'Downloaded script', 'Times downloaded', 'Furthest page read', 'Last activity',
  ]]).setFontWeight('bold');
  s.setFrozenRows(1);

  // One row per recipient, filled automatically as the Log grows.
  s.getRange('A2').setFormula('=IFERROR(SORT(UNIQUE(FILTER(Log!B2:B, Log!B2:B<>""))), )');
  s.getRange('B2').setFormula('=MAP(A2:A, LAMBDA(r, IF(r="", "", MINIFS(Log!A:A, Log!B:B, r))))');
  s.getRange('C2').setFormula(
    '=MAP(A2:A, LAMBDA(r, IF(r="", "", ' +
    'IF(COUNTIFS(Log!B:B, r, Log!C:C, "Finished video")>0, "Watched to the end", ' +
    'IF(COUNTIFS(Log!B:B, r, Log!C:C, "Skipped video")>0, "Skipped", ' +
    'IF(COUNTIFS(Log!B:B, r, Log!C:C, "Started video")>0, "Started, didn\'t finish", "Not played"))))))'
  );
  s.getRange('D2').setFormula('=MAP(A2:A, LAMBDA(r, IF(r="", "", IF(COUNTIFS(Log!B:B, r, Log!C:C, "Downloaded script")>0, "Yes", "No"))))');
  s.getRange('E2').setFormula('=MAP(A2:A, LAMBDA(r, IF(r="", "", COUNTIFS(Log!B:B, r, Log!C:C, "Downloaded script"))))');
  s.getRange('F2').setFormula(
    '=MAP(A2:A, LAMBDA(r, IF(r="", "", IFERROR(MAX(ARRAYFORMULA(IFERROR(VALUE(REGEXEXTRACT(' +
    'FILTER(Log!D:D, Log!B:B=r, Log!C:C="Read in browser"), "page (\\d+)")), 0))), ""))))'
  );
  s.getRange('G2').setFormula('=MAP(A2:A, LAMBDA(r, IF(r="", "", MAXIFS(Log!A:A, Log!B:B, r))))');
  s.getRange('B2:B').setNumberFormat('ddd mmm d, h:mm am/pm');
  s.getRange('G2:G').setNumberFormat('ddd mmm d, h:mm am/pm');
  s.setColumnWidths(1, 7, 170);
}

function logSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LOG_SHEET);
  if (!sh) {
    sh = ss.insertSheet(LOG_SHEET);
    sh.appendRow(['Time', 'Recipient', 'Event', 'Detail', 'Visit ID', 'Device', 'Screen', 'Came from', 'Browser (raw)']);
    sh.getRange('1:1').setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('ddd mmm d, h:mm:ss am/pm');
    sh.setColumnWidth(4, 260);
  }
  return sh;
}

function clean_(v) {
  // Stop anything that looks like a formula from being run by the sheet.
  const s = String(v == null ? '' : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function device_(ua) {
  const os =
    /iPhone/.test(ua) ? 'iPhone' :
    /iPad/.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua)) ? 'iPad' :
    /Android/.test(ua) ? 'Android' :
    /Macintosh|Mac OS X/.test(ua) ? 'Mac' :
    /Windows/.test(ua) ? 'Windows' : 'Other';
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /CriOS|Chrome\//.test(ua) ? 'Chrome' :
    /FxiOS|Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua) ? 'Safari' : '';
  return browser ? os + ' · ' + browser : os;
}
