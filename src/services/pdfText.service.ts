import fs from "fs";


const pdf = require("pdf-parse/lib/pdf-parse.js");

export const extractPdfText = async (filePath: string): Promise<string> => {
  const buffer = fs.readFileSync(filePath); // pdf converted to 010101(buffer) and then extract text from it
  const data = await pdf(buffer); //text extraction from pdf buffer in wait
  return data.text as string; // returning as string
};