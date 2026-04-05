const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');

// Paths
const SIPD_OUTPUT_DIR = path.join(__dirname, 'examples', 'SIPD-Output');
const OUTPUT_DIR = path.join(__dirname, 'output');

/**
 * Load JSON file
 */
function loadJSON(filepath) {
    try {
        const data = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading ${filepath}:`, error.message);
        return null;
    }
}

/**
 * Get all SKPD directories in a jadwal folder
 */
function getSKPDDirectories(jadwalPath) {
    try {
        return fs.readdirSync(jadwalPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        return [];
    }
}

/**
 * Get tahapan configuration for document titles and table content
 */
function getTahapanConfig(tahapanString) {
    const tahapan = tahapanString.toLowerCase();

    // Penetapan APBD Pergeseran Setelah APBD Perubahan
    if (tahapan.includes('pergeseran') && tahapan.includes('perubahan')) {
        return {
            title1: 'PERUBAHAN DOKUMEN PELAKSANAAN PERGESERAN ANGGARAN',
            title2: 'SATUAN KERJA PERANGKAT DAERAH',
            title3: '(PERUBAHAN DPPA-SKPD)',
            tablePrefix: 'Perubahan DPPA'
        };
    }
    // Penetapan APBD Pergeseran
    else if (tahapan.includes('pergeseran')) {
        return {
            title1: 'DOKUMEN PELAKSANAAN PERGESERAN ANGGARAN',
            title2: 'SATUAN KERJA PERANGKAT DAERAH',
            title3: '(DPPA-SKPD)',
            tablePrefix: 'DPPA'
        };
    }
    // Penetapan APBD Perubahan
    else if (tahapan.includes('perubahan')) {
        return {
            title1: 'PERUBAHAN DOKUMEN PELAKSANAAN ANGGARAN',
            title2: 'SATUAN KERJA PERANGKAT DAERAH',
            title3: '(PERUBAHAN DPA-SKPD)',
            tablePrefix: 'Perubahan DPA'
        };
    }
    // Default: Penetapan APBD
    else {
        return {
            title1: 'DOKUMEN PELAKSANAAN ANGGARAN',
            title2: 'SATUAN KERJA PERANGKAT DAERAH',
            title3: '(DPA-SKPD)',
            tablePrefix: 'DPA'
        };
    }
}

/**
 * Get content for Approval Page (Halaman Persetujuan)
 */
function getApprovalPageContent(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, ttdBudImage) {
    // Helper for PA detail rows
    const paDetails = [
        [
            { text: 'a. Nama', fontSize: fontSize, border: [false, false, false, false], width: 100 },
            { text: `: ${persetujuanData.nama_pa}`, fontSize: fontSize, border: [false, false, false, false] }
        ],
        [
            { text: 'b. NIP', fontSize: fontSize, border: [false, false, false, false] },
            { text: `: ${persetujuanData.nip_pa}`, fontSize: fontSize, border: [false, false, false, false] }
        ],
        [
            { text: 'c. Jabatan', fontSize: fontSize, border: [false, false, false, false] },
            { text: `: KEPALA ${persetujuanData.nama_skpd.toUpperCase()}`, fontSize: fontSize, border: [false, false, false, false] }
        ]
    ];

    return [
        // Logo
        ...(logoImage ? [{
            image: `data:image/png;base64,${logoImage}`,
            width: 60,
            alignment: 'center',
            margin: [0, 20, 0, 20]
        }] : []),

        // KABUPATEN BURU
        {
            text: 'KABUPATEN BURU',
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 25]
        },

        // Titles
        {
            text: 'PERSETUJUAN REKAPITULASI',
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 2]
        },
        {
            text: tahapanConfig.title1,
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 2]
        },
        {
            text: tahapanConfig.title2,
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 2]
        },
        {
            text: tahapanConfig.title3,
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 25]
        },

        // Year
        {
            text: `TAHUN ANGGARAN ${persetujuanData.tahun}`,
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 25]
        },

        // Verification Text
        {
            text: 'Berdasarkan hasil verifikasi Tim Anggaran Pemerintah Daerah atas seluruh dokumen pelaksanaan anggaran satuan kerja perangkat daerah:',
            fontSize: fontSize,
            margin: [0, 0, 0, 10]
        },

        // PA Details
        {
            table: {
                widths: [100, '*'],
                body: paDetails
            },
            layout: { defaultBorder: false },
            margin: [20, 0, 0, 10]
        },

        // Agreement Text
        {
            text: `menyetujui untuk dilakukan pengesahan atas dokumen pelaksanaan anggaran satuan kerja perangkat daerah Pemerintah ${persetujuanData.nama_daerah} sebagai dasar pelaksanaan anggaran daerah Tahun Anggaran ${persetujuanData.tahun}`,
            fontSize: fontSize,
            alignment: 'justify',
            margin: [0, 0, 0, 15]
        },

        // Documents Table
        {
            table: {
                headerRows: 1,
                widths: [150, '*'],
                body: [
                    [
                        { text: 'Kode', alignment: 'center', fontSize: fontSize, bold: false },
                        { text: 'Nama Formulir', alignment: 'center', fontSize: fontSize, bold: false }
                    ],
                    [
                        { text: `${tahapanConfig.tablePrefix}-SKPD`, fontSize: fontSize },
                        { text: `Ringkasan ${tahapanConfig.tablePrefix} SKPD`, fontSize: fontSize }
                    ],
                    [
                        { text: `${tahapanConfig.tablePrefix}-PENDAPATAN SKPD`, fontSize: fontSize },
                        { text: 'Rincian Anggaran Pendapatan SKPD', fontSize: fontSize }
                    ],
                    [
                        { text: `${tahapanConfig.tablePrefix}-BELANJA SKPD`, fontSize: fontSize },
                        { text: 'Rincian Anggaran Belanja SKPD', fontSize: fontSize }
                    ],
                    [
                        { text: `${tahapanConfig.tablePrefix}-PEMBIAYAAN SKPD`, fontSize: fontSize },
                        { text: 'Rincian Anggaran Pembiayaan Daerah SKPD', fontSize: fontSize }
                    ]
                ]
            },
            layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: 'black',
                vLineColor: 'black',
                paddingLeft: () => 5,
                paddingRight: () => 5,
                paddingTop: () => 3,
                paddingBottom: () => 3
            },
            margin: [0, 0, 0, 15]
        },

        // Closing
        {
            text: 'Demikian disampaikan dan dipergunakan sebagaimana mestinya.',
            alignment: 'center',
            fontSize: fontSize,
            margin: [0, 0, 0, 40]
        },

        // Signatures
        {
            table: {
                widths: ['*', '*'],
                body: [
                    [
                        { text: 'Disetujui oleh,', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 2] },
                        { text: `${persetujuanData.nama_ibukota}, Tanggal ${tanggal}`, fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 2] }
                    ],
                    [
                        { text: 'Sekretaris Daerah', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 40] },
                        { text: 'Disahkan oleh,', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 2] }
                    ],
                    [
                        { text: '', fontSize: fontSize, alignment: 'center' },
                        { text: 'PPKD', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 40] }
                    ],
                    [
                        {
                            text: persetujuanData.nama_sekda,
                            fontSize: fontSize,
                            bold: true,
                            alignment: 'center',
                            decoration: 'underline',
                            margin: [0, 0, 0, 2]
                        },
                        {
                            text: persetujuanData.nama_bud,
                            fontSize: fontSize,
                            bold: true,
                            alignment: 'center',
                            decoration: 'underline',
                            margin: [0, 0, 0, 2]
                        }
                    ],
                    [
                        { text: `NIP: ${persetujuanData.nip_sekda}`, fontSize: fontSize, alignment: 'center' },
                        { text: `NIP: ${persetujuanData.nip_bud}`, fontSize: fontSize, alignment: 'center' }
                    ]
                ]
            },
            layout: { defaultBorder: false }
        }
    ];
}

/**
 * Generate PDF for Cover Page (Halaman Depan)
 */
async function generateCoverPDF(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, outputPath) {
    // Define fonts and printer (reused)
    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    };
    const printer = new PdfPrinter(fonts);

    // Build urusan table body
    const urusanTableBody = persetujuanData.urusan.map((urusan, index) => {
        if (index === 0) {
            return [
                { text: 'URUSAN PEMERINTAHAN', fontSize: fontSize, border: [false, false, false, false], rowSpan: persetujuanData.urusan.length },
                { text: `: ${urusan.kode} - ${urusan.nama}`, fontSize: fontSize, border: [false, false, false, false] }
            ];
        } else {
            return [
                {},
                { text: `: ${urusan.kode} - ${urusan.nama}`, fontSize: fontSize, border: [false, false, false, false] }
            ];
        }
    });

    // Build bidang urusan table body
    const bidangUrusanTableBody = persetujuanData.bidang_urusan.map((bidang, index) => {
        if (index === 0) {
            return [
                { text: 'BIDANG URUSAN', fontSize: fontSize, border: [false, false, false, false], rowSpan: persetujuanData.bidang_urusan.length },
                { text: `: ${bidang.kode} - ${bidang.nama}`, fontSize: fontSize, border: [false, false, false, false] }
            ];
        } else {
            return [
                {},
                { text: `: ${bidang.kode} - ${bidang.nama}`, fontSize: fontSize, border: [false, false, false, false] }
            ];
        }
    });

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [50, 40, 40, 40],
        defaultStyle: { font: 'Helvetica', fontSize: fontSize },
        content: [
            // Logo
            ...(logoImage ? [{
                image: `data:image/png;base64,${logoImage}`,
                width: 60,
                alignment: 'center',
                margin: [0, 50, 0, 20]
            }] : []),

            // KABUPATEN BURU
            { text: 'KABUPATEN BURU', alignment: 'center', fontSize: fontSize, margin: [0, 0, 0, 25] },

            // Document title
            { text: tahapanConfig.title1, alignment: 'center', fontSize: fontSize, margin: [0, 0, 0, 8] },
            { text: tahapanConfig.title2, alignment: 'center', fontSize: fontSize, margin: [0, 0, 0, 8] },
            { text: tahapanConfig.title3, alignment: 'center', fontSize: fontSize, margin: [0, 0, 0, 25] },

            // Year
            { text: `TAHUN ANGGARAN ${persetujuanData.tahun}`, alignment: 'center', fontSize: fontSize, margin: [0, 0, 0, 25] },

            // URUSAN PEMERINTAHAN
            {
                table: { widths: [150, '*'], body: urusanTableBody },
                layout: { defaultBorder: false },
                margin: [0, 0, 0, 5]
            },

            // BIDANG URUSAN
            {
                table: { widths: [150, '*'], body: bidangUrusanTableBody },
                layout: { defaultBorder: false },
                margin: [0, 0, 0, 5]
            },

            // ORGANISASI
            {
                table: {
                    widths: [150, '*'],
                    body: [[
                        { text: 'ORGANISASI', fontSize: fontSize, border: [false, false, false, false] },
                        { text: `: ${persetujuanData.kode_skpd} - ${persetujuanData.nama_skpd}`, fontSize: fontSize, border: [false, false, false, false] }
                    ]]
                },
                layout: { defaultBorder: false },
                margin: [0, 0, 0, 15]
            },

            // PA Details (Cover Page version)
            {
                table: {
                    widths: [80, '*'],
                    body: [
                        [
                            { text: 'a. Nama', fontSize: fontSize, border: [false, false, false, false] },
                            { text: `: ${persetujuanData.nama_pa}`, fontSize: fontSize, border: [false, false, false, false] }
                        ],
                        [
                            { text: 'b. NIP', fontSize: fontSize, border: [false, false, false, false] },
                            { text: `: ${persetujuanData.nip_pa}`, fontSize: fontSize, border: [false, false, false, false] }
                        ],
                        [
                            { text: 'c. Jabatan', fontSize: 8, border: [false, false, false, false] },
                            { text: `: KEPALA ${persetujuanData.nama_skpd.toUpperCase()}`, fontSize: 8, border: [false, false, false, false] }
                        ]
                    ]
                },
                layout: { defaultBorder: false },
                margin: [0, 0, 0, 15]
            },

            // Table DPA
            {
                table: {
                    headerRows: 1,
                    widths: [150, '*'],
                    body: [
                        [
                            { text: 'Kode', alignment: 'center', fontSize: fontSize },
                            { text: 'Nama Formulir', alignment: 'center', fontSize: fontSize }
                        ],
                        [
                            { text: `${tahapanConfig.tablePrefix}-PENDAPATAN SKPD`, fontSize: fontSize },
                            { text: 'Rincian Anggaran Pendapatan SKPD', fontSize: fontSize }
                        ],
                        [
                            { text: `${tahapanConfig.tablePrefix}-BELANJA SKPD`, fontSize: fontSize },
                            { text: 'Rincian Anggaran Belanja SKPD', fontSize: fontSize }
                        ],
                        [
                            { text: `${tahapanConfig.tablePrefix}-BELANJA SKPD`, fontSize: fontSize },
                            { text: 'Rincian Anggaran Pembiayaan Daerah SKPD', fontSize: fontSize }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 0.5, vLineWidth: () => 0.5,
                    hLineColor: () => '#000000', vLineColor: () => '#000000',
                    paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 3, paddingBottom: () => 3
                },
                margin: [0, 0, 0, 80]
            },

            // Signatures
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            { text: 'Disahkan oleh,', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 2] },
                            { text: `Namlea, Tanggal ${tanggal}`, fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 2] },
                        ],
                        [
                            { text: 'PPKD', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 0] },
                            { text: 'Pengguna Anggaran', fontSize: fontSize, alignment: 'center', margin: [0, 0, 0, 0] },
                        ],
                        [
                            { text: persetujuanData.nama_bud, fontSize: fontSize, bold: true, alignment: 'center', margin: [0, 60, 0, 2], decoration: 'underline', border: [false, false, false, false] },
                            { text: persetujuanData.nama_pa, fontSize: fontSize, bold: true, alignment: 'center', margin: [0, 60, 0, 2], decoration: 'underline', border: [false, false, false, false] }
                        ],
                        [
                            { text: `NIP: ${persetujuanData.nip_bud}`, fontSize: fontSize, alignment: 'center' },
                            { text: `NIP: ${persetujuanData.nip_pa}`, fontSize: fontSize, alignment: 'center' }
                        ]
                    ]
                },
                layout: { defaultBorder: false }
            }
        ]
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const writeStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
    });
}

/**
 * Generate PDF for Approval Page (Halaman Persetujuan)
 */
async function generateApprovalPDF(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, ttdBudImage, outputPath) {
    // Define fonts and printer (reused)
    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        }
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [50, 40, 40, 40],
        defaultStyle: { font: 'Helvetica', fontSize: fontSize },
        content: getApprovalPageContent(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, ttdBudImage)
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const writeStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve());
        writeStream.on('error', reject);
    });
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Starting PDF generation for APBD Cover and Approval Pages...\n');

    // Load jadwal.json
    const jadwalPath = path.join(SIPD_OUTPUT_DIR, 'jadwal.json');
    const jadwalList = loadJSON(jadwalPath);

    if (!jadwalList) {
        console.error('❌ Failed to load jadwal.json');
        return;
    }

    // Filter jadwal: all "Penetapan" tahapan (exclude id_jadwal 62)
    const filteredJadwal = jadwalList.filter(jadwal => {
        const tahapan = jadwal.tahapan.toLowerCase();
        return tahapan.includes('penetapan') && jadwal.id_jadwal !== 62;
    });

    console.log(`📋 Found ${filteredJadwal.length} jadwal with tahapan "Penetapan" (excluding id_jadwal 62)\n`);

    for (const jadwal of filteredJadwal) {
        console.log(`\n📅 Processing jadwal: ${jadwal.jadwal_sipd_penatausahaan}`);

        const jadwalFolderPath = path.join(SIPD_OUTPUT_DIR, jadwal.jadwal_sipd_penatausahaan);

        if (!fs.existsSync(jadwalFolderPath)) {
            console.log(`⚠️  Jadwal folder not found: ${jadwalFolderPath}`);
            continue;
        }

        // Get all SKPD directories
        const skpdList = getSKPDDirectories(jadwalFolderPath);
        console.log(`   Found ${skpdList.length} SKPD(s)`);

        for (const skpd of skpdList) {
            const persetujuanPath = path.join(jadwalFolderPath, skpd, '1. depan - persetujuan.json');

            if (!fs.existsSync(persetujuanPath)) {
                console.log(`   ⚠️  Skipping ${skpd}: persetujuan.json not found`);
                continue;
            }

            const persetujuanData = loadJSON(persetujuanPath);

            if (!persetujuanData) {
                console.log(`   ⚠️  Skipping ${skpd}: failed to parse persetujuan.json`);
                continue;
            }

            // Prep shared resources
            const logoPath = path.join(__dirname, 'assets', 'kabupaten_buru.png');
            let logoImage = null;
            if (fs.existsSync(logoPath)) {
                logoImage = fs.readFileSync(logoPath).toString('base64');
            }

            const ttdBudPath = path.join(__dirname, 'assets', `${persetujuanData.nip_bud}.png`);
            let ttdBudImage = null;
            if (fs.existsSync(ttdBudPath)) {
                ttdBudImage = fs.readFileSync(ttdBudPath).toString('base64');
            }

            const tanggal = jadwal.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const tahapanConfig = getTahapanConfig(jadwal.tahapan);
            const fontSize = 7;

            // Generate Cover PDF
            const coverOutputPath = path.join(OUTPUT_DIR, jadwal.jadwal_sipd_penatausahaan, skpd, '1. Halaman Depan.pdf');
            try {
                await generateCoverPDF(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, coverOutputPath);
                console.log(`     ✅ Cover: ${path.basename(coverOutputPath)}`);
            } catch (error) {
                console.log(`     ❌ Error Cover for ${skpd}:`, error.message);
            }

            // Generate Approval PDF
            const approvalOutputPath = path.join(OUTPUT_DIR, jadwal.jadwal_sipd_penatausahaan, skpd, '2. Halaman Persetujuan.pdf');
            try {
                await generateApprovalPDF(persetujuanData, tahapanConfig, fontSize, tanggal, logoImage, ttdBudImage, approvalOutputPath);
                console.log(`     ✅ Approval: ${path.basename(approvalOutputPath)}`);
            } catch (error) {
                console.log(`     ❌ Error Approval for ${skpd}:`, error.message);
            }
        }
    }

    console.log('\n✨ PDF generation completed!');
}

// Run
main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
