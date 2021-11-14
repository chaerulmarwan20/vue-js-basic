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
      this.cart.push(product);
    },
  },
});
