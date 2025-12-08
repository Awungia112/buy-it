"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProductRatingProps {
  productId: string;
  currentRating?: number;
  totalRatings?: number;
  userRating?: number;
  onRatingSubmit?: (rating: number, comment?: string) => void;
}

export function ProductRating({
  productId,
  currentRating = 4.2,
  totalRatings = 42,
  userRating,
  onRatingSubmit,
}: ProductRatingProps) {
  const { data: session } = useSession();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleRatingClick = (rating: number) => {
    if (!session) return;
    setSelectedRating(rating);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (onRatingSubmit && selectedRating > 0) {
      onRatingSubmit(selectedRating, comment);
      setShowForm(false);
      setComment("");
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const filled = starValue <= rating;

      return (
        <button
          key={i}
          type="button"
          className={`text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${
            interactive ? "cursor-pointer hover:text-yellow-500 hover:scale-110" : ""
          } ${filled ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"}`}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && handleRatingClick(starValue)}
          disabled={!interactive}
          aria-label={interactive ? `Rate ${starValue} star${starValue !== 1 ? 's' : ''}` : undefined}
        >
          {filled ? "★" : "☆"}
        </button>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Rating Display */}
      <div className="flex items-center gap-4" role="group" aria-label={`Product rating: ${currentRating.toFixed(1)} out of 5 stars`}>
        <div className="flex items-center gap-1" aria-hidden="true">
          {renderStars(Math.round(currentRating))}
        </div>
        <span className="text-xl font-bold text-black dark:text-white" aria-label={`${currentRating.toFixed(1)} out of 5 stars`}>
          {currentRating.toFixed(1)}
        </span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-300" aria-label={`${totalRatings} customer reviews`}>
          ({totalRatings} reviews)
        </span>
      </div>

      {/* User Rating Section */}
      {session && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-base font-semibold text-black dark:text-white mb-3" id="rating-section">
            Rate this product
          </h4>
          <div className="flex items-center gap-2" role="group" aria-labelledby="rating-section">
            {renderStars(hoverRating || selectedRating, true)}
            {selectedRating > 0 && (
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300 ml-2" aria-live="polite">
                You rated: {selectedRating} star
                {selectedRating !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {showForm && (
            <div className="mt-4 space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedRating(0);
                    setComment("");
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!session && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            <Link
              href="/api/auth/signin"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>{" "}
            to rate and review this product
          </p>
        </div>
      )}
    </div>
  );
}
