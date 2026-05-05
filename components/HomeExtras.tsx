'use client';

import type { FormEvent, JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: 'happening' | 'upcoming';
};

const initialReviews: Review[] = [
  {
    id: 'r1',
    name: 'Mia K.',
    rating: 5,
    comment: 'Amazing service and the food was so fresh. We will definitely order again!',
    date: 'Apr 26, 2026',
  },
  {
    id: 'r2',
    name: 'Jordan P.',
    rating: 4,
    comment: 'Great menu selection and quick delivery. The seats were comfortable too.',
    date: 'Apr 18, 2026',
  },
  {
    id: 'r3',
    name: 'Amina S.',
    rating: 5,
    comment: 'Loved the brunch event! Friendly staff and a lively atmosphere.',
    date: 'Apr 11, 2026',
  },
];

const workingHours = [
  { id: 'h1', label: 'Monday – Friday', time: '8:00am — 10:00pm' },
  { id: 'h2', label: 'Saturday', time: '9:00am — 11:00pm' },
  { id: 'h3', label: 'Sunday', time: '9:00am — 9:30pm' },
  { id: 'h4', label: 'Holiday hours', time: '10:00am — 8:00pm' },
];

const events: EventItem[] = [
  {
    id: 'e1',
    title: 'Live Jazz Brunch',
    date: 'May 10',
    time: '11:00am — 2:00pm',
    description: 'Enjoy a relaxed brunch menu with live jazz and specialty cocktails.',
    status: 'happening',
  },
  {
    id: 'e2',
    title: 'Sushi & Sake Night',
    date: 'May 17',
    time: '6:00pm — 10:00pm',
    description: 'Fresh sushi rolls, sake flights, and chef specials available all evening.',
    status: 'upcoming',
  },
  {
    id: 'e3',
    title: 'Wine Pairing Dinner',
    date: 'May 24',
    time: '7:00pm — 10:00pm',
    description: 'A curated five-course dinner with wine pairings from local vineyards.',
    status: 'upcoming',
  },
];

export default function HomeExtras(): JSX.Element {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !comment.trim()) {
      return;
    }

    setReviews((current) => [
      {
        id: `r-${Date.now()}`,
        name: name.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      },
      ...current,
    ]);

    setName('');
    setRating(5);
    setComment('');
    setSubmitted(true);

    window.setTimeout(() => {
      setSubmitted(false);
    }, 2600);
  };

  return (
    <section className="container section-stack home-extras">
      <div className="section-heading">
        <div>
          <p className="eyebrow">What’s happening</p>
          <h2>Hours, reviews, and community events</h2>
        </div>
      </div>

      <div className="home-feature-grid">
        <article className="card hours-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Working hours</p>
              <h3>Open every day for breakfast, lunch, and dinner</h3>
            </div>
          </div>
          <div className="hours-grid">
            {workingHours.map((hour) => (
              <div key={hour.id} className="hours-item">
                <strong>{hour.label}</strong>
                <span>{hour.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card events-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Events</p>
              <h3>Current and upcoming happenings</h3>
            </div>
          </div>
          <div className="events-list">
            {events.map((eventItem) => (
              <div key={eventItem.id} className="event-item">
                <div className="event-header">
                  <div>
                    <strong>{eventItem.title}</strong>
                    <p>{eventItem.description}</p>
                  </div>
                  <span className={`event-pill event-pill-${eventItem.status}`}>
                    {eventItem.status === 'happening' ? 'Happening now' : 'Upcoming'}
                  </span>
                </div>
                <div className="event-meta">
                  <span>{eventItem.date}</span>
                  <span>{eventItem.time}</span>
                </div>
                <Link href="/booking" className="btn btn-secondary reserve-seat-button">
                  Reserve a seat
                </Link>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="card reviews-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Customer reviews</p>
            <h3>Read reviews and share your experience</h3>
          </div>
        </div>

        <div className="reviews-grid">
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-meta">
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </div>
                <div className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>

          <form className="review-form" onSubmit={handleSubmit}>
            <label htmlFor="review-name">
              Name
              <input id="review-name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>

            <label htmlFor="review-rating">
              Rating
              <select id="review-rating" name="rating" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="review-comment">
              Review
              <textarea
                id="review-comment"
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience"
              />
            </label>

            <button type="submit" className="btn">
              Leave review
            </button>
            {submitted ? <small className="form-note">Thank you! Your review is now live.</small> : null}
          </form>
        </div>
      </article>
    </section>
  );
}
