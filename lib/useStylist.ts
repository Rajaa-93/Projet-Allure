"use client";

import { useEffect, useMemo, useState } from "react";

export type StylistAppointment = {
  id: string;
  dateIso: string;
  dateLabel: string;
  time: string;
  stylistId: string;
  stylistName: string;
};

export type StyleQuestionnaire = {
  styles: string[];
  colors: string[];
  occasions: string[];
  notes: string;
};

const STYLIST_STORAGE_KEY = "allure:stylist-service";

type StylistState = {
  appointments: StylistAppointment[];
  questionnaire: StyleQuestionnaire;
};

const defaultState: StylistState = {
  appointments: [],
  questionnaire: {
    styles: ["Chic", "Casual"],
    colors: ["Neutres", "Dore"],
    occasions: ["Travail", "Sorties"],
    notes: "",
  },
};

export const availableAppointmentDays = [
  { iso: "2026-05-08", label: "Vendredi 8 mai" },
  { iso: "2026-05-09", label: "Samedi 9 mai" },
  { iso: "2026-05-11", label: "Lundi 11 mai" },
] as const;

export const availableAppointmentTimes = ["10:00", "11:30", "14:00", "16:30"] as const;

export function useStylist() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StylistState>(defaultState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STYLIST_STORAGE_KEY);
      if (!raw) {
        setReady(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.appointments)) {
        const appointments = parsed.appointments.filter(
          (item: StylistAppointment) =>
            typeof item?.id === "string" &&
            typeof item?.dateIso === "string" &&
            typeof item?.dateLabel === "string" &&
            typeof item?.time === "string" &&
            typeof item?.stylistId === "string" &&
            typeof item?.stylistName === "string"
        );
        setState({
          appointments,
          questionnaire: {
            styles: Array.isArray(parsed?.questionnaire?.styles)
              ? parsed.questionnaire.styles.filter((item: unknown) => typeof item === "string")
              : defaultState.questionnaire.styles,
            colors: Array.isArray(parsed?.questionnaire?.colors)
              ? parsed.questionnaire.colors.filter((item: unknown) => typeof item === "string")
              : defaultState.questionnaire.colors,
            occasions: Array.isArray(parsed?.questionnaire?.occasions)
              ? parsed.questionnaire.occasions.filter((item: unknown) => typeof item === "string")
              : defaultState.questionnaire.occasions,
            notes:
              typeof parsed?.questionnaire?.notes === "string"
                ? parsed.questionnaire.notes
                : defaultState.questionnaire.notes,
          },
        });
      }
    } catch {
      setState(defaultState);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.localStorage.setItem(STYLIST_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const appointments = useMemo(
    () =>
      [...state.appointments].sort((a, b) =>
        `${a.dateIso}-${a.time}`.localeCompare(`${b.dateIso}-${b.time}`)
      ),
    [state.appointments]
  );

  function isBooked(dateIso: string, time: string) {
    return appointments.some(
      (appointment) => appointment.dateIso === dateIso && appointment.time === time
    );
  }

  function bookAppointment(
    dateIso: string,
    dateLabel: string,
    time: string,
    stylistId: string,
    stylistName: string
  ) {
    if (isBooked(dateIso, time)) {
      return false;
    }

    setState((prev) => ({
      ...prev,
      appointments: [
        ...prev.appointments,
        {
          id: `${dateIso}-${time}`,
          dateIso,
          dateLabel,
          time,
          stylistId,
          stylistName,
        },
      ],
    }));
    return true;
  }

  function cancelAppointment(id: string) {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((appointment) => appointment.id !== id),
    }));
  }

  function saveQuestionnaire(questionnaire: StyleQuestionnaire) {
    setState((prev) => ({
      ...prev,
      questionnaire,
    }));
  }

  return {
    ready,
    appointments,
    questionnaire: state.questionnaire,
    isBooked,
    bookAppointment,
    cancelAppointment,
    saveQuestionnaire,
  };
}
