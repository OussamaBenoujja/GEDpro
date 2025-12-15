const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function verifyPdf() {
    const filePath = path.join(__dirname, '../src/assets/Oussama_Benoujja_CV.pdf');

    console.log(`Reading file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error('File not found!');
        return;
    }

    const dataBuffer = fs.readFileSync(filePath);

    try {
        const data = await pdf(dataBuffer);
        console.log('\n--- EXTRACTED RAW TEXT START ---');
        console.log(data.text);
        console.log('--- EXTRACTED RAW TEXT END ---\n');
        console.log(`Total Characters: ${data.text.length}`);

        // Simple regex preview for Experience/Skills
        console.log('\n--- KEYWORD CHECK ---');
        const keywords = ['Experience', 'Education', 'Skills', 'Node.js', 'NestJS'];
        keywords.forEach(k => {
            console.log(`Contains "${k}": ${data.text.includes(k)}`);
        });

    } catch (error) {
        console.error('Error parsing PDF:', error);
    }
}

verifyPdf();
