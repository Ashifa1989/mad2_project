const ProductCard = {
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    template: `
      <div class="product-card">
        <div v-if="success">
          <h2>Welcome {{ product.productname }} !!</h2>
          <img :src="product.image_url" :alt="product.productname" />
          <p>Made in {{ product.origin }}</p>
          <p>Quantity: {{ product.quantity }}</p>
          <p>Valid from {{ product.validity.start }} to {{ product.validity.end }}</p>
        </div>
        <div v-else>
          {{ error_message }}
        </div>
      </div>
    `,
    data() {
      return {
        success: true,
        error_message: "Something went wrong"
      };
    },
    mounted() {
      try {
        // You can use this.product to access the data passed through props
        if (this.product) {
          this.success = true;
        } else {
          this.success = false;
          this.error_message = "No product data provided";
        }
      } catch (error) {
        console.error("Error:", error);
        this.success = false;
        this.error_message = "An error occurred while processing data.";
      }
    }
  };
  
  export default ProductCard;
  