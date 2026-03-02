import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date: string | Date, format = 'MMM D, YYYY') => {
    return dayjs(date).format(format);
};

export const formatTime = (date: string | Date) => {
    return dayjs(date).format('h:mm A');
};

export const formatRelativeTime = (date: string | Date) => {
    return dayjs(date).fromNow();
};

export const isToday = (date: string | Date) => {
    return dayjs(date).isSame(dayjs(), 'day');
};
