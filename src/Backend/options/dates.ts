import moment from 'moment';

export function getEnquiryDates() {
  const dates: number[] = [];
  for (let i = 0; i < 8; i++) {
    dates.push(Number(moment().add(i, 'day').format('YYYYMMDD')));
  }
  return dates;
}
