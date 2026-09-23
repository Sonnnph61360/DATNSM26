import { CalendarDays, Clock, MapPin, QrCode } from "lucide-react";
import type { Booking } from "../lib/api";

type BookingPassProps = {
  booking: Booking;
  code?: string;
};

export default function BookingPass({ booking, code }: BookingPassProps) {
  const bookingCode = code || `BK${String(booking.id).padStart(6, "0")}`;
  const qrText = `CHECKIN-${bookingCode} | ${booking.fieldName} | ${booking.court} | ${booking.date} ${booking.time}`;
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrText)}&size=220`;

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <QrCode className="h-6 w-6" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Mã check-in</p>
      <h2 className="mt-1 text-2xl font-black text-slate-950">{bookingCode}</h2>
      <img src={qrUrl} alt={`Mã QR check-in ${bookingCode}`} className="mx-auto my-5 h-44 w-44 rounded-xl bg-white p-2" />
      <div className="space-y-2 border-t border-slate-100 pt-4 text-left text-sm text-slate-600">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-amber-500" />{booking.fieldName} · {booking.court}</p>
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-amber-500" />{booking.date}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-amber-500" />{booking.time} · {booking.duration} giờ</p>
      </div>
    </div>
  );
}