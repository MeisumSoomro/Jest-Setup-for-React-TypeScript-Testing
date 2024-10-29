'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
  description: string;
  createdAt: Date;
  paymentMethod: {
    brand: string;
    last4: string;
  };
}

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  plan: {
    name: string;
    price: number;
    interval: 'month' | 'year';
  };
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const [transactionsRes, subscriptionRes, paymentMethodsRes] = await Promise.all([
        fetch('/api/payments/transactions'),
        fetch('/api/payments/subscription'),
        fetch('/api/payments/methods')
      ]);

      const [transactionsData, subscriptionData, paymentMethodsData] = await Promise.all([
        transactionsRes.json(),
        subscriptionRes.json(),
        paymentMethodsRes.json()
      ]);

      setTransactions(transactionsData);
      setSubscription(subscriptionData);
      setPaymentMethods(paymentMethodsData);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      toast.error('Failed to load payment information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/payments/subscription/cancel', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      const updatedSubscription = await response.json();
      setSubscription(updatedSubscription);
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch('/api/payments/methods/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId })
      });

      if (!response.ok) throw new Error('Failed to update default payment method');

      const updatedMethods = await response.json();
      setPaymentMethods(updatedMethods);
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Failed to update payment method:', error);
      toast.error('Failed to update payment method');
    }
  };

  if (isLoading) return <div>Loading payment information...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payments & Billing</h1>

      <Tabs defaultValue="subscription">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-4">
          <Card className="p-6">
            {subscription ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{subscription.plan.name}</h3>
                    <p className="text-gray-600">
                      ${subscription.plan.price}/{subscription.plan.interval}
                    </p>
                  </div>
                  <Button
                    variant={subscription.status === 'active' ? 'destructive' : 'outline'}
                    onClick={handleCancelSubscription}
                    disabled={subscription.status !== 'active'}
                  >
                    {subscription.status === 'active' ? 'Cancel Subscription' : 'Subscription Cancelled'}
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {subscription.status === 'active' ? (
                    <p>
                      Next billing date:{' '}
                      {format(new Date(subscription.currentPeriodEnd), 'PPP')}
                    </p>
                  ) : (
                    <p>
                      Access until:{' '}
                      {format(new Date(subscription.currentPeriodEnd), 'PPP')}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p>No active subscription</p>
                <Button onClick={() => router.push('/pricing')}>
                  View Plans
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {transactions.map(transaction => (
            <Card key={transaction.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.createdAt), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(transaction.amount / 100).toFixed(2)}
                  </p>
                  <p className={`text-sm ${
                    transaction.status === 'succeeded' ? 'text-green-500' :
                    transaction.status === 'failed' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          {paymentMethods.map(method => (
            <Card key={method.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Add card brand icon here */}
                  <div>
                    <p className="font-semibold">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      •••• {method.last4} | Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <Button
                  variant={method.isDefault ? 'default' : 'outline'}
                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                  disabled={method.isDefault}
                >
                  {method.isDefault ? 'Default' : 'Make Default'}
                </Button>
              </div>
            </Card>
          ))}
          <Button
            className="w-full"
            onClick={() => router.push('/payments/add-method')}
          >
            Add Payment Method
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
} 