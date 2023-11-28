import { useGetPayments } from './paymentService.js'
const payment={
    template :`
    <div>
    <div v-if="successfirst">
        <div  class="row row-cols-1 row-cols-md-4 g-4">
            <div v-if="success" v-for="pay in payments">
                <div class="col">
                    <div class="card h-100">
                        <div>Payment Mode: {{ pay.type }}</div>
                        <div>card_number: {{ pay.card_number }}</div>
                        <div>cvv: {{ pay.cvv }}</div>
                        <div>expiry_date: {{ pay.expiry_date }}</div>
                        
                        <button type="button"  data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-success" style="background-color: rgb(76, 175, 80)" @click.prevent="setSelectedPayment(pay)"> Update</button>
                        <button class="btn btn-danger" style="background-color: rgb(244, 67, 54);" @click.prevent="deletepayment(pay.payment_id)">Delete</button>
                        
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div>
            <button type="button" class="btn btn-success" style="background-color: rgb(76, 175, 80)" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setpayment()">
                Add Payment
            </button>
        </div>
    </div>
    <div v-else> {{ error_message }}</div>


        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add/update payment</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                        <label for="type" class="form-label">Payment Mode</label>
                        <input type="text" class="form-control" id="type" placeholder="payment mode" v-model="payment.type" required></input>
                        </div>
                        <div>
                            <label for="card_number" class="form-label">cardNumber</label>
                            <input type="number" class="form-control" id="card_number" placeholder="card_number" v-model="payment.card_number" required></input>
                        </div>
                        <div>
                            <label for="cvv" class="form-label">cvv</label>
                            <input type="number" class="form-control" id="cvv" placeholder="" v-model="payment.cvv" required></input>
                        </div>
                        <div>
                            <label for="expiry_date" class="form-label">expiryDate</label>
                            <input type="date" class="form-control" id="" placeholder="expiry_date" v-model="payment.expiry_date" required></input>
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click.prevent="Add_update_payment()" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
    
    


    </div>
    `,
    data() {
        return {
            payments:[{
                payment_id:0,
                type:"",
                card_number:0,
                cvv:0,
                expiry_date:"",
            }],
            payment:{},
            success:true,
            error_message:"",
            apiBaseUrl: "http://127.0.0.1:5000/api/",
            successfirst:true
        }

    },
    
    
    methods:{
        
        async Add_update_payment() {
            console.log(this.payment.payment_id)
            if (this.payment.payment_id == 0) {
                const res = await fetch(`${this.apiBaseUrl}/payment`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.payment)
                })
                if (res.ok) {
                    this.payments= await this.get_payment()
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
            }
            else {
                
                const res = await fetch(`${this.apiBaseUrl}/payment/${this.payment.payment_id}`, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.payment)

                })
                if (res.ok) {
                    this.payments= await this.get_payment()
                }
                    else {
                        const errorData = await res.json()
                        this.success = false
                        this.error_message = errorData.error_message
                    }
                }

            },
        
        async deletepayment(id) {
            console.log(id)
            const res = await fetch(`${this.apiBaseUrl}/payment/${id}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("Auth_token")
                },

            })
            if (res.ok) {
                this.payments= await this.get_payment()
            }
            else {

                const errorData = await res.json();
                this.error_message = errorData.error_message;
            }
        },

        async setSelectedPayment(selpayment) {
            this.payment = selpayment;
            
        },
        async setpayment() {
            this.payment = {};
            this.payment.payment_id = 0;  
        },
    },
    created(){
        this.get_payment=useGetPayments
    },
    async mounted(){
        if(localStorage.getItem("Auth_token")){ 
            this.payments= await this.get_payment() 
          }
        else{
            this.successfirst=false
            this.error_message="You are not authorized to access this page. Please log in"
           }
        
    },
}
export default payment
