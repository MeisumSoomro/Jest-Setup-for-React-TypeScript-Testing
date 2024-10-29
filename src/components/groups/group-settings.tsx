import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Group } from '@prisma/client'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface GroupSettingsProps {
  group: Group
}

export function GroupSettings({ group }: GroupSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    domain: group.domain || '',
    subscriptionPrice: group.subscriptionPrice || 9900,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update group')

      toast.success('Group updated successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const setupStripeConnect = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id })
      })

      if (!response.ok) throw new Error('Failed to setup Stripe')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to setup Stripe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
        </div>
        {group.type === 'PAID' && (
          <>
            <div>
              <Label htmlFor="domain">Custom Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                disabled={loading}
                placeholder="your-domain.com"
              />
            </div>
            <div>
              <Label htmlFor="price">Subscription Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.subscriptionPrice / 100}
                onChange={(e) => setFormData({ ...formData, subscriptionPrice: parseInt(e.target.value) * 100 })}
                disabled={loading}
                min="0"
              />
            </div>
          </>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>

      {group.type === 'PAID' && !group.stripeConnectId && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Setup Payments</h3>
          <p className="text-sm text-gray-500 mb-4">
            Connect your Stripe account to start accepting payments
          </p>
          <Button onClick={setupStripeConnect} disabled={loading}>
            {loading ? 'Setting up...' : 'Setup Stripe Connect'}
          </Button>
        </div>
      )}
    </div>
  )
} 