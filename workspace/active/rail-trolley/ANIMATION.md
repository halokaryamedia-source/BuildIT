# Animasi lori

- `animation.rail_trolley.drive`: empat roda, radius nominal4unit. Sudut = jarak blok ×16 /4 ×180/pi. Jarak tetap berarti sudut tetap; satu keliling1.5707963268blok =360derajat. Query jarak kumulatif tidak menyediakan tanda mundur.
- `animation.rail_trolley.engine_idle`: loop2detik. Body Y±0.08unit, X±0.10°, Z±0.15°. Rangka dan as tidak memiliki track idle. Locator kursi berada pada body dan ikut bergerak.
- Aktifkan kedua animasi bersama pada pemanggil client entity. Animasi tidak memindahkan entitas. Kontrol mesin, gerakan dan penempatan penumpang berada di luar aset ini.
- Preview Blockbench: pilih engine_idle lalu Play. drive memerlukan nilai query.modified_distance_moved di Variable Placeholders; contoh0 untuk diam,0.3926990817 untuk90°,1.5707963268 untuk360°. Jangan mengganti ekspresi produksi dengan anim_time.

File animation.json diturunkan dari track tersimpan, dengan konversi rotasi X/Y Blockbench ke Bedrock. Sumbu Z dan posisi Y tetap. Runtime Gateway tidak mengekspos exporter animasi native atau pengaturan placeholder query pada sesi ini.

Validasi: rumus jarak dan batas idle diperiksa numerik; loop2detik kembali ke nilai serta turunan awal. Track drive dan idle memiliki bone berbeda sehingga tidak saling menimpa. Playback idle dilihat di Blockbench. Pengujian komposisi dengan query jarak aktual dan Minecraft belum dilakukan.

Batas geometri: roda voxel bertingkat mempunyai radius nominal4 tetapi sudut kotaknya mencapai sqrt(20)=4.472unit. Saat berputar, pojok dapat melewati bidang nominal rel hingga0.472unit. Bentuk roda yang sudah disetujui dipertahankan; kontak roda kontinu belum dapat dinyatakan lulus.

Status: animasi disetujui pengguna dan proyek disimpan; bukan validasi integrasi Minecraft.

