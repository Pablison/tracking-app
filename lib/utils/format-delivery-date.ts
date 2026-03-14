export interface FormattedDeliveryDate {
  date: string;
  time: string;
}

export function formatDeliveryDate(dateValue: string): FormattedDeliveryDate {
  if (!dateValue) {
    return { date: "", time: "" };
  }

  const [rawDate, time = ""] = dateValue.split(" ");

  if (
    rawDate &&
    rawDate.length === 8 &&
    !rawDate.includes("-") &&
    !rawDate.includes("/")
  ) {
    const year = rawDate.slice(0, 4);
    const month = rawDate.slice(4, 6);
    const day = rawDate.slice(6, 8);

    return {
      date: `${day}/${month}/${year}`,
      time,
    };
  }

  return {
    date: rawDate,
    time,
  };
}
