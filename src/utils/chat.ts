import dayjs from 'dayjs';

type MaybeMessageLike = {
    createdAt?: string | Date | null;
    timestamp?: string | Date | null;
};

export const getMessageDate = (value: MaybeMessageLike) => {
    const raw = value.createdAt ?? value.timestamp;
    const parsed = raw ? dayjs(raw) : dayjs('');
    return parsed.isValid() ? parsed : null;
};

export const formatChatTime = (value: MaybeMessageLike) => {
    const parsed = getMessageDate(value);
    return parsed ? parsed.format('HH:mm') : '--:--';
};

export const formatChatPreviewTime = (value: MaybeMessageLike) => {
    const parsed = getMessageDate(value);
    if (!parsed) return '';
    if (parsed.isSame(dayjs(), 'day')) return parsed.format('HH:mm');
    return parsed.format('DD MMM');
};

export const formatChatDayDivider = (value: MaybeMessageLike) => {
    const parsed = getMessageDate(value);
    if (!parsed) return 'Unknown';
    if (parsed.isSame(dayjs(), 'day')) return 'Today';
    if (parsed.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
    return parsed.format('DD MMM YYYY');
};
