import { get } from './'

const getOrderPricing = async () => {
  try {
    const response = await get('https://products.loginextsolutions.com/ClientApp/zoho/defaultPlans/website?currencyCode=USD&subscriptionType=TRANSACTIONBASED')
    return response.data
  } catch (error) {
    return {}
  }
}

const getDriverPricing = async () => {
  try {
    const { data } = await get('https://products.loginextsolutions.com/ClientApp/zoho/defaultPlans/website?currencyCode=USD&subscriptionType=RESOURCEBASED')
    return data
  } catch (error) {
    return {}
  }
}

export {
  getOrderPricing,
  getDriverPricing
}
