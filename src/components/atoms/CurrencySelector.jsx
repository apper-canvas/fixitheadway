import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { useCurrency } from '@/contexts/CurrencyContext'

const CurrencySelector = ({ className = '' }) => {
  const { currency, setCurrency, supportedCurrencies } = useCurrency()

  return (
    <div className={`relative ${className}`}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="appearance-none bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
      >
        {supportedCurrencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ApperIcon name="ChevronDown" size={14} className="text-surface-400" />
      </div>
    </div>
  )
}

export default CurrencySelector