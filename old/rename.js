const fs = require('fs')
const { argv } = require('process');
const arguments = argv.slice(2)
const dir = arguments[0]

const skpd = [
    '1. Dinas Pendidikan dan Kebudayaan',
    '2. Satuan PNF Sanggar Kegiatan Belajar',
    '3. Dinas Kesehatan',
    '4. RSUD Namlea',
    '5. Dinas Pekerjaan Umum dan Penataan Ruang',
    '6. Dinas Perumahan dan Kawasan Pemukiman',
    // '7. Dinas Satuan Polisi Pamong Praja',
    // '8. Badan Penanggulangan Bencana Daerah',
    // '9. Dinas Sosial',
    // '10. Dinas Tenaga Kerja dan Transmigrasi',
    // '11. Dinas Pemberdayaan Perempuan dan Perlindungan Anak',
    '12. Dinas Ketahanan Pangan',
    // '13. Dinas Lingkungan Hidup',
    // '14. Dinas Kependudukan dan Pencatatan Sipil',
    // '15. Dinas Pemberdayaan Masyarakat dan Pemerintah Desa',
    // '16. Dinas Pengendalian Penduduk dan Keluarga Berencana',
    // '17. Dinas Perhubungan',
    // '18. Dinas Komunikasi dan Informatika',
    // '19. Dinas Koperasi Usaha Kecil dan Menengah',
    // '20. Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu',
    // '21. Dinas Pemuda dan Olahraga',
    // '22. Dinas Perpustakaan dan Arsip Daerah',
    '23. Dinas Perikanan',
    // '24. Dinas Pariwisata',
    '25. Dinas Pertanian',
    '26. Dinas Perindustrian dan Perdagangan',
    // '27. Bagian Tata Pemerintahan',
    // '28. Bagian Hukum',
    // '29. Bagian Umum dan Perlengkapan',
    // '30. Bagian Organisasi',
    // '31. Bagian Hubungan Masyarakat dan Protokol',
    // '32. Bagian Ekonomi dan Pembangunan',
    // '33. Bagian Kesejahteraan Rakyat',
    // '34. Bagian Sumber Daya Alam',
    // '35. Bagian Keuangan dan Perencanaan',
    // '36. Sekretariat DPRD',
    // '37. Badan Perencanaan Pembangunan Daerah',
    // '38. Badan Pengelolaan Keuangan dan Aset Daerah',
    // '39. Badan Pengelolaan Pendapatan Daerah',
    // '40. Badan Kepegawaian dan Pengembangan Sumber Daya Manusia',
    // '41. Inspektorat Daerah',
    // '42. Kecamatan Namlea',
    // '43. Kecamatan Air Buaya',
    // '44. Kecamatan Batabual',
    // '45. Kecamatan Waeapo',
    // '46. Kecamatan Waplau',
    // '47. Kecamatan Lolong Guba',
    // '48. Kecamatan Waelata',
    // '49. Kecamatan Fena Leisela',
    // '50. Kecamatan Kaiely',
    // '51. Kecamatan Lilialy',
    // '52. Badan Bina Kesatuan Bangsa dan Politik',
]

skpd.forEach((skpd, index) => {
    let directoryName = `${index+1}. ${skpd}`
    let renameDir = `${dir}\\${directoryName}`
    let fileRename = `${renameDir}\\Halaman1.pdf`

    if(fs.existsSync(fileRename)){
        console.log(`file ${fileRename} ada`)
        fs.renameSync(fileRename, `${renameDir}\\ATAS.pdf`)
        console.log(`file ${fileRename} berhasil direname`)
    }
});