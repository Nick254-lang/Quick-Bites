const menuItems = [
  { name: "Burger", price: 500 },
  { name: "Pizza", price: 1200 },
  { name: "Fries", price: 300 }
];

const menuDiv = document.getElementById("menu");

menuItems.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("card");

  div.innerHTML = `
    <h3>${item.name}</h3>
    <p>KES ${item.price}</p>
    <button>Add to Cart</button>
  `;

  menuDiv?.appendChild(div);
});
//hamburger menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger?.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
//toggle btn
document.addEventListener("DOMContentLoaded", () => {

  const toggleBtn = document.getElementById("themeToggle");

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

});

//Click outside to close menu
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    navLinks.classList.remove("active");
  }
});