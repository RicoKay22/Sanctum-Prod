const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — Part C5

export async function extractText(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Only PDF, JPEG, PNG, and plain text are accepted.`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('File exceeds the 10MB upload limit.');
  }

  if (file.type === 'text/plain') {
    return file.text();
  }

  if (file.type === 'application/pdf') {
    return extractFromPdf(file);
  }

  return extractFromImage(file);
}

async function extractFromPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

async function extractFromImage(file: File): Promise<string> {
  const Tesseract = await import('tesseract.js');
  const { data } = await Tesseract.recognize(file, 'eng');
  return data.text;
}