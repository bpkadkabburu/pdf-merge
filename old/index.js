const fs = require('fs')
const homedir = require('os').homedir
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
    .command('dpa-folder [path]', 'Buat folder sesuai dengan menu DPA di SIPD', (yargs) => {
        return yargs
            .positional('path', {
                default: `${homedir}\\DPA`,
                defaultDescription: 'C:\\Users\\[USERNAME] atau /home/[USERNAME]',
                type: 'string'
            })
    }, (argv) => {
        console.log(`create folder at ${argv.path}`)
    })
    .options({
        'verbose': {
            alias: 'v',
            type: 'boolean',
            description: 'Jalankan dengan catatan pesan'
        }
    })
    .demandCommand(1, 'Butuh satu perintah untuk dijalankan')
    .locale('id')
    .usage('Penggunaan: $0 <perintah> [pilihan]')
    .parse()

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

// skpd.forEach((skpd, index) => {
//     let directoryName = `${index+1}. ${skpd}`
//     let createDir = `${dir}\\${directoryName}`
//     console.log(createDir)
//     if(!fs.existsSync(createDir)){
//         fs.mkdirSync(createDir)
//     }
// });