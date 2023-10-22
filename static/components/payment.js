const payment={
    template :`
    <form>
        <div class="mb-3">
        <label for="Name" class="form-label">Name on Card</label>
        <input type="text" class="form-control" id="name" placeholder="name" v-model="address.name" required></input>
        </div>
        <div class="mb-3">
        <label for="card_number" class="form-label">cardNumber</label>
        <input type="number" class="form-control" id="card_number" placeholder="card_number" v-model="address.card_number" required></input>
        </div>
        <div class="mb-3">
        <label for="cvv" class="form-label">cvv</label>
        <input type="number" class="form-control" id="cvv" placeholder="" v-model="address.cvv" required></input>
        </div>
        <div class="mb-3">
        <label for="expiry_date" class="form-label">expiryDate</label>
        <input type="date" class="form-control" id="" placeholder="expiry_date" v-model="address.expiry_date" required></input>
        </div>
        
    </form>
    `
}