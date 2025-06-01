import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard } from "lucide-react";

interface PaymentStepProps {
  paymentMethod: string;
  handlePaymentMethodChange: (value: string) => void;
  handleSubmitBooking: (status: string) => void;
  handlePreviousStep: () => void;
}

export function PaymentStep({
  paymentMethod,
  handlePaymentMethodChange,
  handleSubmitBooking,
  handlePreviousStep
}: PaymentStepProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Paiement</h2>
      
      <div className="space-y-6">
        <RadioGroup defaultValue={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <div className="border rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creditCard" id="creditCard" />
              <Label htmlFor="creditCard" className="font-medium">
                <span className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Carte de crédit
                </span>
              </Label>
            </div>
            <div className="mt-3 ml-6">
              <div className="mb-4">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input id="expiryDate" placeholder="MM/AA" />
                </div>
                <div>
                  <Label htmlFor="cvv">Code de sécurité</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div>
                <Label htmlFor="cardholderName">Nom sur la carte</Label>
                <Input id="cardholderName" placeholder="Jean Dupont" />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17.12 4.15C18.47 4.85 19 6.32 19 8.37c0 4.41-3.3 8.22-8 8.22h-2l-1 5.66h-2l-1-5.66H4l2-11.95h5.5c2.6 0 4.34.4 5.62 1.5z" fill="#3b7bbf" stroke="#3b7bbf"/></svg>
                PayPal
              </Label>
            </div>
            <p className="text-gray-600 text-sm ml-6 mt-2">
              Vous serez redirigé vers PayPal pour finaliser le paiement en toute sécurité.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="googlePay" id="googlePay" />
              <Label htmlFor="googlePay" className="font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 186 189" className="mr-2"><path d="M93 0C41.6 0 0 41.6 0 93c0 51.3 41.6 93 93 93 51.3 0 93-41.6 93-93C186 41.6 144.4 0 93 0z" fill="#4285F4"/></svg>
                Google Pay
              </Label>
            </div>
            <p className="text-gray-600 text-sm ml-6 mt-2">
              Payez rapidement et en toute sécurité avec Google Pay.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="applePay" id="applePay" />
              <Label htmlFor="applePay" className="font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 170 170" className="mr-2"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51z" fill="#333"/></svg>
                Apple Pay
              </Label>
            </div>
            <p className="text-gray-600 text-sm ml-6 mt-2">
              Payez rapidement et en toute sécurité avec Apple Pay.
            </p>
          </div>
        </RadioGroup>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="termsAccepted" required />
            <Label htmlFor="termsAccepted" className="text-sm">
              J'accepte les <a href="#" className="text-autowise-blue">conditions générales</a> et la <a href="#" className="text-autowise-blue">politique de confidentialité</a>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="saveCard" />
            <Label htmlFor="saveCard" className="text-sm">
              Enregistrer cette carte pour mes futures réservations
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 gap-2 flex-col md:flex-row">
        <Button variant="outline" onClick={handlePreviousStep}>
          Retour
        </Button>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmitBooking("pending")}
            className="w-full md:w-auto"
          >
            Confirmer la réservation sans paiement
          </Button>
          <Button
            onClick={() => handleSubmitBooking("paid")}
            className="bg-autowise-blue hover:bg-autowise-navy w-full md:w-auto"
          >
            Confirmer et payer
          </Button>
        </div>
      </div>
    </Card>
  );
}
