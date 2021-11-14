Vue.component("price", {
  data: function () {
    return {};
  },
  props: {
    value: Number,
    prefix: {
      type: String,
      default: "Rp",
    },
    precision: {
      type: Number,
      default: 2,
    },
  },
  template:
    "<span>{{ this.prefix + Number.parseFloat(this.value).toFixed(this.precision) }}</span>",
});

Vue.component("product-list", {
  props: ["products", "maximum"],
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
  },
  template: `<transition-group
                name="fade"
                tag="div"
                v-on:beforeEnter="before"
                v-on:enter="enter"
                v-on:leave="leave"
              >
                <div
                  class="row d-none mb-3 align-items-center"
                  v-for="(item, index) in products"
                  v-bind:key="item.id"
                  v-if="item.price <= Number(maximum)"
                  v-bind:data-index="index"
                >
                  <div class="col-1 m-auto">
                    <button class="btn btn-info text-white" v-on:click="$emit('add', item)">
                      +
                    </button>
                  </div>
                  <div class="col-sm-4">
                    <img
                      class="img-fluid d-block"
                      v-bind:src="item.image"
                      v-bind:alt="item.name"
                    />
                  </div>
                  <div class="col">
                    <h2 class="text-info">{{ item.name }}</h2>
                    <p class="mb-0">{{ item.description }}</p>
                    <div class="h5 float-right">
                      <price v-bind:value="Number(item.price)"></price>
                    </div>
                  </div>
                </div>
              </transition-group>`,
});

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
