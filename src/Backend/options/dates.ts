import moment from 'moment';

export function getEnquiryDates() {
  const dates: Map<string, { value: number }> = new Map();
  for (let i = 0; i < 8; i++) {
    const dateMoment = moment().add(i, 'day');
    const value = Number(dateMoment.format('YYYYMMDD'));
    const key = dateMoment.format('DD/MM/YYYY (ddd)');
    dates.set(key, { value });
  }
  return dates;
}
