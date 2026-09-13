-- ============================================
-- REFRESH BREEZE - SEED DATA SCRIPT
-- Members, Galleries, FAQs, and Events
-- ============================================

-- Clean existing data first to ensure clean state
DELETE FROM event_lineup;
DELETE FROM event_gallery;
DELETE FROM member_gallery;
DELETE FROM events;
DELETE FROM members;
DELETE FROM faqs;

-- ============================================
-- 1. MEMBERS
-- ============================================
INSERT INTO members (
    member_id,
    nama_panggung,
    tagline,
    hadir,
    image_url,
    jikoshoukai,
    tanggal_lahir,
    hobi,
    instagram
)
VALUES 
(
    'cissi',
    'Cissi 🦋',
    'Imajinatif, Penari',
    true,
    'foto/CVRCissi.webp',
    '"Aiyaiya, i''m your little butterfly~ Kupu-kupu yang suka menari dan bisa membuatmu bahagia, halo halo semuanya aku Cissi"',
    '22 Agustus',
    'Dance dan melamun',
    '@bakedciz'
),
(
    'channie',
    'Channie ✨',
    'Kreatif, Menghibur',
    true,
    'foto/CVRChannie.webp',
    '"Semungil bintang yang akan menerangi hatimu seperti bulan, halo semuanya aku Channie!"',
    '8 September',
    'Dance, bikin koreo, nulis, makan gorengan',
    '@zzuchannie'
),
(
    'acaa',
    'Acaa 💙',
    'Ceria, Usil, Lincah',
    true,
    'foto/CVRAca.webp',
    '"Citcitcutcuit dengarlah kicauanku yang akan meramaikan hatimuuu"',
    '25 Agustus',
    'Nyanyi, turu, main emel, berak, repeat',
    '@caafoxy'
),
(
    'sinta',
    'Sinta 🍃',
    'Pemalu, Penasaran',
    true,
    'foto/CVRSinta.webp',
    '"Si pemalu tetapi suka hal-hal baru, haloo aku Sintaa"',
    '12 Oktober',
    'Memasak, menyanyi, menari, nonton anime, tidur',
    '@sii_ntaa'
),
(
    'cally',
    'Cally 🪼',
    'Lembut, Weirdo',
    true,
    'foto/CVRCally.webp',
    '"Mengapung lembut dihatimu seperti ubur ubur yang menari di laut🪼~ Hallo aku Cally!!!"',
    '5 September',
    'Menonton film, mempertanyakan eksistensi diri sendiri, menyanyi',
    '@calismilikitiw'
),
(
    'rara',
    'Rara 🎸',
    'Happy virus yang akan membuat kalian semua bahagia!',
    true,
    'foto/rara.webp',
    '"hai hai teman teman, aku rara! MBTI ku ESFJ, aku suka sama perintilan lucu dan menyanyi! See u on stage‼️🎸"',
    '14 Mei',
    'Menyanyi, DIY barang, jajan, k-pop',
    '@aranielys___'
),
(
    'yanyee',
    'YanYee 🪽',
    'Anggun, Hangat, Cerah',
    false,
    'foto/CVRYanyee.webp',
    '"manis, lembut, dan selalu siap membuat harimu jadi lebih hangat seperti cookies yang baru matang🍪. haloo semuaa, aku yan yee!🪽"',
    '22 November',
    'Makeup, dance, baking',
    '@ho_yan.yee'
),
(
    'piya',
    'Piya 🐰',
    'Periang, Lucu',
    false,
    'foto/CVRPiya.webp',
    '"Pyon! pyon! seperti kelinci yang melompat tinggi aku akan melompat ke posisi tertinggi di hatimu 🐰 ~ Hallo aku Piya !!"',
    '1 Januari',
    'Gambar dan main rosbloz',
    '@matcvie_'
),
(
    'group',
    'Refresh Breeze 💚',
    'Kompak & Ceria',
    true,
    'foto/group.webp',
    '"Grup idola asal Tulungagung yang siap membawa hembusan angin segar untukmu!"',
    '2023',
    'Menyebarkan keceriaan bersama Breezers',
    '@refresh.breeze'
);

-- ============================================
-- 2. MEMBER GALLERY
-- ============================================
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT id, member_id FROM members WHERE member_id IN ('cissi', 'channie', 'acaa', 'sinta', 'cally', 'rara', 'yanyee', 'piya') LOOP
        IF rec.member_id = 'acaa' THEN
            INSERT INTO member_gallery (member_id, image_url) VALUES
                (rec.id, '/images/members/gallery/acaa/aca (1).webp'),
                (rec.id, '/images/members/gallery/acaa/aca (2).webp'),
                (rec.id, '/images/members/gallery/acaa/aca (3).webp');
        ELSE
            INSERT INTO member_gallery (member_id, image_url) VALUES
                (rec.id, '/images/members/gallery/' || rec.member_id || '/' || rec.member_id || ' (1).webp'),
                (rec.id, '/images/members/gallery/' || rec.member_id || '/' || rec.member_id || ' (2).webp'),
                (rec.id, '/images/members/gallery/' || rec.member_id || '/' || rec.member_id || ' (3).webp');
        END IF;
    END LOOP;
END $$;

-- ============================================
-- 3. FAQS
-- ============================================
INSERT INTO faqs (tanya, jawab, urutan)
VALUES 
(
    'Bagaimana cara memesan Cheki?',
    'Pilih Cheki member yang Anda inginkan di halaman Shop, klik tombol "+", lalu lanjutkan ke keranjang belanja untuk mengisi formulir pemesanan dan mengunggah bukti pembayaran transfer.',
    1
),
(
    'Apa saja metode pembayaran yang diterima?',
    'Saat ini kami menerima pembayaran melalui transfer Bank BCA resmi Refresh Breeze yang tertera pada bagian rincian pembayaran saat checkout.',
    2
),
(
    'Apa itu Cheki?',
    'Cheki adalah sesi foto instan dua arah (mirip polaroid fisik) bersama member idola pilihan Anda di booth event Refresh Breeze. Anda juga berkesempatan mengobrol singkat dan mendapatkan tanda tangan eksklusif!',
    3
),
(
    'Bagaimana jika saya sudah membayar tapi batal datang ke event?',
    'Jika Anda sudah melakukan pemesanan namun berhalangan hadir, harap segera menghubungi tim kami melalui DM Instagram @refresh.breeze atau WhatsApp resmi kami untuk konfirmasi penanganan lebih lanjut.',
    4
),
(
    'Setelah checkout berhasil, apa langkah selanjutnya?',
    'Anda akan mendapatkan struk digital (Digital Receipt) dengan Order Number. Simpan bukti tersebut dan tunjukkan kepada staf booth Refresh Breeze saat hari H event untuk penukaran tiket Cheki fisik.',
    5
),
(
    'Apakah bisa memesan Cheki untuk beberapa member sekaligus?',
    'Bisa! Anda dapat menambahkan Cheki dari beberapa member berbeda ke dalam satu keranjang belanja dan melakukan checkout sekaligus dalam satu kali transaksi.',
    6
),
(
    'Di mana saya bisa melihat jadwal penampilan Refresh Breeze berikutnya?',
    'Anda dapat melihat jadwal lengkap penampilan panggung dan sesi meet & greet Refresh Breeze secara realtime di menu Schedule pada website ini.',
    7
);

-- ============================================
-- 4. EVENTS & LINEUP
-- ============================================
INSERT INTO events (nama, tanggal, bulan, tahun, lokasi, event_time, cheki_time, is_past)
VALUES 
(
    'Breeze Fest 2026',
    24,
    'Oktober',
    2026,
    'Surabaya Convention Center',
    '15:00',
    '16:30 - 18:00',
    false
),
(
    'Refresh Carnival Vol. 2',
    15,
    'November',
    2026,
    'Tulungagung Cultural Hall',
    '14:00',
    '16:00 - 17:30',
    false
),
(
    'Idolcon 2026',
    10,
    'Februari',
    2026,
    'Convention Hall Jakarta',
    '18:00',
    '16:00 - 17:30',
    true
),
(
    'Chibicon',
    20,
    'Desember',
    2025,
    'Gedung Serbaguna Tulungagung',
    '14:00',
    '12:00 - 13:30',
    true
),
(
    'Utsuru x Refresh Breeze',
    15,
    'November',
    2025,
    'Tulungagung Square',
    '19:00',
    '17:00 - 18:30',
    true
);

-- Assign active members to all events lineup
DO $$
DECLARE
    ev RECORD;
    mb RECORD;
BEGIN
    FOR ev IN SELECT id FROM events LOOP
        FOR mb IN SELECT id FROM members WHERE member_id IN ('cissi', 'channie', 'acaa', 'sinta', 'cally', 'rara') LOOP
            INSERT INTO event_lineup (event_id, member_id) VALUES (ev.id, mb.id)
            ON CONFLICT (event_id, member_id) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;
