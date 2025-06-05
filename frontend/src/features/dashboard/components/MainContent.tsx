import Image from "next/image";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";

const MainContent = () => {
  return (
    <div className="mt-4 flex min-h-[calc(100vh-144px)] w-full flex-col items-center gap-4 px-4 sm:mt-8 sm:gap-8 sm:px-6 md:px-8">
      <h1 className="text-center text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
        Research Purpose and Usefulness
      </h1>
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-center">
        <Card className="flex w-full flex-col gap-2 p-4 sm:p-6 md:max-w-[400px]">
          <CardTitle className="text-xl sm:text-2xl">Purpose</CardTitle>
          <CardDescription className="text-base sm:text-lg md:text-xl">
            Investigate the efficiency of CNN model.
          </CardDescription>
          <CardDescription className="text-base sm:text-lg md:text-xl">
            Implementasi ML model for better good.
          </CardDescription>
        </Card>
        <Card className="flex w-full flex-col gap-2 p-4 sm:p-6 md:max-w-[400px]">
          <CardTitle className="text-xl sm:text-2xl">Usefulness</CardTitle>
          <CardDescription className="text-base sm:text-lg md:text-xl">
            Improves early detection of pneumonia.
          </CardDescription>
          <CardDescription className="text-base sm:text-lg md:text-xl">
            Facilitates better treatment planning.
          </CardDescription>
        </Card>
      </div>{" "}
      <div className="mt-4 w-full sm:mt-6 sm:w-4/5 md:w-3/4 lg:w-1/2">
        <Image
          alt="Data visualization content"
          src="images/contenct.svg"
          width={800}
          height={450}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 75vw, 50vw"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "450px",
            objectFit: "contain",
          }}
          priority
        />
      </div>
    </div>
  );
};

export default MainContent;
