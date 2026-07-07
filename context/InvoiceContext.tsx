"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Invoice, InvoiceAction, InvoiceState } from "@/types/invoice";
import { readFromStorage, writeToStorage } from "@/lib/storageUtils";
import { STORAGE_KEYS } from "@/constants";

const initialState: InvoiceState = { invoices: [] };

function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };
    case "ADD_INVOICE":
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case "UPDATE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };
    case "DELETE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.filter((inv) => inv.id !== action.payload),
      };
    case "TOGGLE_PIN":
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload ? { ...inv, isPinned: !inv.isPinned } : inv
        ),
      };
    default:
      return state;
  }
}

interface InvoiceContextValue {
  invoices: Invoice[];
  pinnedInvoices: Invoice[];
  unpinnedInvoices: Invoice[];
  isHydrated: boolean; // مشخص می‌کنه اطلاعات از localStorage خونده شده یا نه
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  togglePin: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedInvoices = readFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, []);
    dispatch({ type: "SET_INVOICES", payload: savedInvoices });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      writeToStorage(STORAGE_KEYS.INVOICES, state.invoices);
    }
  }, [state.invoices, isHydrated]);

  const addInvoice = useCallback((invoice: Invoice) => {
    dispatch({ type: "ADD_INVOICE", payload: invoice });
  }, []);

  const updateInvoice = useCallback((invoice: Invoice) => {
    dispatch({ type: "UPDATE_INVOICE", payload: invoice });
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    dispatch({ type: "DELETE_INVOICE", payload: id });
  }, []);

  const togglePin = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_PIN", payload: id });
  }, []);

  const getInvoiceById = useCallback(
    (id: string) => state.invoices.find((inv) => inv.id === id),
    [state.invoices]
  );

  const pinnedInvoices = useMemo(
    () => state.invoices.filter((inv) => inv.isPinned),
    [state.invoices]
  );

  const unpinnedInvoices = useMemo(
    () => state.invoices.filter((inv) => !inv.isPinned),
    [state.invoices]
  );

  const value = useMemo(
    () => ({
      invoices: state.invoices,
      pinnedInvoices,
      unpinnedInvoices,
      isHydrated,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      togglePin,
      getInvoiceById,
    }),
    [
      state.invoices,
      pinnedInvoices,
      unpinnedInvoices,
      isHydrated,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      togglePin,
      getInvoiceById,
    ]
  );

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices باید داخل InvoiceProvider استفاده بشه");
  }
  return context;
}