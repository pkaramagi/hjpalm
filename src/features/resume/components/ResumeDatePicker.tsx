import { IconCalendar } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { DatePicker } from "tabler-react-ui";

type TablerDatePickerProps = ComponentProps<typeof DatePicker>;

export interface ResumeDatePickerProps
  extends Omit<TablerDatePickerProps, "selected" | "onChange"> {
  value?: string | null;
  onChange: (value: string | undefined) => void;
}

const formatDate = (date: Date | null) => {
  if (!date) {
    return undefined;
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function ResumeDatePicker({
  value,
  onChange,
  inputProps,
  popperProps,
  ...rest
}: ResumeDatePickerProps) {
  const parsedValue = value ? new Date(value) : null;

  return (
    <DatePicker
      {...rest}
      selected={parsedValue}
      onChange={(date) => onChange(formatDate(date))}
      inputProps={{
        icon: <IconCalendar size={16} />,
        ...inputProps,
      }}
      popperProps={{
        showPopperArrow: false,
        ...popperProps,
      }}
    />
  );
}
