const payment={
    template :`
    <div>
    <div>
        <h2>Select Payment Method</h2>
        <select v-model="selectedPayment">
        <option value="debit-card">Debit Card</option>
        <option value="cash-on-delivery">Cash on Delivery</option>
        </select>
  </div>

    <div  class="row row-cols-1 row-cols-md-4 g-4">
        <div v-if="success" v-for="pay in payments">
            <div class="col">
                <div class="card h-100">
                    <div>card_number: {{ pay.card_number }}</div>
                    <div>cvv: {{ pay.cvv }}</div>
                    <div>expiry_date: {{ pay.expiry_date }}</div>
                    
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setSelectedPayment(pay)"> Update</button>
                    <button class="btn btn-primary" @click.prevent="deletepayment(pay.payment_id)">Delete</button>
                    
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add/update payment</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <div>
                        <label for="card_number" class="form-label">cardNumber</label>
                        <input type="number" class="form-control" id="card_number" placeholder="card_number" v-model="payment1.card_number" required></input>
                    </div>
                    <div>
                        <label for="cvv" class="form-label">cvv</label>
                        <input type="number" class="form-control" id="cvv" placeholder="" v-model="payment1.cvv" required></input>
                    </div>
                    <div>
                        <label for="expiry_date" class="form-label">expiryDate</label>
                        <input type="date" class="form-control" id="" placeholder="expiry_date" v-model="payment1.expiry_date" required></input>
                    </div>
                    
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click.prevent="Add_update_payment()" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
    
    <br>
    <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setpayment()">
            Add Payment
        </button>
    </div>


    </div>
    `,
    data() {
        return {
            payments:[{
                payment_id:0,
                card_number:0,
                cvv:0,
                expiry_date:"",
            }],
            payment1:{},
            success:true,
            error_message:""
        }

    },
    props: {
        paymentOptions: [], // The available payment methods passed as a prop
      },
    
    methods: {
        async get_payment() {
            const response=await fetch("http://127.0.0.1:5000/api/payment",{
                headers:{
                    "Content-Type" :"application/json",
                    "Authentication-Token":localStorage.getItem("Auth_token")
                }
            })
            console.log("payment", response.status)
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                this.success = true
                this.payments= data;
                console.log(this.payments)
              }
              else {
                const errorData = await response.json()
                this.success = false
                this.error_message = errorData.error_message
              }
        },
        async Add_update_payment() {
            console.log(this.payment1.payment_id)
            if (this.payment1.payment_id == 0) {
                
                const res = await fetch("http://127.0.0.1:5000/api/payment", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.payment1)

                })
                if (res.ok) {

                    const res = await fetch("http://127.0.0.1:5000/api/payment");
                    if (res.ok) {
                        const data = await res.json();
                        this.payments = data;
                        this.message = data.message
                    }
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
            }
            else {
                
                const res = await fetch(`http://127.0.0.1:5000/api/payment/${this.payment1.payment_id}`, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.payment1)

                })
                if (res.ok) {
                    const res = await fetch("http://127.0.0.1:5000/api/address");
                    if (res.ok) {
                        const data = await res.json();
                        this.success = true
                        this.payments = data;
                    }
                    else {
                        const errorData = await res.json()
                        this.success = false
                        this.error_message = errorData.error_message
                    }
                }

            }
        },
        async deletepayment(id) {
            const response = await fetch(`http://127.0.0.1:5000/api/payment/${id}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("Auth_token")
                },

            })
            if (response.ok) {
                console.log("deleted the payment details successfully")
                const response = await fetch("http://127.0.0.1:5000/api/payment");
                if (response.ok) {
                    const data = await response.json();
                    this.payments = data;
                }
            }
            else {

                const errorData = await response.json();
                this.error_message = errorData.error_message;
            }
        },

        async setSelectedPayment(selpayment) {
            this.payment1 = selpayment;
            
        },
        async setpayment() {
            this.payment1 = {};
            this.payment1.payment_id = 0;
            
        },
        async onPaymentSelected() {
            this.$emit('paymentSelected', this.selectedPayment);
          },

    },
    mounted(){
        this.get_payment();
    }
}
export default payment
