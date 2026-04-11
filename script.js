// 1. Inisialisasi Data
let cart = JSON.parse(localStorage.getItem('serenity_cart')) || [];

// 2. Fungsi Simpan & Update UI
function saveAndUpdate() {
    localStorage.setItem('serenity_cart', JSON.stringify(cart));

    // Update Angka di Icon Keranjang (Navbar)
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        // Menghitung total semua jumlah barang
        const totalItems = cart.reduce((acc, item) => acc + item.jumlah, 0);
        cartCount.innerText = totalItems;
    }

    // Update List di Halaman Keranjang
    const listKeranjang = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (listKeranjang) {
        listKeranjang.innerHTML = '';
        let totalHarga = 0;

        if (cart.length === 0) {
            listKeranjang.innerHTML = '<p class="text-center py-4">Keranjang kosong</p>';
        } else {
            cart.forEach((item, index) => {
                listKeranjang.innerHTML += `
                    <div class="flex justify-between items-center border-b py-3">
                        <div>
                            <p class="font-bold">${item.nama}</p>
                            <p class="text-sm text-gray-500">Jumlah: ${item.jumlah} x Rp ${item.harga.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-blue-600">Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
                            <button onclick="hapusItem(${index})" class="text-red-500 text-sm">Hapus</button>
                        </div>
                    </div>`;
                // PERBAIKAN: Hitung total berdasarkan (Harga x Jumlah)
                totalHarga += (item.harga * item.jumlah);
            });
        }

        if (totalEl) {
            totalEl.innerText = totalHarga.toLocaleString('id-ID');
        }
    }
}

// 3. Fungsi Tambah ke Keranjang (Mencegah Duplikasi Baris)
function tambahKeKeranjang(nama, harga) {
    // Cek apakah produk sudah ada di keranjang
    const itemAda = cart.find(item => item.nama === nama);

    if (itemAda) {
        itemAda.jumlah += 1; // Jika ada, cukup tambah jumlahnya
    } else {
        cart.push({ nama, harga, jumlah: 1 }); // Jika baru, tambahkan ke array
    }

    saveAndUpdate();
   
}

// 4. Fungsi Hapus Item
window.hapusItem = function(index) {
    cart.splice(index, 1);
    saveAndUpdate();
};

window.resetKeranjang = function() {
    // Memberikan konfirmasi agar tidak terhapus tidak sengaja
    if (confirm("Apakah Anda yakin ingin mengosongkan semua isi keranjang?")) {
        // 1. Kosongkan array cart
        cart = [];
        
        // 2. Simpan perubahan ke LocalStorage
        localStorage.setItem('serenity_cart', JSON.stringify(cart));
        
        // 3. Jalankan fungsi update UI (untuk memperbarui daftar di layar & angka di navbar)
        saveAndUpdate();
        
    }
};

// 5. Fungsi Checkout WhatsApp
window.checkoutWhatsApp = function() {
    // PERBAIKAN: Pastikan ID ini SAMA dengan yang ada di HTML keranjang2.html
    const inputNama = document.getElementById('nama'); 
    const inputAlamat = document.getElementById('alamat');
    const totalEl = document.getElementById('cart-total');

    if (!inputNama?.value || !inputAlamat?.value) {
        alert("Harap isi Nama dan Alamat!");
        return;
    }

    if (cart.length === 0) {
        alert("Kosongkan keranjang!");
        return;
    }

    const nomorWA = "6285727630083";
    let pesan = `*PESANAN BARU - FLORIST SERENITY*\n\n`;
    
    cart.forEach((item, index) => {
        pesan += `${index + 1}. *${item.nama}* (x${item.jumlah}) - Rp ${(item.harga * item.jumlah).toLocaleString('id-ID')}\n`;
    });

    pesan += `\n*Total: Rp ${totalEl.innerText}*`;
    pesan += `\n\n*Data Pengiriman:*`;
    pesan += `\nNama: ${inputNama.value}`;
    pesan += `\nAlamat: ${inputAlamat.value}`;

    window.open(`https://api.whatsapp.com/send?phone=${nomorWA}&text=${encodeURIComponent(pesan)}`, '_blank');
};

// 6. Event Listener saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const nama = button.getAttribute('data-nama');
            const harga = parseInt(button.getAttribute('data-harga'));
            tambahKeKeranjang(nama, harga);
        });
    });
    saveAndUpdate();
});