export const DisplayPrice = ( price ) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'LKR'
    }).format(price)
}