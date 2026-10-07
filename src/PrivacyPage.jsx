import { useEffect } from "react";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy";
  }, []);

  return (
    <main className="page legal">
      <h1>Privacy</h1>
      <p>
        The form on this page asks for your name, your email, and three yes or
        no questions.
      </p>
      <p>
        If you open the cost panel, the page also passes your hourly rate, the
        hours per task, and the monthly total into that form. It does not send
        the words you wrote in the task and outcome boxes.
      </p>
      <p>
        Your answers are used to email you the sheet and to decide whether to
        show a time to book a call. They are stored in GoHighLevel. This page
        does not sell them.
      </p>
      <p>
        To ask about your information, or to have it removed, write to
        sofiarpm62@gmail.com.
      </p>
    </main>
  );
}
