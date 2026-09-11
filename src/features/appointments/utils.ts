export type AppointmentDateTime = {
    date: string;
    time: string;
};

export const parseAppointmentDateTime = (
    value: string | null | undefined,
): AppointmentDateTime | null => {
    if (!value) return null;

    const trimmedValue = value.trim();
    const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{2}))?/);
    if (isoMatch) {
        const [, year, month, day, hours = '', minutes = ''] = isoMatch;
        return {
            date: `${year}-${month}-${day}`,
            time: hours ? `${hours.padStart(2, '0')}:${minutes}` : '',
        };
    }

    const dayFirstMatch = trimmedValue.match(/^(\d{2})-(\d{2})-(\d{4})(?:[T\s](\d{1,2}):(\d{2}))?/);
    if (dayFirstMatch) {
        const [, day, month, year, hours = '', minutes = ''] = dayFirstMatch;
        return {
            date: `${year}-${month}-${day}`,
            time: hours ? `${hours.padStart(2, '0')}:${minutes}` : '',
        };
    }

    const monthFirstMatch = trimmedValue.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[T\s](\d{1,2}):(\d{2}))?/,
    );
    if (!monthFirstMatch) return null;

    const [, month, day, year, hours = '', minutes = ''] = monthFirstMatch;
    return {
        date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        time: hours ? `${hours.padStart(2, '0')}:${minutes}` : '',
    };
};

export const formatAppointmentDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return date;

    return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }).format(parsedDate);
};

export const formatAppointmentTime = (time: string) => {
    if (!time) return '—';

    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(2000, 0, 1, hours, minutes));
};
