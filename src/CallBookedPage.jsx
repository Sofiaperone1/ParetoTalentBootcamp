import { useEffect } from "react";

export default function CallBookedPage() {
  useEffect(() => {
    document.title = "You're booked.";
  }, []);

  return (
    <main className="page">
      <h1>You're booked.</h1>
      <p className="subhead">
        Check your email for the time. A reminder arrives before the call.
      </p>

      <p className="point">What happens next</p>
      <ol className="steps">
        <li>Show up at the time in the email.</li>
        <li>Walk through the five tasks and what they cost.</li>
        <li>
          The call decides whether a Right Hand should take that work. If it is
          a fit, the next step is 3 hand-picked profiles within 24 hours. You
          interview them and choose. If none feel right, you owe nothing.
        </li>
      </ol>

      <p className="point">How to prepare</p>
      <ol className="steps">
        <li>Keep the sheet open.</li>
        <li>Know what one hour of your time is worth.</li>
        <li>
          Know whether you are the person who will work with the Right Hand.
        </li>
      </ol>
    </main>
  );
}
