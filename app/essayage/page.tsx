"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";

type ViewName = "Face" | "Profil droit" | "Dos" | "Profil gauche";
type AssignmentMode = "auto" | "manual";

type Photo = {
  id: string;
  url: string;
  file: File;
  view: ViewName;
  assignmentMode: AssignmentMode;
  analyzing: boolean;
};

const views: ViewName[] = ["Face", "Profil droit", "Dos", "Profil gauche"];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function guessViewFromDetection(result: any): ViewName {
  const detection = result?.detections?.[0];
  if (!detection) return "Dos";

  const keypoints = detection.keypoints ?? [];
  if (keypoints.length < 3) return "Face";

  const leftEye = keypoints[0];
  const rightEye = keypoints[1];
  const nose = keypoints[2];

  if (!leftEye || !rightEye || !nose) return "Face";

  const eyeDistance = Math.abs((rightEye.x ?? 0) - (leftEye.x ?? 0));
  const eyeCenter = ((leftEye.x ?? 0) + (rightEye.x ?? 0)) / 2;
  const noseOffset = (nose.x ?? 0) - eyeCenter;

  if (eyeDistance > 0.12 && Math.abs(noseOffset) < 0.03) {
    return "Face";
  }

  if (noseOffset > 0.02) {
    return "Profil droit";
  }

  if (noseOffset < -0.02) {
    return "Profil gauche";
  }

  return "Face";
}

export default function EssayagePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentView, setCurrentView] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const [message, setMessage] = useState("");
  const [detectorStatus, setDetectorStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function initDetector() {
      try {
        const visionModule = await import("@mediapipe/tasks-vision");
        const { FilesetResolver, FaceDetector } = visionModule;

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
          },
          runningMode: "IMAGE",
          minDetectionConfidence: 0.5,
        });

        if (cancelled) {
          detector.close?.();
          return;
        }

        detectorRef.current = detector;
        setDetectorStatus("ready");
      } catch (error) {
        console.error(error);
        setDetectorStatus("error");
      }
    }

    initDetector();

    return () => {
      cancelled = true;
      detectorRef.current?.close?.();
    };
  }, []);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  async function autoAssignPhoto(photoId: string, url: string) {
    if (!detectorRef.current) {
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId ? { ...photo, analyzing: false } : photo
        )
      );
      return;
    }

    try {
      const img = await loadImage(url);
      const result = detectorRef.current.detect(img);
      const guessedView = guessViewFromDetection(result);

      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id !== photoId) return photo;
          if (photo.assignmentMode === "manual") {
            return { ...photo, analyzing: false };
          }
          return {
            ...photo,
            view: guessedView,
            assignmentMode: "auto",
            analyzing: false,
          };
        })
      );
    } catch (error) {
      console.error(error);
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId ? { ...photo, analyzing: false } : photo
        )
      );
    }
  }

  function getFallbackView(nextIndex: number): ViewName {
    return views[Math.min(nextIndex, views.length - 1)];
  }

  function addFiles(files: FileList | null) {
    if (!files) return;

    const remainingSlots = 4 - photos.length;
    const selectedFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    if (selectedFiles.length === 0) return;

    const baseIndex = photos.length;

    const newPhotos: Photo[] = selectedFiles.map((file, index) => {
      const nextIndex = baseIndex + index;
      return {
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
        view: getFallbackView(nextIndex),
        assignmentMode: "auto",
        analyzing: detectorStatus === "ready",
      };
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
    setMessage("");
    setAvatarReady(false);
    setCurrentView(0);

    if (detectorStatus === "ready") {
      newPhotos.forEach((photo) => {
        void autoAssignPhoto(photo.id, photo.url);
      });
    }
  }

  function handleManualViewChange(photoId: string, nextView: ViewName) {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              view: nextView,
              assignmentMode: "manual",
              analyzing: false,
            }
          : photo
      )
    );
  }

  const missingViews = useMemo(
    () => views.filter((view) => !photos.some((photo) => photo.view === view)),
    [photos]
  );

  const orderedPhotos = useMemo(
    () =>
      views.map((view) => photos.find((photo) => photo.view === view) ?? null),
    [photos]
  );

  const currentPhoto = orderedPhotos[currentView];

  function generateAvatar() {
    if (missingViews.length > 0) {
      setMessage(`Il manque : ${missingViews.join(", ")}.`);
      return;
    }

    if (photos.some((photo) => photo.analyzing)) {
      setMessage("Attends la fin de l’analyse automatique des photos.");
      return;
    }

    setMessage("");
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setAvatarReady(true);
      setCurrentView(0);
      setMessage("Avatar généré avec succès.");
    }, 1800);
  }

  function rotateNext() {
    setCurrentView((prev) => (prev + 1) % 4);
  }

  function rotatePrevious() {
    setCurrentView((prev) => (prev - 1 + 4) % 4);
  }

  function resetAvatar() {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setCurrentView(0);
    setIsGenerating(false);
    setAvatarReady(false);
    setMessage("");
  }

  function saveAvatar() {
    localStorage.setItem(
      "allure-avatar",
      JSON.stringify({
        savedAt: new Date().toISOString(),
        mode: "4 photos rotation auto-assign",
        views: orderedPhotos.map((photo, index) => ({
          slot: views[index],
          source: photo?.view ?? null,
        })),
      })
    );

    setMessage("Avatar enregistré avec succès.");
  }

  return (
    <main className="relative h-full bg-[#f6f1e7] text-[#1d1813]">
      <div className="h-full overflow-y-auto px-6 pb-32 pt-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-35%] top-[34%] h-64 w-[170%] rotate-[-8deg] bg-[radial-gradient(ellipse_at_center,rgba(201,174,114,0.30),transparent_62%)]" />
          <div className="absolute bottom-0 left-0 h-28 w-full bg-[radial-gradient(ellipse_at_center,rgba(120,75,25,0.38),transparent_72%)]" />
        </div>

        <section className="relative z-10">
          <div className="text-center">
            <p
              className="text-6xl text-[#b89a61]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Allure
            </p>
          </div>

          {!avatarReady && !isGenerating && (
            <>
              <div className="mt-8">
                <h1 className="text-center text-[30px] font-medium">
                  Ajoutez vos photos
                </h1>

                <div className="mt-8 overflow-hidden rounded-[24px] border border-[#d6c8ae] bg-[#fbf8f1] shadow-[0_8px_20px_rgba(60,45,25,0.12)]">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-3 px-5 py-5 text-left text-lg"
                  >
                    <ImageIcon size={22} />
                    Parcourir la photothèque
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[linear-gradient(180deg,#d7b86d_0%,#a8792f_100%)] px-5 py-5 text-left text-lg font-medium text-white"
                  >
                    Choisir mes 4 photos
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-[#efe3ca] p-3 text-center text-sm text-[#7a5a23]">
                  {detectorStatus === "loading" &&
                    "Analyse automatique des vues en cours de chargement..."}
                  {detectorStatus === "ready" &&
                    "Les vues sont auto-détectées. Tu peux les corriger manuellement si besoin."}
                  {detectorStatus === "error" &&
                    "Analyse automatique indisponible. Assigne les vues manuellement."}
                </div>

                <p className="mt-5 text-center text-sm text-[#7a6d5b]">
                  Ajoutez 4 photos : face, profil droit, dos et profil gauche.
                </p>
              </div>

              {photos.length > 0 && (
                <div className="mt-7">
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="overflow-hidden rounded-2xl border border-[#d6c8ae] bg-[#fbf8f1]"
                      >
                        <div className="flex items-center justify-between px-3 py-2">
                          <span className="text-sm font-medium">
                            {photo.analyzing ? "Analyse..." : photo.view}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#8a7451]">
                              {photo.assignmentMode === "auto" ? "Auto" : "Manuel"}
                            </span>
                            <Check size={16} className="text-[#9c7331]" />
                          </div>
                        </div>

                        <img
                          src={photo.url}
                          alt={photo.view}
                          className="h-36 w-full object-cover object-top"
                        />

                        <div className="border-t border-[#e2d6bf] p-3">
                          <label className="mb-1 block text-xs font-medium text-[#7a6d5b]">
                            Corriger la vue
                          </label>
                          <select
                            value={photo.view}
                            onChange={(event) =>
                              handleManualViewChange(
                                photo.id,
                                event.target.value as ViewName
                              )
                            }
                            className="w-full rounded-xl border border-[#d6c8ae] bg-white px-3 py-2 text-sm outline-none"
                          >
                            {views.map((view) => (
                              <option key={view} value={view}>
                                {view}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#fbf8f1] p-4 text-sm text-[#6d614f] shadow-[0_8px_20px_rgba(60,45,25,0.08)]">
                    <p className="font-semibold text-[#1d1813]">
                      Vues actuellement couvertes
                    </p>
                    <p className="mt-2">
                      {views
                        .map((view) =>
                          photos.some((photo) => photo.view === view)
                            ? `✓ ${view}`
                            : `• ${view}`
                        )
                        .join("  |  ")}
                    </p>
                  </div>

                  <button
                    onClick={generateAvatar}
                    className="mx-auto mt-7 block w-[82%] rounded-2xl bg-[linear-gradient(180deg,#d8b66b_0%,#a8792f_100%)] px-6 py-4 text-xl font-semibold text-[#201811] shadow-[0_10px_28px_rgba(190,140,62,0.35)]"
                  >
                    Générer l’avatar
                  </button>
                </div>
              )}
            </>
          )}

          {isGenerating && (
            <div className="mt-16 text-center">
              <h1 className="text-[28px] font-medium">Génération en cours</h1>

              <div className="mx-auto mt-16 h-32 w-32 animate-spin rounded-full border-[12px] border-[#ead9ad] border-t-[#a8792f]" />

              <p className="mt-12 text-2xl font-medium">
                Création de votre avatar 360°...
              </p>
            </div>
          )}

          {avatarReady && (
            <div className="mt-6 text-center">
              <h1 className="text-[30px] font-medium leading-tight">
                Votre avatar réaliste
                <br />
                est prêt
              </h1>

              <p className="mt-5 text-lg text-[#5f5448]">
                Vue actuelle : {views[currentView]}
              </p>

              <div className="relative mx-auto mt-4 flex h-[410px] items-center justify-center overflow-hidden">
                {currentPhoto && (
                  <img
                    src={currentPhoto.url}
                    alt={views[currentView]}
                    className="relative h-[390px] w-[230px] rounded-[40px] object-cover object-top shadow-[0_20px_50px_rgba(60,45,25,0.2)]"
                  />
                )}
              </div>

              <div className="mt-4 flex items-center justify-center gap-5">
                <button
                  onClick={rotatePrevious}
                  className="flex h-12 w-16 items-center justify-center rounded-xl border border-[#a8894e] bg-[#fbf8f1] text-[#8a682c]"
                >
                  <ChevronLeft size={34} />
                </button>

                <button
                  onClick={rotateNext}
                  className="rounded-xl px-4 py-3 text-xl font-medium"
                >
                  PIVOTER
                </button>

                <button
                  onClick={rotateNext}
                  className="flex h-12 w-16 items-center justify-center rounded-xl border border-[#a8894e] bg-[#fbf8f1] text-[#8a682c]"
                >
                  <ChevronRight size={34} />
                </button>
              </div>

              <button
                onClick={saveAvatar}
                className="mx-auto mt-7 block w-[78%] rounded-2xl bg-[linear-gradient(180deg,#d8b66b_0%,#a8792f_100%)] px-6 py-4 text-xl font-semibold text-[#201811]"
              >
                Enregistrer
              </button>

              <button
                onClick={resetAvatar}
                className="mt-4 inline-flex items-center gap-2 text-xl text-[#3a3127]"
              >
                <RotateCcw size={20} />
                Refaire les photos
              </button>
            </div>
          )}

          {message && (
            <p className="mt-6 rounded-2xl bg-[#efe3ca] p-3 text-center text-sm font-medium text-[#7a5a23]">
              {message}
            </p>
          )}
        </section>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => addFiles(event.target.files)}
      />

      <BottomNav />
    </main>
  );
}