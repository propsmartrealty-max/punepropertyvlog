export const WEB3FORMS_ACCESS_KEY = "ebf820bf-ff2c-474d-aaed-9bd0a39aa9de"; // From past conversation 8b342d78-bc31-4f27-a2c9-12c99d6ea0c1

export const sendLeadEmailNotification = async (leadData: any) => {
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `New Lead: ${leadData.type} - ${leadData.name}`,
                from_name: "Pune Property Vlog Admin",
                ...leadData,
            }),
        });
        const result = await response.json();
        if (!result.success) {
            console.error("Web3Forms error:", result);
        }
    } catch (error) {
        console.error("Web3Forms fetch error:", error);
    }
};
