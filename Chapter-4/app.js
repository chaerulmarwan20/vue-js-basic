const app = new Vue({
  el: "#app",
  data: {
    maximum: 50,
    products: null,
    cart: [],
    style: {
      label: ["fw-bold", "me-2"],
      inputWidth: 60,
      sliderStatus: true,
    },
  },
  filters: {
    currencyFormat: function (value) {
      return "Rp" + Number.parseFloat(value).toFixed(2);
    },
  },
  mounted: function () {
    fetch("https://hplussport.com/api/products/order/price")
      .then((res) => res.json())
      .then((data) => {
        this.products = data;
      });
  },
  computed: {
    sliderState: function () {
      return this.style.sliderStatus ? "d-flex" : "d-none";
    },
    cartTotal: function () {
      let sum = 0;
      for (const key in this.cart) {
        sum = sum + this.cart[key].product.price * this.cart[key].qty;
      }
      return sum;
    },
    cartQty: function () {
      let qty = 0;
      for (const key in this.cart) {
        qty = qty + this.cart[key].qty;
      }
      return qty;
    },
  },
  methods: {
    before: function (e) {
      e.className = "d-none";
    },
    enter: function (e) {
      const delay = e.dataset.index * 100;
      setTimeout(() => {
        e.className = "row d-flex mb-3 align-items-center animated fadeInRight";
      }, delay);
    },
    leave: function (e) {
      const delay = e.dataset.index * 100;
      setTimeout(() => {
        e.className =
          "row d-flex mb-3 align-items-center animated fadeOutRight";
      }, delay);
    },
    addItem: function (product) {
      let productIndex;
      const productExist = this.cart.filter((item, index) => {
        if (Number(item.product.id) === Number(product.id)) {
          productIndex = index;
          return true;
        } else return false;
      });
      if (productExist.length) this.cart[productIndex].qty++;
      else this.cart.push({ product, qty: 1 });
    },
    deleteItem: function (key) {
      if (this.cart[key].qty > 1) this.cart[key].qty--;
      else this.cart.splice(key, 1);
    },
  },
});
