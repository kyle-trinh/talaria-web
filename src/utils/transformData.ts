export const dataToStr = (data: any, unit: string) => {
  if (data) {
    if (unit === 'date') {
      return new Date(data.toString()).toLocaleString('vi-VN', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        timeZone: 'utc',
      });
      // return new Intl.DateTimeFormat('vi-VN', {
      //   dateStyle: 'medium',
      // } as any).format(new Date(dec.toString()));
    } else if (unit === 'usd' || unit === 'vnd') {
      return new Intl.NumberFormat('us-US', {
        style: 'currency',
        currency: unit,
      }).format(parseFloat(data['$numberDecimal']));
    } else if (unit === 'btc') {
      return `${data['$numberDecimal']} btc`;
    } else if (unit === 'percent') {
      return parseFloat(data['$numberDecimal']).toLocaleString('en-GB', {
        style: 'percent',
        maximumSignificantDigits: 4,
      });
    } else if (unit === 'kg' || unit === 'lbs') {
      return `${parseFloat(data['$numberDecimal']).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${unit}`;
    }
  }

  return undefined;
};
