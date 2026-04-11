function checkout() {
    if(cart.length === 0) return alert("Pilih produk dulu!");
    
    // Membuat pesan WhatsApp otomatis
    let message = "Halo PantsDev, saya mau pesan:\n\n";
    cart.forEach(item => message += `- ${item.name} (Rp ${item.price.toLocaleString('id-ID')})\n`);
    message += `\n*Total: Rp ${document.getElementById('cart-total').innerText}*`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/0816811192?text=${encoded}`, '_blank');
}
