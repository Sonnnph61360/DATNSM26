import React, { useEffect, useState, useRef } from "react";
import { Table, Select, message, Spin, Button, Input, Modal, Form, DatePicker, TimePicker, InputNumber, Divider } from "antd";
import { QrCode, Filter, CheckCircle2, CreditCard, Banknote, RefreshCcw, Download, Plus, Zap } from "lucide-react";
import { api, type Booking, formatCurrency, formatSlotRange, Court } from "../../lib/api";
import * as XLSX from 'xlsx';
import { formatDateVi } from "../../lib/locale";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QRScanner } from ".././QRScanner"; // Chỉnh lại đường dẫn tới file QRScanner.tsx 