declare module 'pdf-parse/lib/pdf-parse.js' {
  const pdfParse: (dataBuffer: Buffer) => Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;
  export default pdfParse;
}
