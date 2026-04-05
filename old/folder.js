const fs = require('fs')
const { argv } = require('process');
const arguments = argv.slice(2)
const dir = arguments[0]

const skpd = [
    'Dinas Pendidikan dan Kebudayaan',
    'Satuan PNF Sanggar Kegiatan Belajar',
    'Dinas Kesehatan',
    'RSUD Namlea',
    'Dinas Pekerjaan Umum dan Penataan Ruang',
    'Dinas Perumahan dan Kawasan Pemukiman',
    'Dinas Satuan Polisi Pamong Praja',
    'Badan Penanggulangan Bencana Daerah',
    'Dinas Sosial',
    'Dinas Tenaga Kerja dan Transmigrasi',
    'Dinas Pemberdayaan Perempuan dan Perlindungan Anak',
    'Dinas Ketahanan Pangan',
    'Dinas Lingkungan Hidup',
    'Dinas Kependudukan dan Pencatatan Sipil',
    'Dinas Pemberdayaan Masyarakat dan Pemerintah Desa',
    'Dinas Pengendalian Penduduk dan Keluarga Berencana',
    'Dinas Perhubungan',
    'Dinas Komunikasi dan Informatika',
    'Dinas Koperasi Usaha Kecil dan Menengah',
    'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu',
    'Dinas Pemuda dan Olahraga',
    'Dinas Perpustakaan dan Arsip Daerah',
    'Dinas Perikanan',
    'Dinas Pariwisata',
    'Dinas Pertanian',
    'Dinas Perindustrian dan Perdagangan',
    'Bagian Tata Pemerintahan',
    'Bagian Hukum',
    'Bagian Umum dan Perlengkapan',
    'Bagian Organisasi',
    'Bagian Hubungan Masyarakat dan Protokol',
    'Bagian Ekonomi dan Pembangunan',
    'Bagian Kesejahteraan Rakyat',
    'Bagian Sumber Daya Alam',
    'Bagian Keuangan dan Perencanaan',
    'Sekretariat DPRD',
    'Badan Perencanaan Pembangunan Daerah',
    'Badan Pengelolaan Keuangan dan Aset Daerah',
    'Badan Pengelolaan Pendapatan Daerah',
    'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia',
    'Inspektorat Daerah',
    'Kecamatan Namlea',
    'Kecamatan Air Buaya',
    'Kecamatan Batabual',
    'Kecamatan Waeapo',
    'Kecamatan Waplau',
    'Kecamatan Lolong Guba',
    'Kecamatan Waelata',
    'Kecamatan Fena Leisela',
    'Kecamatan Kaiely',
    'Kecamatan Lilialy',
    'Badan Bina Kesatuan Bangsa dan Politik',
]

const directory = [
    '1. Halaman Persetujuan',
    '2. Halaman Depan',
    '3. DPA SKPD',
    '4. DPA Pendapatan',
    '5. DPA Belanja',
    '6. DPA Rincian Belanja',
    '7. Pembiayaan'
]

directory.forEach((dd, index) => {
    let createDir = `${dir}\\${dd}`
    console.log(`membuat ${dd}`)
    if(!fs.existsSync(createDir)){
        fs.mkdirSync(createDir)
    }
})

skpd.forEach((skpd, index) => {
    let directoryName = `${index+1}. ${skpd}`
    let createDir = `${dir}\\6. DPA Rincian Belanja\\${directoryName}`
    console.log(`membuat ${directoryName}`)
    if(!fs.existsSync(createDir)){
        fs.mkdirSync(createDir)
    }
});