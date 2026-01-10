export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string => {
  return new Date(dateString).toLocaleDateString("en-EN", options);
};

export const formatDateShort = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPrice = (
  price: number,
  currency: string = "₺",
  decimals: number = 2
): string => {
  return `${currency}${price.toFixed(decimals)}`;
};

