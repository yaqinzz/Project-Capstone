import { File } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DataTable } from "./DataTable";

const Dataset = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      setSelectedFile(files[0]);
      readFile(files[0]);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      setSelectedFile(files[0]);
      readFile(files[0]);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setFileContent(json);
      // console.log(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <PageContainer withHeader={true} withFooter={true}>
      <SectionContainer
        padded
        className="flex min-h-[calc(100vh-144px)] w-full items-start py-4"
      >
        <div className="lg:px-6">
          <h1 className="text-xl font-bold lg:text-3xl">Upload Your Dataset</h1>
          <p className="mt-2 text-xs text-muted-foreground lg:text-sm">
            Upload your dataset to get started. We support csv, xlsx, and
            parquet files up to 100 MB.
          </p>
        </div>
        <Card className="w-full self-center border-none px-0 shadow-none">
          <CardContent className="space-y-4 p-6">
            <div
              className={`flex flex-col items-center gap-1 rounded-lg border-2 border-dashed p-6 ${
                isDragging ? "border-blue-500" : "border-gray-200"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <File className="h-12 w-12" />
              <span className="text-xs font-medium text-gray-500 lg:text-xl">
                Drag and drop a file or click to browse
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {/* <Label htmlFor="file" className="text-sm font-medium">
                File
              </Label> */}
              <Input
                id="file"
                type="file"
                placeholder="File"
                accept=".xlsx,.csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <div className="mt-4 text-sm text-gray-500">
                Selected file: {selectedFile.name}
              </div>
            )}
            {fileContent.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">File Preview:</h2>
                <DataTable data={fileContent} />
              </div>
            )}
          </CardContent>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};

export default Dataset;
