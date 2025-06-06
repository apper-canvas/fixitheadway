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
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)

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
      setUpdateError('Failed to load exchange rates')
    } finally {
      setLoading(false)
    }
  }

  const changeCurrency = async (newCurrency) => {
    if (newCurrency === currency) return
    
    setIsUpdating(true)
    setUpdateError(null)
    
    try {
      // Simulate currency update process
      await currencyService.simulateCurrencyUpdate()
      
      setCurrency(newCurrency)
      localStorage.setItem('fixit-currency', newCurrency)
      
      // Force re-render of all components using currency
      setTimeout(() => {
        setIsUpdating(false)
      }, 200)
      
    } catch (error) {
      console.error('Failed to update currency:', error)
      setUpdateError('Failed to update currency')
      setIsUpdating(false)
    }
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
    isUpdating,
    updateError,
    formatCurrency,
    convertAmount,
    supportedCurrencies: currencyService.getSupportedCurrencies(),
    getCurrencySymbol: currencyService.getCurrencySymbol
  }

  return (
    <CurrencyContext.Provider value={value}>
      <div className={isUpdating ? 'currency-updating' : ''}>
        {children}
      </div>
    </CurrencyContext.Provider>
  )
}

export default CurrencyContext