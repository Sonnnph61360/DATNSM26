import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CalendarDays, Clock, MapPin, User, CheckCircle2, Loader2, Wallet, QrCode, Tag, Banknote, ChevronRight, ShieldCheck, Sparkles, ArrowLeft
} from "lucide-react";
import {
  api, Court, Field, formatCurrency, TIME_SLOTS, getBookedSlots, isSlotConflict,
} from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

const DURATIONS = [
  { label: "1 giờ", value: 1 },
  { label: "1.5 giờ", value: 1.5 },
  { label: "2 giờ", value: 2 },
];

const CLOSING_TIME = 21; // Sân đóng cửa lúc 21:00
//

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fieldIdParam = params.get("fieldId");
  const courtIdParam = params.get("courtId");
  const dateParam = params.get("date");
  const timeParam = params.get("time");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const location = useLocation();
  const [success, setSuccess] = useState<null | { code: string; paymentMethod: string; checkinQrUrl?: string }>(null);

  const [field, setField] = useState<Field | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState<number | null>(
    courtIdParam ? Number(courtIdParam) : null
  );
  const [date, setDate] = useState(
    dateParam && dateParam >= new Date().toISOString().slice(0, 10)
      ? dateParam
      : ""
  );
  const [time, setTime] = useState(timeParam || "");
  const [duration, setDuration] = useState(1);
  const [customer, setCustomer] = useState({
    fullName: getUser()?.fullName || "",
    phone: getUser()?.phone || "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"deposit" | "full" | "cash">("deposit");
  const [bookedSlots, setBookedSlots] = useState<Awaited<ReturnType<typeof getBookedSlots>>>([]);

  const [endDate, setEndDate] = useState("");
  
  // State dịch vụ đi kèm
  const [balls, setBalls] = useState(0);
  const [bibs, setBibs] = useState(0);
  const [water, setWater] = useState(0);         // Nước lọc
  const [mineralWater, setMineralWater] = useState(0); // Nước muối khoáng

  // Helper tính thời gian kết thúc
  const getEndTime = (startTime: string, dur: number): number => {
    const [hours, minutes] = startTime.split(":").map(Number);
    return hours + minutes / 60 + dur;
  };

  // Kiểm tra thời lượng thuê có vượt quá giờ đóng cửa (22:00) hay không
  const isDurationValid = (dur: number): boolean => {
    if (!time) return true;
    return getEndTime(time, dur) <= CLOSING_TIME;
  };

  const todayString = new Date().toISOString().slice(0, 10);

  // Tự động điều chỉnh thời lượng về 1 giờ nếu chuyển sang giờ muộn
  useEffect(() => {
    if (time && !isDurationValid(duration)) {
      const validOption = DURATIONS.find((d) => isDurationValid(d.value));
      if (validOption) {
        setDuration(validOption.value);
      }
    }
  }, [time]);

  const recurringDates = useMemo(() => {
    if (!date) return [];
    const dates = [date];
    if (endDate && endDate >= date) {
      let current = new Date(date);
      const end = new Date(endDate);
      while (true) {
        current.setDate(current.getDate() + 7);
        if (current > end) break;
        dates.push(current.toISOString().slice(0, 10));
      }
    }
    return dates;
  }, [date, endDate]);
  //

  