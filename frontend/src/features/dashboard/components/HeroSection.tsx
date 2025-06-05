import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative flex min-h-[calc(113vh-144px)] w-full items-center">
      <Image
        alt="Background"
        src="images/background.svg"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
        }}
      />
      <div className="absolute left-0 top-0 h-full w-full rounded-none bg-[#171A1F66]" />
      <div className="absolute flex flex-col gap-2 p-4 md:gap-10 md:px-28 md:text-left">
        <h1 className="text-4xl font-bold text-white md:w-[1200px] md:text-6xl">
          Convolutional Neural Network Implementation for Pneumonia Detection{" "}
        </h1>
        <h3 className="text-xl text-white md:text-2xl">
          Optimizing machine learning for accurate pneumonia detections.
        </h3>

        <Link href="/prediction" className="w-0">
          <Button
            className="mt-4 bg-purple-500 font-bold text-white"
            variant={"secondary"}
            size="lg"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
