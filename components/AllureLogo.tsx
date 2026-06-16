import Image from "next/image";

type AllureLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function AllureLogo({
  className = "relative h-14 w-36",
  imageClassName = "",
  priority = false,
}: AllureLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/allure-logo.png"
        alt="Allure"
        fill
        priority={priority}
        sizes="(max-width: 768px) 180px, 240px"
        className={`object-contain ${imageClassName}`}
      />
    </div>
  );
}
