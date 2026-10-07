import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    document.title = "Your sheet is on its way. Check your email.";
  }, []);

  return (
    <main className="page">
      <h1>Your sheet is on its way. Check your email.</h1>
    </main>
  );
}
