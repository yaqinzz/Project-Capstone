import { Download, FileText, ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Prediction = () => {
  const [patientData, setPatientData] = useState({
    gender: "",
    age: "",
    symptoms: "",
  });

  // Analysis result state
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    prediction: string;
    confidence: number;
    date: string;
  } | null>(null);
  const analysisResultRef = useRef<HTMLDivElement>(null);

  // Profile photo state
  const [profileDragging, setProfileDragging] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    null,
  );
  const profileInputRef = useRef<HTMLInputElement>(null);

  // X-ray image state
  const [xrayDragging, setXrayDragging] = useState(false);
  const [xrayFile, setXrayFile] = useState<File | null>(null);
  const [xrayPreviewUrl, setXrayPreviewUrl] = useState<string | null>(null);
  const xrayInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      [name]: value,
    });
  };

  const handleGenderChange = (value: string) => {
    setPatientData({
      ...patientData,
      gender: value,
    });
  }; // Function to generate and download PDF
  const generatePDF = async () => {
    if (
      !analysisResultRef.current ||
      !profilePreviewUrl ||
      !xrayPreviewUrl ||
      !analysisResult
    )
      return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 128);
      pdf.text("Laporan Analisis Kesehatan Paru-paru", pageWidth / 2, 15, {
        align: "center",
      });

      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Tanggal: ${analysisResult.date}`, pageWidth / 2, 25, {
        align: "center",
      });

      // Add patient information
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Informasi Pasien:", 20, 40);

      pdf.setFontSize(12);
      pdf.text(
        `Jenis Kelamin: ${patientData.gender === "male" ? "Laki-laki" : "Perempuan"}`,
        20,
        50,
      );
      pdf.text(`Umur: ${patientData.age} tahun`, 20, 57);
      pdf.text("Gejala yang Dikeluhkan:", 20, 64); // Handle multiline symptoms text
      const symptomsText = String(patientData.symptoms || "");
      const splitSymptoms = pdf.splitTextToSize(
        symptomsText,
        pageWidth - 40,
      ) as string[];
      pdf.text(splitSymptoms, 20, 71);

      // Calculate Y position after symptoms text
      let yPos = 71 + splitSymptoms.length * 7;
      if (yPos < 90) yPos = 90;
      // Convert profile image to canvas and add to PDF
      const profileElement = document.getElementById("profile-preview");
      if (profileElement) {
        const profileCanvas = await html2canvas(profileElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        const profileImgData = profileCanvas.toDataURL("image/png");
        pdf.text("Foto Profil Pasien:", 20, yPos);
        pdf.addImage(profileImgData, "PNG", 20, yPos + 5, 40, 40);
      }
      // Convert X-ray image to canvas and add to PDF
      const xrayElement = document.getElementById("xray-preview");
      if (xrayElement) {
        const xrayCanvas = await html2canvas(xrayElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        const xrayImgData = xrayCanvas.toDataURL("image/png");
        pdf.text("Foto X-Ray Paru-paru:", pageWidth / 2, yPos);
        pdf.addImage(xrayImgData, "PNG", pageWidth / 2, yPos + 5, 80, 80);
      }

      // Add analysis results
      pdf.text("Hasil Analisis:", 20, yPos + 95);
      pdf.text(`Prediksi: ${analysisResult.prediction}`, 20, yPos + 105);
      pdf.text(
        `Tingkat Kepercayaan: ${analysisResult.confidence}%`,
        20,
        yPos + 112,
      );

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        "Laporan ini dibuat secara otomatis oleh sistem AI Deteksi Kesehatan Paru-paru",
        pageWidth / 2,
        285,
        { align: "center" },
      );

      // Save PDF
      pdf.save(`laporan-analisis-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat laporan PDF");
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Make sure we have valid image data URLs before proceeding
    if (!profilePreviewUrl?.startsWith("data:image/")) {
      alert(
        "Gambar profil tidak valid atau belum diunggah. Silakan unggah kembali.",
      );
      setIsAnalyzing(false);
      return;
    }

    if (!xrayPreviewUrl?.startsWith("data:image/")) {
      alert(
        "Gambar X-ray tidak valid atau belum diunggah. Silakan unggah kembali.",
      );
      setIsAnalyzing(false);
      return;
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock analysis result - in real app, this would come from your API
      const mockResult = {
        prediction: Math.random() > 0.5 ? "Normal" : "Pneumonia",
        confidence: Math.floor(Math.random() * 20) + 80, // Random number between 80-99
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Add validation to ensure image data URLs are still valid
      if (!profilePreviewUrl?.startsWith("data:image/")) {
        alert(
          "Profile image data is not valid. Please re-upload the profile image.",
        );
        setIsAnalyzing(false);
        return;
      }

      if (!xrayPreviewUrl?.startsWith("data:image/")) {
        alert(
          "X-ray image data is not valid. Please re-upload the X-ray image.",
        );
        setIsAnalyzing(false);
        return;
      }

      // Log the state to ensure images are available
      console.log("Profile image data URL available:", !!profilePreviewUrl);
      console.log("X-ray image data URL available:", !!xrayPreviewUrl);

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setShowAnalysis(true);

      // Scroll to results after a short delay
      setTimeout(() => {
        analysisResultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 3000); // Simulate 3 second processing time
  };

  // Profile photo handlers
  const handleProfileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setProfileDragging(true);
  }, []);

  const handleProfileDragLeave = useCallback(() => {
    setProfileDragging(false);
  }, []);

  const handleProfileFileSelection = useCallback((file: File) => {
    // Check file type (only JPEG and PNG)
    if (file.type === "image/jpeg" || file.type === "image/png") {
      // Check file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size <= maxSizeInBytes) {
        setProfileFile(file);

        // Convert to data URL using FileReader (more persistent than blob URLs)
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("File is too large. Maximum size is 5MB.");
      }
    } else {
      alert("Please upload only JPEG or PNG image files.");
    }
  }, []);

  const handleProfileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setProfileDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0]) {
        handleProfileFileSelection(files[0]);
      }
    },
    [handleProfileFileSelection],
  );

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      handleProfileFileSelection(files[0]);
    }
  };

  // X-ray image handlers
  const handleXrayDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setXrayDragging(true);
  }, []);

  const handleXrayDragLeave = useCallback(() => {
    setXrayDragging(false);
  }, []);

  const handleXrayFileSelection = useCallback((file: File) => {
    // Check file type (only JPEG and PNG)
    if (file.type === "image/jpeg" || file.type === "image/png") {
      // Check file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size <= maxSizeInBytes) {
        setXrayFile(file);

        // Convert to data URL using FileReader (more persistent than blob URLs)
        const reader = new FileReader();
        reader.onloadend = () => {
          setXrayPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("File is too large. Maximum size is 5MB.");
      }
    } else {
      alert("Please upload only JPEG or PNG image files.");
    }
  }, []);

  const handleXrayDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setXrayDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0]) {
        handleXrayFileSelection(files[0]);
      }
    },
    [handleXrayFileSelection],
  );

  const handleXrayClick = () => {
    xrayInputRef.current?.click();
  };

  const handleXrayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      handleXrayFileSelection(files[0]);
    }
  };
  // No need to clean up data URLs when component unmounts
  // Data URLs are strings and will be garbage collected automatically
  // when the component is unmounted

  return (
    <PageContainer withHeader={true} withFooter={true}>
      <SectionContainer
        padded
        className="flex min-h-[calc(100vh-144px)] w-full flex-col items-center py-4"
      >
        <div className="w-full max-w-6xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold lg:text-3xl">Informasi Pasien</h1>
            <p className="mt-2 text-xs text-muted-foreground lg:text-sm">
              Silakan masukkan data pasien dan unggah foto untuk keperluan
              identifikasi.
            </p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Patient Information Form - Left Side */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Identitas Pasien</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Photo */}
                  <div className="mb-4 flex flex-col items-center">
                    <Label
                      htmlFor="profile"
                      className="mb-2 text-base font-medium"
                    >
                      Foto Profil
                    </Label>
                    <div
                      className={`relative h-32 w-32 overflow-hidden rounded-full border-2 ${profileDragging ? "border-blue-500" : "border-gray-200"} cursor-pointer`}
                      onDragOver={handleProfileDragOver}
                      onDragLeave={handleProfileDragLeave}
                      onDrop={handleProfileDrop}
                      onClick={handleProfileClick}
                    >
                      {profilePreviewUrl ? (
                        <Image
                          src={profilePreviewUrl}
                          alt="Patient profile photo"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Input
                      id="profile"
                      type="file"
                      accept="image/jpeg, image/png"
                      ref={profileInputRef}
                      style={{ display: "none" }}
                      onChange={handleProfileFileChange}
                    />
                    <span className="mt-2 text-xs text-gray-500">
                      {profileFile
                        ? profileFile.name
                        : "Klik untuk upload foto profil"}
                    </span>
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-base font-medium">
                      Jenis Kelamin
                    </Label>
                    <RadioGroup
                      value={patientData.gender}
                      onValueChange={handleGenderChange}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base font-medium">
                      Umur
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="0"
                      max="150"
                      placeholder="Masukkan umur pasien"
                      value={patientData.age}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <Label htmlFor="symptoms" className="text-base font-medium">
                      Gejala yang Dikeluhkan
                    </Label>
                    <Textarea
                      id="symptoms"
                      name="symptoms"
                      placeholder="Deskripsikan gejala yang dirasakan pasien"
                      value={patientData.symptoms}
                      onChange={handleInputChange}
                      className="min-h-[150px] w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* X-ray Upload - Right Side */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Foto X-ray Paru-paru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 border-dashed p-4 sm:p-6 ${
                      xrayDragging ? "border-blue-500" : "border-gray-200"
                    } h-full min-h-[300px] w-full cursor-pointer justify-center`}
                    onDragOver={handleXrayDragOver}
                    onDragLeave={handleXrayDragLeave}
                    onDrop={handleXrayDrop}
                    onClick={handleXrayClick}
                  >
                    {xrayPreviewUrl ? (
                      <div className="relative mx-auto mb-4 aspect-square w-full max-w-xs">
                        <Image
                          src={xrayPreviewUrl}
                          alt="X-ray paru-paru pasien"
                          fill
                          className="rounded-md object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 400px"
                          priority
                        />
                      </div>
                    ) : (
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    )}

                    <span className="mt-4 text-center text-sm font-medium text-gray-700 sm:text-base">
                      {xrayFile
                        ? "Klik untuk mengganti foto X-ray"
                        : "Seret dan lepas foto X-ray atau klik untuk memilih"}
                    </span>

                    {!xrayFile && (
                      <span className="mt-2 text-center text-xs text-gray-400">
                        Format: JPEG, PNG (Maks 5MB)
                      </span>
                    )}
                  </div>

                  <Input
                    id="xray"
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={xrayInputRef}
                    style={{ display: "none" }}
                    onChange={handleXrayFileChange}
                  />

                  {xrayFile && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">
                        Foto terpilih: {xrayFile.name}{" "}
                        {`(${(xrayFile.size / 1024).toFixed(2)} KB)`}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>{" "}
            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 px-8 py-2 text-white hover:bg-blue-700"
                disabled={
                  isAnalyzing ||
                  !xrayFile ||
                  !profileFile ||
                  !patientData.gender ||
                  !patientData.age ||
                  !patientData.symptoms
                }
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  "Submit Data Pasien"
                )}
              </Button>
            </div>
          </form>

          {/* Analysis Results Section */}
          {showAnalysis && analysisResult && (
            <div
              ref={analysisResultRef}
              className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-800">
                  Hasil Analisis
                </h2>
                <Button
                  onClick={generatePDF}
                  className="flex items-center bg-green-600 text-white hover:bg-green-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Unduh Laporan PDF
                </Button>
              </div>{" "}
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Patient Info Summary */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Data Pasien
                  </h3>
                  <div className="rounded bg-white p-4 shadow-sm">
                    {" "}
                    <div className="mb-4 flex items-center space-x-4">
                      {" "}
                      <div
                        id="profile-preview"
                        className="relative h-20 w-20 overflow-hidden rounded-full border"
                      >
                        {profilePreviewUrl ? (
                          <Image
                            src={profilePreviewUrl}
                            alt="Patient profile"
                            fill
                            className="object-cover"
                            sizes="80px"
                            priority
                            unoptimized
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Jenis Kelamin:{" "}
                          <span className="text-gray-900">
                            {patientData.gender === "male"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                          Umur:{" "}
                          <span className="text-gray-900">
                            {patientData.age} tahun
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-gray-500">
                        Gejala:
                      </p>
                      <p className="text-sm text-gray-900">
                        {patientData.symptoms}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Hasil Deteksi X-Ray
                  </h3>
                  <div className="rounded bg-white p-4 shadow-sm">
                    <div className="mb-4 flex flex-col">
                      <div
                        id="xray-preview"
                        className="relative mx-auto mb-3 aspect-square h-44 w-full overflow-hidden rounded-md border"
                      >
                        {" "}
                        {xrayPreviewUrl && (
                          <Image
                            src={xrayPreviewUrl}
                            alt="X-ray image"
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 400px"
                            priority
                            unoptimized
                            crossOrigin="anonymous"
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="mb-1 text-base font-semibold">
                          Prediksi:
                          <span
                            className={`ml-1 ${
                              analysisResult.prediction === "Normal"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {analysisResult.prediction}
                          </span>
                        </p>
                        <div className="mb-1 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              analysisResult.prediction === "Normal"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${analysisResult.confidence}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Tingkat kepercayaan: {analysisResult.confidence}%
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {analysisResult.date}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-md bg-blue-100 p-3 text-sm">
                      <div className="flex items-start">
                        <FileText className="mr-2 mt-0.5 h-4 w-4 text-blue-600" />
                        <p className="text-blue-800">
                          {analysisResult.prediction === "Normal"
                            ? "Tidak terdeteksi adanya tanda-tanda pneumonia pada paru-paru berdasarkan analisis X-ray."
                            : "Terdeteksi kemungkinan pneumonia pada paru-paru. Disarankan untuk konsultasi lebih lanjut dengan dokter."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  <strong>Catatan:</strong> Hasil analisis ini merupakan bantuan
                  diagnosa awal menggunakan teknologi AI dan tidak menggantikan
                  diagnosis dari tenaga medis profesional. Selalu konsultasikan
                  hasil ini dengan dokter untuk penanganan lebih lanjut.
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default Prediction;
