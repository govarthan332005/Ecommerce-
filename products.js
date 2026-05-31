/* ============================================
   LUXE — Product Catalog
   ============================================ */

const PRODUCTS = [
    { id: 1, title: "Royal Silk Evening Gown", category: "fashion", categoryLabel: "Women's Fashion", emoji: "👗", price: 1299, oldPrice: 1899, rating: 4.9, reviews: 234, badge: "bestseller",
      gradient: "linear-gradient(135deg, #8b0000 0%, #c9647a 100%)", colors: ["#8b0000", "#1a1a2e", "#d4af37"],
      description: "An exquisite hand-tailored silk evening gown that drapes elegantly. Perfect for galas, weddings, and luxury events. Featuring delicate beadwork and Italian craftsmanship." },
    { id: 2, title: "Heritage Chronograph Watch", category: "watches", categoryLabel: "Timepieces", emoji: "⌚", price: 4500, oldPrice: null, rating: 5.0, reviews: 89, badge: "new",
      gradient: "linear-gradient(135deg, #2c2c2c 0%, #d4af37 100%)", colors: ["#d4af37", "#1a1a1a", "#c0c0c0"],
      description: "Swiss-made automatic chronograph with sapphire crystal, 100m water resistance, and 18k gold accents. A timepiece that defines sophistication." },
    { id: 3, title: "Monogram Leather Tote", category: "bags", categoryLabel: "Designer Bags", emoji: "👜", price: 2199, oldPrice: 2800, rating: 4.8, reviews: 412, badge: "sale",
      gradient: "linear-gradient(135deg, #6b4423 0%, #a87b54 100%)", colors: ["#6b4423", "#1a1a1a", "#d4af37"],
      description: "Handcrafted Italian leather tote with signature monogram. Spacious interior, gold-plated hardware, and detachable shoulder strap." },
    { id: 4, title: "Diamond Constellation Necklace", category: "jewelry", categoryLabel: "Fine Jewelry", emoji: "💎", price: 8900, oldPrice: null, rating: 5.0, reviews: 67, badge: "new",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #4a3a8f 100%)", colors: ["#d4af37", "#c0c0c0"],
      description: "18k white gold necklace featuring 2.5 carats of conflict-free diamonds in a stunning constellation pattern. Includes certificate of authenticity." },
    { id: 5, title: "Aviator Premium Sunglasses", category: "fashion", categoryLabel: "Accessories", emoji: "🕶️", price: 459, oldPrice: 599, rating: 4.7, reviews: 891, badge: "sale",
      gradient: "linear-gradient(135deg, #1a1a1a 0%, #d4af37 200%)", colors: ["#1a1a1a", "#6b4423", "#d4af37"],
      description: "Polarized aviators with titanium frame and 100% UV protection. Iconic style meets modern technology." },
    { id: 6, title: "AirPro Wireless Earbuds", category: "tech", categoryLabel: "Premium Tech", emoji: "🎧", price: 349, oldPrice: 449, rating: 4.6, reviews: 1287, badge: "bestseller",
      gradient: "linear-gradient(135deg, #f8f6f1 0%, #d4af37 100%)", colors: ["#f8f6f1", "#1a1a1a", "#d4af37"],
      description: "Premium noise-cancelling earbuds with 30-hour battery life, spatial audio, and luxury aluminum charging case." },
    { id: 7, title: "Cashmere Wool Overcoat", category: "fashion", categoryLabel: "Men's Fashion", emoji: "🧥", price: 1850, oldPrice: null, rating: 4.9, reviews: 156, badge: "new",
      gradient: "linear-gradient(135deg, #3a3a3a 0%, #6b6b6b 100%)", colors: ["#3a3a3a", "#6b4423", "#1a1a2e"],
      description: "Pure cashmere overcoat handwoven in Scotland. Tailored fit, horn buttons, and silk-lined interior for unmatched warmth and elegance." },
    { id: 8, title: "Pearl Drop Earrings", category: "jewelry", categoryLabel: "Fine Jewelry", emoji: "💫", price: 689, oldPrice: 899, rating: 4.8, reviews: 245, badge: "sale",
      gradient: "linear-gradient(135deg, #f8f6f1 0%, #ede8dd 100%)", colors: ["#f8f6f1", "#d4af37"],
      description: "South Sea pearls set in 14k gold drops. Timeless elegance for every occasion. Each pair unique." },
    { id: 9, title: "Italian Leather Loafers", category: "fashion", categoryLabel: "Footwear", emoji: "👞", price: 795, oldPrice: null, rating: 4.9, reviews: 178, badge: "bestseller",
      gradient: "linear-gradient(135deg, #2c1810 0%, #6b4423 100%)", colors: ["#2c1810", "#1a1a1a", "#6b4423"],
      description: "Hand-stitched in Florence using full-grain leather. Cushioned insole and leather sole. Available in tan, black, and burgundy." },
    { id: 10, title: "Crystal Decanter Set", category: "tech", categoryLabel: "Home Luxury", emoji: "🍾", price: 549, oldPrice: 699, rating: 4.7, reviews: 92, badge: "sale",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #4a3a8f 100%)", colors: ["#1a1a2e", "#d4af37"],
      description: "Hand-blown crystal decanter with six matching glasses. Perfect for whiskey, cognac, or wine. Comes in a luxury wooden gift box." },
    { id: 11, title: "Rose Gold Bracelet", category: "jewelry", categoryLabel: "Fine Jewelry", emoji: "✨", price: 1199, oldPrice: 1499, rating: 4.9, reviews: 312, badge: "sale",
      gradient: "linear-gradient(135deg, #b76e79 0%, #d4af37 100%)", colors: ["#b76e79", "#d4af37", "#c0c0c0"],
      description: "18k rose gold tennis bracelet with 3 carats of round-cut diamonds. Secure double-clasp closure. Lifetime warranty." },
    { id: 12, title: "Designer Silk Scarf", category: "fashion", categoryLabel: "Accessories", emoji: "🧣", price: 389, oldPrice: null, rating: 4.8, reviews: 167, badge: "new",
      gradient: "linear-gradient(135deg, #e84a5f 0%, #d4af37 100%)", colors: ["#e84a5f", "#4a3a8f", "#d4af37"],
      description: "100% pure silk twill scarf with hand-rolled edges. Limited edition print designed by Maison Laurent." },
    { id: 13, title: "Vintage Leather Briefcase", category: "bags", categoryLabel: "Men's Bags", emoji: "💼", price: 1450, oldPrice: 1750, rating: 4.8, reviews: 134, badge: "sale",
      gradient: "linear-gradient(135deg, #5c3317 0%, #8b6f47 100%)", colors: ["#5c3317", "#1a1a1a"],
      description: "Hand-burnished full-grain leather briefcase with brass hardware. Padded laptop compartment fits up to 16-inch." },
    { id: 14, title: "Tourbillon Skeleton Watch", category: "watches", categoryLabel: "Timepieces", emoji: "🕰️", price: 12500, oldPrice: null, rating: 5.0, reviews: 32, badge: "new",
      gradient: "linear-gradient(135deg, #0a0a0a 0%, #d4af37 200%)", colors: ["#d4af37", "#1a1a1a"],
      description: "Limited edition skeleton tourbillon with hand-engraved movement. Only 100 pieces worldwide." },
    { id: 15, title: "Cashmere Throw Blanket", category: "tech", categoryLabel: "Home Luxury", emoji: "🛋️", price: 425, oldPrice: 525, rating: 4.9, reviews: 287, badge: "sale",
      gradient: "linear-gradient(135deg, #ede8dd 0%, #d4af37 100%)", colors: ["#ede8dd", "#8b6f47"],
      description: "Mongolian cashmere throw, woven in Nepal. Ultra-soft and warm with hand-knotted fringe edges." },
    { id: 16, title: "Sapphire Crystal Ring", category: "jewelry", categoryLabel: "Fine Jewelry", emoji: "💍", price: 2890, oldPrice: null, rating: 5.0, reviews: 48, badge: "bestseller",
      gradient: "linear-gradient(135deg, #0f3460 0%, #4a3a8f 100%)", colors: ["#0f3460", "#d4af37"],
      description: "2-carat Ceylon sapphire ring set in 18k yellow gold with diamond accent halo." }
];

const NEW_ARRIVALS = [
    { id: 101, title: "Velvet Lounge Robe", category: "fashion", categoryLabel: "Luxury Loungewear", emoji: "🥻", price: 425, oldPrice: null, rating: 4.9, reviews: 43, badge: "new",
      gradient: "linear-gradient(135deg, #4a3a8f 0%, #8b6cbf 100%)", colors: ["#4a3a8f", "#1a1a2e", "#8b0000"],
      description: "Plush velvet robe with satin trim. Imported Italian fabric. Available in jewel tones." },
    { id: 102, title: "Smart Leather Wallet", category: "tech", categoryLabel: "Tech Accessories", emoji: "💼", price: 189, oldPrice: 249, rating: 4.7, reviews: 521, badge: "sale",
      gradient: "linear-gradient(135deg, #2c1810 0%, #6b4423 100%)", colors: ["#2c1810", "#1a1a1a"],
      description: "RFID-blocking leather wallet with built-in tracker. Find it instantly with your phone." },
    { id: 103, title: "Emerald Statement Ring", category: "jewelry", categoryLabel: "Fine Jewelry", emoji: "💍", price: 3299, oldPrice: null, rating: 5.0, reviews: 28, badge: "new",
      gradient: "linear-gradient(135deg, #2d4a2b 0%, #6b8e23 100%)", colors: ["#2d4a2b", "#d4af37"],
      description: "1.5 carat emerald set in 18k yellow gold with diamond halo. Sizes 5-9 available." },
    { id: 104, title: "Limited Edition Sneakers", category: "fashion", categoryLabel: "Designer Footwear", emoji: "👟", price: 695, oldPrice: null, rating: 4.8, reviews: 89, badge: "new",
      gradient: "linear-gradient(135deg, #f8f6f1 0%, #d4af37 100%)", colors: ["#f8f6f1", "#1a1a1a", "#d4af37"],
      description: "Numbered edition of 500 pairs worldwide. Premium suede and leather construction with signature gold accents." }
];

window.PRODUCTS = PRODUCTS;
window.NEW_ARRIVALS = NEW_ARRIVALS;
window.ALL_PRODUCTS = [...PRODUCTS, ...NEW_ARRIVALS];
