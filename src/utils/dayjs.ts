import dayjs from 'dayjs/esm';
import utc from 'dayjs/esm/plugin/utc';
import tz from 'dayjs/esm/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

export const dateFormatter = dayjs;
