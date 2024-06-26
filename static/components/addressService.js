const baseUrl= "http://127.0.0.1:5000/api/address"
export async function useGetAddresses() {
    const res = await fetch(baseUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("Auth_token")
        },
    });
    if (res.ok){
        const data = await res.json()
        return data; 
    }
      
}
