export enum Time {
  Millisecond = 1,
  Second = 1e3,
  Minute = 60 * Second,
  Hour = 60 * Minute,
  Day = 24 * Hour,
  Week = 7 * Day,
  Month = 30 * Day,
  Year = 365 * Day,
}
