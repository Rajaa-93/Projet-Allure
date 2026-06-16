"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AllureLogo from "@/components/AllureLogo";
import BottomNav from "@/components/BottomNav";
import { stylists } from "@/lib/stylists";
import { useAuth } from "@/lib/useAuth";
import {
  availableAppointmentDays,
  availableAppointmentTimes,
  useStylist,
} from "@/lib/useStylist";
import {
  CalendarClock,
  Check,
  ChevronRight,
  Crown,
  MessageCircle,
  Sparkles,
  Trash2,
} from "lucide-react";

const perks = [
  "Accompagnement personnalise avec un styliste",
  "Selection mensuelle adaptee a votre style",
  "Prise de rendez-vous prioritaire",
  "Messagerie dediee avec votre styliste",
];

const styleOptions = ["Streetwear", "Casual", "Chic", "Minimaliste", "Sport", "Statement"];
const colorOptions = ["Neutres", "Noir", "Dore", "Pastel", "Denim", "Terre"];
const occasionOptions = ["Travail", "Sorties", "Week-end", "Soiree", "Voyage", "Evenement"];

export default function StylistePage() {
  const router = useRouter();
  const { ready, authenticated, profile, activatePremium } = useAuth();
  const {
    ready: stylistReady,
    appointments,
    questionnaire,
    isBooked,
    bookAppointment,
    cancelAppointment,
    saveQuestionnaire,
  } = useStylist();
  const [selectedDay, setSelectedDay] = useState<
    (typeof availableAppointmentDays)[number]
  >(availableAppointmentDays[0]);
  const [selectedTime, setSelectedTime] = useState<string>(
    availableAppointmentTimes[0]
  );
  const [bookingMessage, setBookingMessage] = useState("");
  const [selectedStylistId, setSelectedStylistId] = useState(stylists[0].id);
  const [stylePreference, setStylePreference] = useState<string[] | null>(null);
  const [colorPreference, setColorPreference] = useState<string[] | null>(null);
  const [occasionPreference, setOccasionPreference] = useState<string[] | null>(null);
  const [notesPreference, setNotesPreference] = useState<string | null>(null);
  const [questionnaireMessage, setQuestionnaireMessage] = useState("");

  if (!ready) {
    return (
      <>
        <main className="px-4 pb-28 pt-12">
          <div className="rounded-[24px] border border-[#d8cab2] bg-[#fbf8f1] p-4 text-sm text-[#6a5c49]">
            Chargement de l&apos;offre styliste...
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (!authenticated) {
    return (
      <>
        <main className="px-4 pb-28 pt-12">
          <div className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
            <h1 className="text-xl font-semibold text-[#1b1712]">
              Service styliste
            </h1>
            <p className="mt-2 text-sm text-[#6f6250]">
              Connectez-vous pour souscrire a l&apos;abonnement premium styliste.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-full bg-[#1b1712] px-5 py-3 text-sm font-semibold text-[#f6f1e7]"
            >
              Aller a la connexion
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const canShowPremiumTools = profile.premium && stylistReady;
  const activeStyles = stylePreference ?? questionnaire.styles;
  const activeColors = colorPreference ?? questionnaire.colors;
  const activeOccasions = occasionPreference ?? questionnaire.occasions;
  const selectedStylist =
    stylists.find((stylist) => stylist.id === selectedStylistId) ?? stylists[0];

  function toggleTag(current: string[], value: string) {
    return current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
  }

  return (
    <>
      <main className="relative overflow-hidden px-4 pb-28 pt-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(201,174,114,0.18),transparent_65%)]" />
          <div className="absolute right-[-10%] top-8 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(214,190,138,0.16),transparent_70%)]" />
        </div>

        <section className="relative z-10">
          <div className="mb-5">
            <AllureLogo className="relative mb-2 h-16 w-32" priority />
            <h1 className="text-xl font-semibold text-[#1b1712]">
              Abonnement styliste
            </h1>
            <p className="text-sm text-[#7a6d5b]">
              Souscrivez au service premium pour beneficier d&apos;un accompagnement
              personnalise.
            </p>
          </div>

          <section className="rounded-[30px] border border-[#d7cab2] bg-[linear-gradient(135deg,#f7edd6_0%,#ead4a1_48%,#f8f2e6_100%)] p-5 shadow-[0_18px_36px_rgba(146,114,54,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1b1712] text-[#f1dfb2]">
                  <Crown size={20} />
                </div>
                <h2 className="text-[1.2rem] font-semibold text-[#1d1813]">
                  Premium Styliste
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#5c4d3a]">
                  Un styliste vous accompagne dans vos choix, vos rendez-vous et
                  vos selections mensuelles.
                </p>
              </div>

              <div className="rounded-[22px] bg-white/80 px-4 py-3 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a804b]">
                  Offre
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#1b1712]">19€</p>
                <p className="text-xs text-[#6f6250]">par mois</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {perks.map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-3 rounded-[18px] bg-white/75 px-4 py-3 text-sm text-[#3f3428]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efe5cf] text-[#8f7244]">
                    <Check size={15} />
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[20px] bg-[#fffaf2] px-3 py-4 text-center">
                <Sparkles size={18} className="mx-auto text-[#8f7244]" />
                <p className="mt-2 text-[0.7rem] font-semibold leading-5 text-[#1d1813]">
                  Questionnaire style
                </p>
              </div>
              <div className="rounded-[20px] bg-[#fffaf2] px-3 py-4 text-center">
                <CalendarClock size={18} className="mx-auto text-[#8f7244]" />
                <p className="mt-2 text-[0.7rem] font-semibold leading-5 text-[#1d1813]">
                  Rendez-vous
                </p>
              </div>
              <div className="rounded-[20px] bg-[#fffaf2] px-3 py-4 text-center">
                <MessageCircle size={18} className="mx-auto text-[#8f7244]" />
                <p className="mt-2 text-[0.7rem] font-semibold leading-5 text-[#1d1813]">
                  Messagerie
                </p>
              </div>
            </div>
          </section>

          {profile.premium ? (
            <section className="mt-4 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1d1813]">
                    Abonnement actif
                  </p>
                  <p className="mt-1 text-sm text-[#6f6250]">
                    Votre statut premium apparait maintenant sur votre profil.
                  </p>
                </div>
                <span className="rounded-full bg-[#1b1712] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f1dfb2]">
                  Premium
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-4 w-full rounded-full border border-[#d8cab2] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#1d1813]"
              >
                Retourner au profil
              </button>
            </section>
          ) : (
            <section className="mt-4 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
              <p className="text-sm text-[#6f6250]">
                En validant votre paiement, votre abonnement premium est active
                et une confirmation apparait immediatement sur votre profil.
              </p>

              <button
                type="button"
                onClick={() => {
                  activatePremium();
                  router.push("/login");
                }}
                className="mt-4 w-full rounded-full bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-5 py-3 text-sm font-semibold text-[#201811] shadow-[0_10px_24px_rgba(190,140,62,0.28)]"
              >
                S&apos;abonner et valider le paiement
              </button>

              <p className="mt-3 text-center text-xs text-[#8a7d69]">
                Une confirmation d&apos;abonnement sera affichee apres activation.
              </p>
            </section>
          )}

          {canShowPremiumTools ? (
            <>
              <section
                id="stylistes-list"
                className="mt-4 scroll-mt-24 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]"
              >
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a804b]">
                    Questionnaire
                  </p>
                  <h2 className="mt-1 text-[1.05rem] font-semibold text-[#1d1813]">
                    Questionnaire de style
                  </h2>
                  <p className="text-sm text-[#6f6250]">
                    Renseignez vos preferences pour aider votre styliste a mieux
                    comprendre vos envies. Vous pourrez modifier ces reponses plus tard.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="block">
                    <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Styles a aimer
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {styleOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setStylePreference(toggleTag(activeStyles, option))
                          }
                          className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                            activeStyles.includes(option)
                              ? "border-[#1b1712] bg-[#1b1712] text-[#f6f1e7]"
                              : "border-[#d8cab2] bg-[#fffaf2] text-[#2f261b]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="block">
                    <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Couleurs preferees
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setColorPreference(toggleTag(activeColors, option))
                          }
                          className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                            activeColors.includes(option)
                              ? "border-[#1b1712] bg-[#1b1712] text-[#f6f1e7]"
                              : "border-[#d8cab2] bg-[#fffaf2] text-[#2f261b]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="block">
                    <span className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Occasions principales
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {occasionOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setOccasionPreference(toggleTag(activeOccasions, option))
                          }
                          className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                            activeOccasions.includes(option)
                              ? "border-[#1b1712] bg-[#1b1712] text-[#f6f1e7]"
                              : "border-[#d8cab2] bg-[#fffaf2] text-[#2f261b]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Notes pour le styliste
                    </span>
                    <textarea
                      value={notesPreference ?? questionnaire.notes}
                      onChange={(event) => setNotesPreference(event.target.value)}
                      rows={4}
                      className="w-full rounded-[18px] border border-[#d8cab2] bg-[#fffaf2] px-4 py-3 text-sm text-[#2f261b] outline-none"
                      placeholder="Ex: je prefere les coupes fluides, les tons chauds, et des looks faciles a porter."
                    />
                  </label>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveQuestionnaire({
                        styles: activeStyles,
                        colors: activeColors,
                        occasions: activeOccasions,
                        notes: notesPreference ?? questionnaire.notes,
                      });
                      setStylePreference(null);
                      setColorPreference(null);
                      setOccasionPreference(null);
                      setNotesPreference(null);
                      setQuestionnaireMessage(
                        "Vos preferences de style ont bien ete enregistrees."
                      );
                    }}
                    className="flex-1 rounded-full bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-5 py-3 text-sm font-semibold text-[#201811] shadow-[0_10px_24px_rgba(190,140,62,0.28)]"
                  >
                    Enregistrer le questionnaire
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStylePreference(null);
                      setColorPreference(null);
                      setOccasionPreference(null);
                      setNotesPreference(null);
                      setQuestionnaireMessage("Questionnaire recharge avec vos dernieres reponses.");
                    }}
                    className="rounded-full border border-[#d8cab2] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#1d1813]"
                  >
                    Restaurer
                  </button>
                </div>

                {questionnaireMessage ? (
                  <div className="mt-3 rounded-[18px] bg-[#f4ecdf] px-4 py-3 text-sm text-[#4e4030]">
                    {questionnaireMessage}
                  </div>
                ) : null}
              </section>

              <section className="mt-4 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a804b]">
                    Stylistes
                  </p>
                  <h2 className="mt-1 text-[1.05rem] font-semibold text-[#1d1813]">
                    Choisissez votre styliste
                  </h2>
                </div>

                <div className="space-y-3">
                  {stylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      className={`rounded-[22px] border p-3 ${
                        selectedStylistId === stylist.id
                          ? "border-[#1b1712] bg-[#f8f1df]"
                          : "border-[#d8cab2] bg-[#fffaf2]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={stylist.avatar}
                          alt={stylist.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-[18px] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#1d1813]">
                            {stylist.name}
                          </p>
                          <p className="text-sm text-[#6f6250]">{stylist.title}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {stylist.styleTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#8f7244]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStylistId(stylist.id)}
                          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
                            selectedStylistId === stylist.id
                              ? "bg-[#1b1712] text-[#f6f1e7]"
                              : "border border-[#d8cab2] bg-white text-[#1d1813]"
                          }`}
                        >
                          {selectedStylistId === stylist.id ? "Selectionne" : "Choisir"}
                        </button>
                        <Link
                          href={`/styliste/${stylist.id}`}
                          className="inline-flex items-center rounded-full border border-[#d8cab2] bg-white px-4 py-2 text-sm font-semibold text-[#1d1813]"
                        >
                          Voir profil
                          <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a804b]">
                    Rendez-vous
                  </p>
                  <h2 className="mt-1 text-[1.05rem] font-semibold text-[#1d1813]">
                    Prendre rendez-vous avec votre styliste
                  </h2>
                  <p className="text-sm text-[#6f6250]">
                    Selectionnez une date et une heure disponibles pour enregistrer
                    votre prochain echange.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Date
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {availableAppointmentDays.map((day) => (
                        <button
                          key={day.iso}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                            selectedDay.iso === day.iso
                              ? "border-[#1b1712] bg-[#1b1712] text-[#f6f1e7]"
                              : "border-[#d8cab2] bg-[#fffaf2] text-[#2f261b]"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                      Heure
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {availableAppointmentTimes.map((time) => {
                        const booked = isBooked(selectedDay.iso, time);
                        return (
                          <button
                            key={`${selectedDay.iso}-${time}`}
                            type="button"
                            disabled={booked}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-[18px] border px-4 py-3 text-sm font-semibold ${
                              booked
                                ? "cursor-not-allowed border-[#e8dfd0] bg-[#f3eee5] text-[#b2a591]"
                                : selectedTime === time
                                  ? "border-[#1b1712] bg-[#1b1712] text-[#f6f1e7]"
                                  : "border-[#d8cab2] bg-[#fffaf2] text-[#2f261b]"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const booked = bookAppointment(
                      selectedDay.iso,
                      selectedDay.label,
                      selectedTime,
                      selectedStylist.id,
                      selectedStylist.name
                    );
                    setBookingMessage(
                      booked
                        ? `Rendez-vous confirme avec ${selectedStylist.name} le ${selectedDay.label} a ${selectedTime}.`
                        : "Ce creneau n'est plus disponible, choisissez-en un autre."
                    );
                  }}
                  className="mt-4 w-full rounded-full bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-5 py-3 text-sm font-semibold text-[#201811] shadow-[0_10px_24px_rgba(190,140,62,0.28)]"
                >
                  Confirmer le rendez-vous
                </button>

                {bookingMessage ? (
                  <div className="mt-3 rounded-[18px] bg-[#f4ecdf] px-4 py-3 text-sm text-[#4e4030]">
                    {bookingMessage}
                  </div>
                ) : null}
              </section>

              <section className="mt-4 rounded-[26px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a804b]">
                    Agenda
                  </p>
                  <h2 className="mt-1 text-[1.05rem] font-semibold text-[#1d1813]">
                    Vos rendez-vous enregistres
                  </h2>
                </div>

                {appointments.length === 0 ? (
                  <div className="rounded-[20px] bg-[#fffaf2] px-4 py-4 text-sm text-[#6f6250]">
                    Aucun rendez-vous programme pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <article
                        key={appointment.id}
                        className="rounded-[20px] border border-[#e2d6c3] bg-[#fffaf2] px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#1d1813]">
                              {appointment.dateLabel}
                            </p>
                            <p className="mt-1 text-sm text-[#6f6250]">
                              {appointment.time} avec {appointment.stylistName}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#efe5cf] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7244]">
                            Confirme
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-xs text-[#8a7d69]">
                            Un message de confirmation a ete envoye et le rendez-vous
                            apparait dans votre agenda.
                          </p>
                          <button
                            type="button"
                            onClick={() => cancelAppointment(appointment.id)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e2d0c4] px-3 py-2 text-sm text-[#7b4f42]"
                          >
                            <Trash2 size={14} />
                            Annuler
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </section>
      </main>

      <BottomNav />
    </>
  );
}
