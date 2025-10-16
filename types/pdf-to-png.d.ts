declare module 'pdf-to-png-converter' {
  export interface PngPageOutput {
    name: string;
    content: Buffer;
    data: Buffer;
    width: number;
    height: number;
    page: number;
  }

  export interface PdfToPngOptions {
    disableFontFace?: boolean;
    useSystemFonts?: boolean;
    viewportScale?: number;
    outputFolder?: string;
    outputFileMask?: string;
    pdfFilePassword?: string;
    pagesToProcess?: number[];
    strictPagesToProcess?: boolean;
    verbosityLevel?: number;
  }

  export function pdfToPng(
    pdfFilePath: string,
    options?: PdfToPngOptions
  ): Promise<PngPageOutput[]>;
}
