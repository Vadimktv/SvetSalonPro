'use client';

import { DayPicker } from 'react-day-picker';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ru}
      showOutsideDays={showOutsideDays}
      className={cn('p-2', className)}
      classNames={{
        months: 'flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-semibold text-neutral-900',
        nav: 'space-x-1 flex items-center',
        nav_button:
          'h-8 w-8 rounded-full bg-white/70 text-neutral-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring focus-visible:ring-primary/60',
        nav_button_previous: 'absolute left-2 top-2',
        nav_button_next: 'absolute right-2 top-2',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-xs font-semibold uppercase text-neutral-400 w-10 text-center',
        row: 'flex w-full mt-2',
        cell: 'relative h-10 w-10 text-center text-sm focus-within:relative focus-within:z-20',
        day: cn(
          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-neutral-600 transition',
          'hover:bg-rose-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary/60'
        ),
        day_today: 'text-primary font-semibold',
        day_selected: 'bg-primary text-white hover:bg-primary focus:bg-primary',
        day_outside: 'text-neutral-300 opacity-50',
        day_disabled: 'opacity-30',
        ...classNames
      }}
      {...props}
    />
  );
}
