export const useEnvironment = (): "LOCAL" | "DESARROLLO" | "QA" | "PRODUCCION" => {

    const fullUrl = typeof window !== "undefined" ? window.location.href : "";
    if (fullUrl.includes("frontoffice.127.0.0.1")) {
        return "LOCAL";
    }
    if (fullUrl.includes("erp-dev")) {
        return "DESARROLLO";
    }
    if (fullUrl.includes("erp-qa")) {
        return "QA";
    }
    return "PRODUCCION";   
}