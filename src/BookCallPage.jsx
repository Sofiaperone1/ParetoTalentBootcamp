import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDollars } from "./sheet.js";

export default function BookCallPage() {
  const [params] = useSearchParams();
  const rawTotal = params.get("total");
  const hasTotal = rawTotal != null && rawTotal !== "" && Number(rawTotal) > 0;
  const title = hasTotal
    ? `These tasks cost you ${formatDollars(rawTotal)} a month. A Right Hand takes that work.`
    : "Book a call about a Right Hand.";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main className="page">
      <h1>{title}</h1>
      <div id="ghl-calendar">
        {/* Pegá acá el iframe del calendario de GoHighLevel. */}
      </div>
    </main>
  );
}
