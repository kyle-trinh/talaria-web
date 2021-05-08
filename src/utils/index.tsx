import ExternalLink from '../components/ExternalLink';
import Link from 'next/link';
import { Tag } from '@chakra-ui/react';

function truncate(str: any, num: number, type: string, page?: string) {
  if (str) {
    if (type === 'string') {
      return [str.length >= num ? `${str.slice(0, num)}...` : str, str];
    } else if (type === 'externalLink') {
      return [
        <span>
          <ExternalLink href={str}>{`${str.slice(0, num)}...`}</ExternalLink>
        </span>,
        str,
      ];
    } else if (type === 'internalLink') {
      return [
        <Link href={`/${page ? page : 'items'}/${str}`}>
          {str.slice(0, 16) + '...'}
        </Link>,
        str,
      ];
    } else if (type === 'badge') {
      return [<Tag size='md'>{str}</Tag>, str];
    } else {
      return [str, str];
    }
  }
  return ['-', '-'];
}

export function removeBlankField(obj: any) {
  const copy = { ...obj };
  for (const [key, value] of Object.entries(copy)) {
    if (!value) {
      delete copy[key];
    }
  }

  return copy;
}

export function renderDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    timeZone: 'utc',
  });
}

export { truncate };
