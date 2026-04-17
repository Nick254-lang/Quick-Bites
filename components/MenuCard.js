'use client';

const menuItems = [
  { id: 1, name: "Burger", price: 500 },
  { id: 2, name: "Pizza", price: 1200 },
  { id: 3, name: "Fries", price: 300 }
];

export default function MenuCard() {
  const handleAddToCart = (item) => {
    console.log('Added to cart:', item);
    // TODO: Implement cart functionality
  };

  return (
    <div id="menu" className="menu-grid">
      {menuItems.map(item => (
        <div key={item.id} className="card">
          <h3>{item.name}</h3>
          <p>KES {item.price}</p>
          <button onClick={() => handleAddToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
