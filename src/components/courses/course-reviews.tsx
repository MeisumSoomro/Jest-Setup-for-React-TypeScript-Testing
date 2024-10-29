import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, StarHalf } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

interface CourseReviewsProps {
  courseId: string
  reviews: Array<{
    id: string
    rating: number
    comment: string
    user: {
      name: string
      image: string
    }
    createdAt: Date
  }>
  userReview?: {
    rating: number
    comment: string
  }
}

export function CourseReviews({ courseId, reviews, userReview }: CourseReviewsProps) {
  const router = useRouter()
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [rating, setRating] = useState(userReview?.rating || 0)
  const [comment, setComment] = useState(userReview?.comment || '')
  const [submitting, setSubmitting] = useState(false)

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  const onSubmitReview = async () => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      })

      if (!response.ok) throw new Error('Failed to submit review')

      toast.success('Review submitted successfully')
      setShowReviewDialog(false)
      router.refresh()
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Course Reviews</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>

        {!userReview && (
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button>Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                />
                <Button
                  onClick={onSubmitReview}
                  disabled={submitting || !rating}
                  className="w-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {review.user.name}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="mt-2 text-gray-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 