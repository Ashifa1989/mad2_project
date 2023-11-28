import { useGetAddresses } from './addressService.js'
const address = {
    template: `
<div> 
<div v-if="success">
    <div class="row row-cols-1 row-cols-md-4 g-4">
        <div v-if="success" v-for="address in addresses">
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <div>{{ address.street }}</div>
                        <div>{{ address.city }}</div>
                        <div>{{ address.state }}</div>

                        <div>{{ address.postal_code }}</div>
                    </div>
                    <div class="card-footer">
                    <button type="button" class="btn btn-primary col-md-5" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setSelectedAddress(address)"> Update</button>
                    <button class="btn btn-secondary col-md-5" @click.prevent="deleteAddress(address.address_id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>
    <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="setAddress()">
            Add Address
        </button>
    </div>
    </div>
    <div v-else> {{ error_message }}</div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add/update address</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <label for="street" class="form-label">Street name:</label>
                        <input type="text" class="form-control" id="Name" placeholder="Enter street name" v-model="address.street" required></input>
                    </div>
                    <div>
                        <label for="city" class="form-label">City:</label>
                        <input type="text" class="form-control" id="city" v-model="address.city" placeholder="Enter city name"></input>
                    </div>
                    <div>
                        <label for="state" class="form-label">State:</label>
                        <input type="text" class="form-control" id="price_per_unit" v-model="address.state" placeholder="Enter state name"></input>
                    </div>
                    <div>
                        <label for="postal_code" class="form-label">Postal code:</label>
                        <input type="text" class="form-control" id="stock" v-model="address.postal_code" placeholder="Enter postal code"></input>
                    </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" @click.prevent="Add_update_address()" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
    
</div>`,
    data() {
        return {
            addresses: [{
                username: "",
                street: "",
                city: "",
                State: "",
                postal_code: "",
            }],
            address: {},
            success: true,
            message: "",
            error_message: "",
            apiBaseUrl: "http://127.0.0.1:5000/api/"
        }
    },
    methods: {
        async Add_update_address() {

            if (this.address.address_id == 0) {
                console.log(this.address.address_id)
                const res = await fetch("http://127.0.0.1:5000/api/address", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.address)
                })
                if (res.ok) {
                    this.addresses = await this.getAddress()
                }
                else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }
            }
            else {
                //print(this.address.address_id)
                const res = await fetch(`http://127.0.0.1:5000/api/address/${this.address.address_id}`, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("Auth_token")
                    },
                    body: JSON.stringify(this.address)

                })
                if (res.ok) {
                    this.addresses = await this.getAddress()
                } else {
                    const errorData = await res.json()
                    this.success = false
                    this.error_message = errorData.error_message
                }

            }
        },
        async deleteAddress(id) {
            const response = await fetch(`http://127.0.0.1:5000/api/address/${id}`, {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("Auth_token")
                },
            })
            if (response.ok) {
                console.log("deleted the address details successfully")
                this.addresses = await this.getAddress()
            }
            else {
                const errorData = await response.json();
                this.message = errorData.error_message;
            }
        },
        async setSelectedAddress(selAddress) {
            this.address = selAddress;
        },
        async setAddress() {
            // console.log("hi")
            this.address = {};
            this.address.address_id = 0;
        }
    },
    created() {
        this.getAddress = useGetAddresses
    },
    async mounted() {
        
        if(localStorage.getItem("Auth_token")){ 
            this.addresses = await this.getAddress()
           }
        else{
            this.success=false
            this.error_message="You are not authorized to access this page. Please log in"
           }
    }
}

export default address