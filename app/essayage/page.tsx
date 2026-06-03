"use client";

/* eslint-disable @next/next/no-img-element */

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { products, type Product, type ProductVariant } from "@/lib/products";
import {
  avatarViews as views,
  getAvatarBaseImage,
  getTryOnImage,
  type ViewName,
} from "@/lib/tryOnAssets";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Palette,
  RotateCcw,
  Ruler,
  Shirt,
  X,
} from "lucide-react";

type AssignmentMode = "auto" | "manual";
type FitLabel = "Ajusté" | "Normal" | "Large";

type DetectionResult = {
  detections?: Array<{
    keypoints?: Array<{ x?: number }>;
  }>;
};

type FaceDetectorInstance = {
  detect: (image: HTMLImageElement) => DetectionResult;
  close?: () => void;
};

type Photo = {
  id: string;
  url: string;
  file?: File;
  view: ViewName;
  assignmentMode: AssignmentMode;
  analyzing: boolean;
  preset?: boolean;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function guessViewFromDetection(result: DetectionResult): ViewName {
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

function getFirstAvailableSize(product: Product) {
  return product.sizes.find((size) => size.available)?.label ?? product.size;
}

function getFirstAvailableVariant(product: Product) {
  return product.variants.find((variant) => variant.available)?.name ?? "";
}

function getVariantStyle(variant?: ProductVariant): CSSProperties {
  if (!variant) {
    return { backgroundColor: "#b18a53" };
  }

  if (variant.value === "dots") {
    return {
      backgroundColor: "#211d1b",
      backgroundImage:
        "radial-gradient(circle at 35% 35%, rgba(255,250,241,0.95) 0 3px, transparent 4px)",
      backgroundSize: "18px 18px",
    };
  }

  if (variant.value === "stripes") {
    return {
      backgroundImage:
        "repeating-linear-gradient(90deg, #f4eadb 0 8px, #b8945b 8px 12px)",
    };
  }

  if (variant.value === "check") {
    return {
      backgroundColor: "#b8945b",
      backgroundImage:
        "linear-gradient(90deg, rgba(45,41,36,0.22) 1px, transparent 1px), linear-gradient(0deg, rgba(45,41,36,0.22) 1px, transparent 1px)",
      backgroundSize: "18px 18px",
    };
  }

  if (variant.value === "gloss") {
    return {
      backgroundImage:
        "linear-gradient(135deg, #c99777 0%, #8d5740 44%, #f6dfcd 52%, #9b654d 100%)",
    };
  }

  return { backgroundColor: variant.value };
}

function getFitLabel(product: Product, selectedSize: string): FitLabel {
  const availableSizes = product.sizes.filter((size) => size.available);
  const selectedIndex = availableSizes.findIndex(
    (size) => size.label === selectedSize
  );

  if (selectedIndex === -1) return "Normal";

  const middleIndex = Math.floor(availableSizes.length / 2);

  if (selectedIndex < middleIndex) return "Ajusté";
  if (selectedIndex === middleIndex) return "Normal";

  return "Large";
}

function getFitClass(fit: FitLabel) {
  if (fit === "Ajusté") {
    return "border-[#d7b86d] bg-[#fff3cf] text-[#7a5a23]";
  }

  if (fit === "Large") {
    return "border-[#e0c0a0] bg-[#f8e2d2] text-[#8b5130]";
  }

  return "border-[#bfd5a8] bg-[#e6efd8] text-[#536b31]";
}

function createPresetPhotos(): Photo[] {
  return views.map((view) => ({
    id: `preset-${view}`,
    url: getAvatarBaseImage(view),
    view,
    assignmentMode: "manual",
    analyzing: false,
    preset: true,
  }));
}

export default function EssayagePage() {
  const [photos, setPhotos] = useState<Photo[]>(() => createPresetPhotos());
  const [currentView, setCurrentView] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarReady, setAvatarReady] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantName, setSelectedVariantName] = useState("");
  const [detectorStatus, setDetectorStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const detectorRef = useRef<FaceDetectorInstance | null>(null);
  const photoUrlsRef = useRef<string[]>([]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId]
  );

  const selectedVariant = useMemo(
    () =>
      selectedProduct?.variants.find(
        (variant) => variant.name === selectedVariantName
      ),
    [selectedProduct, selectedVariantName]
  );

  const selectedFit = selectedProduct
    ? getFitLabel(selectedProduct, selectedSize)
    : "Normal";

  const selectedPrice = selectedProduct
    ? selectedProduct.price + (selectedVariant?.priceDelta ?? 0)
    : 0;

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

        detectorRef.current = detector as FaceDetectorInstance;
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
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      photoUrlsRef.current = [];
    };
  }, []);

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

      const originalConsoleError = console.error;

      console.error = (...args) => {
        const consoleMessage = String(args[0] ?? "");

        if (
          consoleMessage.includes(
            "Created TensorFlow Lite XNNPACK delegate for CPU"
          )
        ) {
          return;
        }

        originalConsoleError(...args);
      };

      let result: DetectionResult;

      try {
        result = detectorRef.current.detect(img);
      } finally {
        console.error = originalConsoleError;
      }

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

    photoUrlsRef.current.push(...newPhotos.map((photo) => photo.url));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setMessage("");
    setAvatarReady(false);
    setSelectedProductId(null);
    setSelectedSize("");
    setSelectedVariantName("");
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
  const currentAvatarImage = getTryOnImage(
    selectedProduct,
    selectedVariant,
    views[currentView]
  );

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
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    photoUrlsRef.current = [];

    setPhotos([]);
    setCurrentView(0);
    setIsGenerating(false);
    setAvatarReady(false);
    setSelectedProductId(null);
    setSelectedSize("");
    setSelectedVariantName("");
    setMessage("");
  }

  function usePresetAvatar() {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    photoUrlsRef.current = [];

    setPhotos(createPresetPhotos());
    setCurrentView(0);
    setIsGenerating(false);
    setAvatarReady(true);
    setSelectedProductId(null);
    setSelectedSize("");
    setSelectedVariantName("");
    setMessage("Avatar de démonstration chargé.");
  }

  function selectProduct(product: Product) {
    setSelectedProductId(product.id);
    setSelectedSize(getFirstAvailableSize(product));
    setSelectedVariantName(getFirstAvailableVariant(product));
    setMessage(`${product.name} est chargé sur l’avatar.`);
  }

  function resetTryOn() {
    setSelectedProductId(null);
    setSelectedSize("");
    setSelectedVariantName("");
    setMessage("Essayage réinitialisé. L’avatar est revenu à son état de base.");
  }

  function saveAvatar() {
    localStorage.setItem(
      "allure-avatar",
      JSON.stringify({
        savedAt: new Date().toISOString(),
        mode: "4 photos rotation with pre-rendered try-on assets",
        views: orderedPhotos.map((photo, index) => ({
          slot: views[index],
          source: photo?.view ?? null,
          asset: getAvatarBaseImage(views[index]),
        })),
        tryOn: selectedProduct
          ? {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              brand: selectedProduct.brand,
              size: selectedSize,
              variant: selectedVariantName,
              fit: selectedFit,
              price: selectedPrice,
              asset: currentAvatarImage,
            }
          : null,
      })
    );

    setMessage(
      selectedProduct
        ? "Avatar et essayage enregistrés avec succès."
        : "Avatar enregistré avec succès."
    );
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

                  <button
                    onClick={usePresetAvatar}
                    className="flex w-full items-center gap-3 border-t border-[#e2d6bf] px-5 py-5 text-left text-lg"
                  >
                    <Shirt size={22} />
                    Utiliser l’avatar de démo
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
                              {photo.assignmentMode === "auto"
                                ? "Auto"
                                : "Manuel"}
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
                <img
                  key={currentAvatarImage}
                  src={currentAvatarImage}
                  alt={views[currentView]}
                  onError={(event) => {
                    event.currentTarget.src =
                      currentPhoto?.url ?? getAvatarBaseImage(views[currentView]);
                  }}
                  className="relative h-[390px] w-[230px] rounded-[40px] object-cover object-top shadow-[0_20px_50px_rgba(60,45,25,0.2)]"
                />

                {selectedProduct && (
                  <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d8cab2] bg-[#fbf8f1]/95 px-4 py-2 text-xs font-semibold text-[#3d3125] shadow-[0_10px_24px_rgba(39,31,22,0.16)] backdrop-blur">
                    <Shirt size={14} />
                    Look porté
                  </div>
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

              <div className="mt-8 rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-4 text-left shadow-[0_12px_30px_rgba(60,45,25,0.10)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b79a63]">
                      Essayage virtuel
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#1d1813]">
                      Sélectionner un vêtement
                    </h2>
                  </div>

                  {selectedProduct ? (
                    <button
                      onClick={resetTryOn}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dccdb5] bg-[#f6f1e7] text-[#6d614f]"
                      aria-label="Réinitialiser l’essayage"
                    >
                      <X size={18} />
                    </button>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe3ca] text-[#8c6f3c]">
                      <Shirt size={18} />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {products.map((product) => {
                    const active = selectedProductId === product.id;

                    return (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className={`w-[138px] shrink-0 overflow-hidden rounded-[22px] border bg-white text-left shadow-[0_8px_18px_rgba(55,43,28,0.08)] ${
                          active
                            ? "border-[#a8792f] ring-2 ring-[#d8b66b]/70"
                            : "border-[#e0d2bc]"
                        }`}
                      >
                        <div className="relative h-[112px] w-full overflow-hidden bg-[#efe3ca]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />

                          {active && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1813] text-[#d8b66b]">
                              <Check size={15} />
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <p className="text-xs font-semibold text-[#8a682c]">
                            {product.brand}
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm font-medium text-[#241c14]">
                            {product.name}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#1d1813]">
                            {product.price}€
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!selectedProduct && (
                  <p className="mt-3 rounded-2xl bg-[#efe3ca] px-4 py-3 text-center text-sm text-[#7a5a23]">
                    Choisis un article pour charger le rendu correspondant.
                  </p>
                )}

                {selectedProduct && (
                  <div className="mt-5 rounded-[24px] border border-[#e0d2bc] bg-[#f6f1e7] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1d1813]">
                          {selectedProduct.brand} · {selectedProduct.name}
                        </p>

                        <p className="mt-1 text-sm text-[#746a5c]">
                          Taille {selectedSize || "—"} ·{" "}
                          {selectedVariantName || "Variante"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#1d1813]">
                          {selectedPrice}€
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getFitClass(
                            selectedFit
                          )}`}
                        >
                          {selectedFit}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#342a20]">
                        <Ruler size={16} />
                        Changer la taille
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size.label}
                            onClick={() =>
                              size.available && setSelectedSize(size.label)
                            }
                            disabled={!size.available}
                            className={`min-w-12 rounded-full border px-4 py-2 text-sm font-semibold ${
                              selectedSize === size.label
                                ? "border-[#1d1813] bg-[#1d1813] text-[#d8b66b]"
                                : size.available
                                  ? "border-[#d4c4aa] bg-[#fbf8f1] text-[#3d3125]"
                                  : "cursor-not-allowed border-[#e3d8c8] bg-[#eee7dc] text-[#b5a994] line-through"
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#342a20]">
                        <Palette size={16} />
                        Changer la couleur ou le motif
                      </div>

                      <div className="grid gap-2">
                        {selectedProduct.variants.map((variant) => {
                          const active = selectedVariantName === variant.name;

                          return (
                            <button
                              key={variant.name}
                              onClick={() =>
                                variant.available &&
                                setSelectedVariantName(variant.name)
                              }
                              disabled={!variant.available}
                              className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left ${
                                active
                                  ? "border-[#a8792f] bg-[#fff8e8]"
                                  : variant.available
                                    ? "border-[#d7cab2] bg-[#fbf8f1]"
                                    : "cursor-not-allowed border-[#e3d8c8] bg-[#eee7dc] opacity-65"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className="h-8 w-8 rounded-full border border-white shadow-[0_4px_10px_rgba(55,43,28,0.18)]"
                                  style={getVariantStyle(variant)}
                                />

                                <span>
                                  <span className="block text-sm font-semibold text-[#2d241a]">
                                    {variant.name}
                                  </span>

                                  <span className="text-xs text-[#7a6d5b]">
                                    {variant.kind}
                                    {!variant.available
                                      ? " indisponible"
                                      : ""}
                                  </span>
                                </span>
                              </span>

                              <span className="text-sm font-semibold text-[#4f4336]">
                                {variant.priceDelta
                                  ? `+${variant.priceDelta}€`
                                  : "Inclus"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={resetTryOn}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#cdbb9a] bg-[#fbf8f1] px-4 py-3 text-sm font-semibold text-[#3a3127]"
                    >
                      <RotateCcw size={17} />
                      Retirer le vêtement
                    </button>
                  </div>
                )}
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
