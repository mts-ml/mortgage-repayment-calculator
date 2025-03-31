import { FormValues } from '../../App'
import emptyImg from '../../assets/images/illustration-empty.svg'

import './resultsStyle.scss'


interface ResultsProps {
   formValues: FormValues
   isSubmit: boolean
   formErrors: Partial<FormValues>
   monthlyPayment: number | null
   totalPayment: number | null
}


export const Results: React.FC<ResultsProps> = (props) => {

   function formatCurrency(value: number): string {
      if (value === null) {
         return "£0.00"
      }
      return value.toLocaleString('en-GB',
         {
            style: 'currency', currency: "GBP"
         }
      )
   }


   return (
      <aside>
         {Object.keys(props.formErrors).length === 0 && props.isSubmit ? (
            <div className="aside__full" aria-live='polite'>
               <h2 className="aside__title left">Your results</h2>

               <p className='aside__description left'>
                  Your results are shown below based on the information you provided.
                  To adjust the results, edit the form and click “calculate repayments” again.
               </p>

               <div className="aside__money">
                  <p className="aside__info">Your monthly repayments</p>

                  <span className="aside__payment-month">{formatCurrency(props?.monthlyPayment ?? 0)}
                  </span>

                  <hr className='aside__hr' />

                  <p className="aside__info">Total you will repay over the term</p>

                  <span className="aside__payment-total">{formatCurrency(props.totalPayment ?? 0)}</span>
               </div>
            </div>
         ) : (
            <div className="aside__empty">
               <img
                  className='aside__img'
                  src={emptyImg}
                  alt="Image of a calculator and money"
                  loading='lazy'
                  fetchPriority='high'
                  width={200}
                  height={300}
               />

               <h2 className="aside__title">Results shown here</h2>

               <p className='aside__description'>
                  Complete the form and click “calculate repayments” to see what your monthly repayments would be.
               </p>
            </div>
         )}
      </aside>
   )
}
