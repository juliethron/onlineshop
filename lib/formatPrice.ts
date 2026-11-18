
    const nokFormatter = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    });

    export function formatPrice(price: number): string {
    return nokFormatter.format(price);
    }
