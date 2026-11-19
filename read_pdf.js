const PDFParser = require('pdf2json');
const fs = require('fs');
const p = new PDFParser(null, 1); // 1 = RAWTEXT mode
p.on('pdfParser_dataError', e => { 
  fs.writeFileSync('d:\\Portfolio\\resume_error.txt', JSON.stringify(e), 'utf8');
});
p.on('pdfParser_dataReady', data => {
  try {
    const text = p.getRawTextContent();
    fs.writeFileSync('d:\\Portfolio\\resume_text.txt', text, 'utf8');
    console.log('OK: ' + text.length + ' chars');
  } catch(e) {
    // Try alternate extraction
    const allText = [];
    if (data && data.Pages) {
      data.Pages.forEach((page, pi) => {
        allText.push(`\n=== PAGE ${pi + 1} ===\n`);
        if (page.Texts) {
          page.Texts.forEach(t => {
            if (t.R) {
              t.R.forEach(r => {
                allText.push(decodeURIComponent(r.T));
              });
            }
          });
        }
      });
    }
    fs.writeFileSync('d:\\Portfolio\\resume_text.txt', allText.join('\n'), 'utf8');
    console.log('Fallback OK: ' + allText.join('\n').length + ' chars');
  }
});
p.loadPDF('C:\\Users\\arun\\.gemini\\antigravity\\brain\\028146d7-6c72-4e02-8b29-35370f43c756\\.user_uploaded\\media_1795065654767_af761855.pdf');
