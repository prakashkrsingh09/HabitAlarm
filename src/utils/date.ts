import { colors } from './themes';

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function isWithinRange(
  today: string,
  start: string,
  end: string,
): boolean {
  return today >= start && today <= end;
}

export function getDateRange(start: string, end: string) {
  const range: any = {};
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    const dateString = current.toISOString().split('T')[0];

    range[dateString] = {
      color: colors.primary,
      textColor: colors.secondary,
    };

    current.setDate(current.getDate() + 1);
  }

  range[start] = {
    startingDay: true,
    color: colors.primary,
    textColor: colors.secondary,
  };
  range[end] = { endingDay: true, color: colors.primary, textColor: colors.secondary };

  return range;
}

export function formatDateInWord(date: string[]): string {
  console.log('date 123: ', date);
  let month = '';
  if (date.length > 0) {
    switch (date[1]) {
      case '01':
        month = 'Jan';
        break;
      case '02':
        month = 'Feb';
        break;
      case '03':
        month = 'Mar';
        break;
      case '04':
        month = 'Apr';
        break;
      case '05':
        month = 'May';
        break;
      case '06':
        month = 'Jun';
        break;
      case '07':
        month = 'Jul';
        break;
      case '08':
        month = 'Aug';
        break;
      case '09':
        month = 'Sep';
        break;
      case '10':
        month = 'Oct';
        break;
      case '11':
        month = 'Nov';
        break;
      case '12':
        month = 'Dec';
    }
  }

  return `${month} ${date[0]}, ${date[2]}`;
}
