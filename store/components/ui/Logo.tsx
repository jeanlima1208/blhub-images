import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/branding/logo-bl.png"
      alt="BL Mantos"
      width={984}
      height={488}
      priority
      className="
        h-auto
        w-[150px]
        object-contain
        transition-transform
        duration-300
        hover:scale-105
      "
    />
  );
}