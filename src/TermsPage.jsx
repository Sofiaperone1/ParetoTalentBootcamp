import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms";
  }, []);

  return (
    <main className="page legal">
      <h1>Terms</h1>
      <p>
        This page gives you a free sheet. You write a task and the finished
        result. If you open the cost panel, the page prices those hours. You
        can download the file.
      </p>
      <p>
        The sentences you type stay on this device and in the file you
        download.
      </p>
      <p>
        If the form says you are a fit, you can book a call about Pareto
        Talent&apos;s Right Hand Program. The call is a conversation. Nothing
        on this page is a purchase.
      </p>
      <p>
        The Right Hand Program belongs to Pareto Talent. Prices published on
        paretotalent.com are theirs.
      </p>
    </main>
  );
}
