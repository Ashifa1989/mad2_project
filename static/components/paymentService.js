const baseUrl = "/api/payment"

export async function useGetPayments() {
    const res = await fetch(baseUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("Auth_token")
        },
    });
    const data = await res.json()
    return data;
      
}
