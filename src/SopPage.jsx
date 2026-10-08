import { useEffect } from "react";

export default function SopPage() {
  useEffect(() => {
    document.title = "SOP: launch the sheet";
  }, []);

  return (
    <main className="page legal">
      <h1>SOP: launch the sheet</h1>
      <p>
        Purpose: publish the free sheet, qualify the founder, and book a call
        about a Right Hand. Same steps the next time this lead magnet launches.
      </p>
      <p>Owner: Sofia Perone. Tool: the live page plus GoHighLevel.</p>
      <ol className="steps">
        <li>Open the live page and confirm the form and the calendar load.</li>
        <li>
          Send a test that qualifies. It must land on the booking page.
        </li>
        <li>
          Send a test that does not qualify. It must land on the thank-you
          page and still receive the sheet.
        </li>
        <li>Book a test time. It must land on the page after booking.</li>
        <li>
          Check the pipeline moved, and that only this form triggers the
          workflow.
        </li>
        <li>
          Confirm the qualified-not-booked emails point at the booking page,
          and the unqualified email points at the sheet.
        </li>
      </ol>
      <p className="point">Pages</p>
      <ol className="steps">
        <li>https://pareto-talent-bootcamp.vercel.app/</li>
        <li>https://pareto-talent-bootcamp.vercel.app/book-call</li>
        <li>https://pareto-talent-bootcamp.vercel.app/thank-you</li>
        <li>https://pareto-talent-bootcamp.vercel.app/call-booked</li>
      </ol>
    </main>
  );
}
