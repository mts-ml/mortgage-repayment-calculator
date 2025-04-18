import { useEffect, useState } from "react"
import { Results } from "./components/Results/Results"
import calculatorIcon from './assets/images/icon-calculator.svg'
import clsx from 'clsx'

import './styles/globalStyle.scss'


export interface FormValues {
  mortgageAmount: string
  mortgageTerm: string
  interestRate: string
  mortgageType: string
}


function App() {
  const initialValues: FormValues = {
    mortgageAmount: '',
    mortgageTerm: '',
    interestRate: '',
    mortgageType: ''
  }

  const [formValues, setFormValues] = useState<FormValues>(initialValues)

  const [formErrors, setFormErrors] = useState<Partial<FormValues>>({})

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const [totalPayment, setTotalPayment] = useState<number | null>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Setting it to false on every change, makes necessary to click the button every time
    setIsSubmit(false)

    const { name, value } = event.currentTarget
    setFormValues(prevState => (
      {
        ...prevState,
        [name]: value
      }
    ))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The correct approach is to use the variable, setting the state directly may cause an error,
    // the state may be outdated.
    const errors = validate(formValues)
    setFormErrors(errors)

    Object.keys(errors).length === 0 ? setIsSubmit(true) : setIsSubmit(false)
  }

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const mortgageAmount = parseFloat(formValues.mortgageAmount)
      const mortgageTerm = parseFloat(formValues.mortgageTerm)
      const interestRate = parseFloat(formValues.interestRate)
      const mortgageType = formValues.mortgageType

      const monthlyInterestRate = interestRate / 100 / 12
      const totalPayments = mortgageTerm * 12

      let monthlyPayment: number = 0
      let totalPayment: number = 0

      if (mortgageType === 'repayment') {
        const x = Math.pow(1 + monthlyInterestRate, totalPayments)
        monthlyPayment = mortgageAmount * monthlyInterestRate * x / (x - 1)
        totalPayment = monthlyPayment * totalPayments
      } else if (mortgageType === 'interest-only') {
        monthlyPayment = mortgageAmount * monthlyInterestRate
        totalPayment = monthlyPayment * totalPayments
      }

      setMonthlyPayment(monthlyPayment)
      setTotalPayment(totalPayment)
    }
  }, [formErrors, formValues, isSubmit])


  function validate(values: FormValues): Partial<FormValues> {
    const errors: Partial<FormValues> = {}

    if (!values.mortgageAmount) {
      errors.mortgageAmount = "This field is required."
    } else if (isNaN(Number(values.mortgageAmount)) || Number(values.mortgageAmount.trim()) <= 0) {
      errors.mortgageAmount = "You need to enter a number higher than 0."
    }

    if (!values.mortgageTerm) {
      errors.mortgageTerm = "This field is required."
    } else if (Number(values.mortgageTerm) <= 0 || isNaN(Number(values.mortgageTerm.trim()))) {
      errors.mortgageTerm = "You need to enter a number higher than 0."
    }

    if (!values.interestRate) {
      errors.interestRate = "This field is required."
    } else if (Number(values.interestRate) <= 0 || Number(values.interestRate) > 100 || isNaN(Number(values.interestRate.trim()))) {
      errors.interestRate = "You need to enter a number between 0 - 100."
    }

    if (!values.mortgageType) {
      errors.mortgageType = "This field is required."
    }
    return errors
  }

  function clearAll() {
    setFormValues(initialValues)
    setFormErrors({})
    setIsSubmit(false)
    setMonthlyPayment(null)
    setTotalPayment(null)
  }


  return (
    <>
      <main>
        <div className="main__intro">
          <h1 className="main__title">Mortgage Calculator</h1>

          <button
            type="button"
            onClick={clearAll}
            className="main__clear"
          >
            Clear All Fields
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* MORTGAGE AMOUNT */}
          <label className="main__label" htmlFor="mortgageAmount">Mortgage Amount</label>

          <div className={clsx("main__mortgage-div", { error: formErrors?.mortgageAmount })}>
            <span className="main__mortgage-span">£</span>

            <input
              className="main__input"
              type="text"
              id="mortgageAmount"
              name="mortgageAmount"
              onChange={handleChange}
              value={formValues.mortgageAmount}
              aria-describedby="mortgageAmountError"
            />
          </div>

          <p
            id="mortgageAmountError"
            className="formErrors"
            aria-live="polite"
          >
            {formErrors.mortgageAmount}
          </p>

          {/* MORTGAGE TERM */}
          <div className="mortage">
            <label className="main__label" htmlFor="mortgageTerm">Mortgage Term</label>

            <div className={clsx("main__mortgage-div", { error: formErrors?.mortgageTerm })}>
              <input
                className="main__input right"
                type="text"
                id="mortgageTerm"
                name="mortgageTerm"
                onChange={handleChange}
                value={formValues.mortgageTerm}
                aria-describedby="mortgageTermError"
              />

              <span className="main__mortgage-span right">years</span>

            </div>

            <p
              id="mortgageTermError"
              className="formErrors"
              aria-live="polite"
            >
              {formErrors.mortgageTerm}
            </p>

            {/* INTEREST RATE */}
            <label className="main__label" htmlFor="interestRate">Interest Rate</label>

            <div className={clsx("main__mortgage-div", { error: formErrors?.interestRate })}>
              <input
                className="main__input right"
                type="text"
                id="interestRate"
                name="interestRate"
                onChange={handleChange}
                value={formValues.interestRate}
                aria-describedby="interestRateError"
              />

              <span className="main__mortgage-span right">%</span>
            </div>

            <p
              id="interestRateError"
              className="formErrors"
              aria-live="polite"
            >
              {formErrors.interestRate}
            </p>

          </div>

          {/* INPUT RADIO */}
          <fieldset
            className={clsx("main__fieldset-radio", { error: formErrors?.mortgageType })}
            role="radiogroup"
          >

            <legend className="main__label">Morgtage Type</legend>

            <div className="main__radio-div">
              <input type="radio"
                className="main__radio"
                id="mortgageType1"
                name="mortgageType"
                value={'repayment'}
                checked={formValues.mortgageType === 'repayment'}
                onChange={handleChange}
                aria-describedby="mortgageInputRadioError"
              />

              <label htmlFor="mortgageType1">Repayment</label>
            </div>

            <div className="main__radio-div">
              <input
                className="main__radio"
                type="radio"
                id="mortgageType2"
                name="mortgageType"
                value={'interest-only'}
                checked={formValues.mortgageType === 'interest-only'}
                onChange={handleChange}
                aria-describedby="mortgageInputRadioError"
              />

              <label htmlFor="mortgageType2">Interest Only</label>
            </div>
          </fieldset>

          <p
            id="mortgageInputRadioError"
            className="formErrors formInputRadio"
            aria-live="polite"
          >
            {formErrors.mortgageType}
          </p>

          <button className="btn" type="submit">
            <img src={calculatorIcon} alt="Icon of a calculator" />

            Calculate Repayments
          </button>
        </form>
      </main>

      <Results
        formValues={formValues}
        isSubmit={isSubmit}
        formErrors={formErrors}
        monthlyPayment={monthlyPayment}
        totalPayment={totalPayment}
      />
    </>
  )
}

export default App
