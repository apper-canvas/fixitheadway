class CurrencyService {
  constructor() {
    this.exchangeRates = {
      USD: 1,
      INR: 83.12 // Updated exchange rate (1 USD = 83.12 INR)
    }
    this.defaultCurrency = 'USD'
  }

  async getExchangeRates() {
    await this.delay(200)
    return { ...this.exchangeRates }
  }

  convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / this.exchangeRates[fromCurrency]
    return usdAmount * this.exchangeRates[toCurrency]
  }

  formatCurrency(amount, currency = 'USD', locale = null) {
    const currencyConfig = {
      USD: {
        locale: 'en-US',
        options: {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      },
      INR: {
        locale: 'en-IN',
        options: {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      }
    }

    const config = currencyConfig[currency] || currencyConfig.USD
    const formatLocale = locale || config.locale

    try {
      return new Intl.NumberFormat(formatLocale, config.options).format(amount)
    } catch (error) {
      // Fallback formatting
      const symbol = currency === 'INR' ? '₹' : '$'
      return `${symbol}${amount.toLocaleString(formatLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
  }

  getSupportedCurrencies() {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' }
    ]
  }

  getCurrencySymbol(currency) {
    const symbols = {
      USD: '$',
      INR: '₹'
    }
    return symbols[currency] || '$'
  }
async simulateCurrencyUpdate() {
    // Simulate network delay for currency updates
    await this.delay(800)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new CurrencyService()