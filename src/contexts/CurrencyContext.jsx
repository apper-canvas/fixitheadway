import React, { createContext, useContext, useState, useEffect } from 'react'
import currencyService from '@/services/api/currencyService'

const CurrencyContext = createContext()

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD')
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExchangeRates()
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('fixit-currency')
    if (savedCurrency && currencyService.getSupportedCurrencies().find(c => c.code === savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  const loadExchangeRates = async () => {
    try {
      const rates = await currencyService.getExchangeRates()
      setExchangeRates(rates)
    } catch (error) {
      console.error('Failed to load exchange rates:', error)
    } finally {
      setLoading(false)
    }
  }

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    localStorage.setItem('fixit-currency', newCurrency)
  }

  const formatCurrency = (amount, targetCurrency = null) => {
    const currencyToUse = targetCurrency || currency
    return currencyService.formatCurrency(amount, currencyToUse)
  }

  const convertAmount = (amount, fromCurrency, toCurrency = null) => {
    const targetCurrency = toCurrency || currency
    return currencyService.convertAmount(amount, fromCurrency, targetCurrency)
  }

  const value = {
    currency,
    setCurrency: changeCurrency,
    exchangeRates,
    loading,
    formatCurrency,
    convertAmount,
    supportedCurrencies: currencyService.getSupportedCurrencies(),
    getCurrencySymbol: currencyService.getCurrencySymbol
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export default CurrencyContext