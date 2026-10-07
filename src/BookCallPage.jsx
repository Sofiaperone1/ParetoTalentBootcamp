import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDollars } from "./sheet.js";

export default function BookCallPage() {
  const [params] = useSearchParams();
  const amount = formatDollars(params.get("total") ?? 0);
  const title = `These tasks cost you ${amount} a month. A Right Hand takes that work.`;

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
