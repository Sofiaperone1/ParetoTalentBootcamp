import { useEffect, useRef, useState } from "react";
import { startDictation, stopDictation } from "./dictate.js";
import {
  costRows,
  downloadCsv,
  formatDollars,
  hasText,
  monthlyTotal,
  rememberChoices,
  rowMonthly,
  sheetRows,
} from "./sheet.js";

const EXAMPLE_ROW = {
  task: "Reply to my emails.",
  outcome:
    "By 9am I only see the 5 emails that need my decision. The rest is handled.",
};

const EMPTY_ROWS = 4;

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm-7-3a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 0 2 0 8 8 0 0 1-7 7.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.07A8 8 0 0 1 4 12a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export default function SheetPage() {
  const panelRef = useRef(null);
  const [rows, setRows] = useState(() =>
    Array.from({ length: EMPTY_ROWS }, () => ({ task: "", outcome: "" })),
  );
  const [hours, setHours] = useState(() => Array(EMPTY_ROWS + 1).fill(""));
  const [hourly, setHourly] = useState("200");
  const [costOpened, setCostOpened] = useState(false);
  const [costPrompt, setCostPrompt] = useState(false);
  const [listeningKey, setListeningKey] = useState(null);
  const [micError, setMicError] = useState(null);

  const allRows = [EXAMPLE_ROW, ...rows];
  const total = monthlyTotal(allRows, hours, hourly);

  useEffect(() => {
    document.title = "What are these five tasks costing you?";
    return () => stopDictation();
  }, []);

  function updateRow(index, field, value) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  function setHour(index, value) {
    setHours((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function toggleMic(key, base, onText) {
    if (listeningKey === key) {
      stopDictation();
      setListeningKey(null);
      return;
    }

    setMicError(null);
    const started = startDictation({
      base,
      onText,
      onEnd: () => {
        setListeningKey((current) => (current === key ? null : current));
      },
      onError: (message) => {
        setMicError({ key, message });
        setListeningKey((current) => (current === key ? null : current));
      },
    });
    setListeningKey(started ? key : null);
  }

  function publish() {
    rememberChoices({ hourly, hours, total, rows: allRows });
  }

  function onSheet() {
    publish();
    downloadCsv("task-outcome-sheet.csv", sheetRows(allRows));
  }

  function onCosts() {
    if (!costOpened) {
      setCostPrompt(true);
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setCostPrompt(false);
    publish();
    downloadCsv("task-outcome-costs.csv", costRows(allRows, hours, hourly));
  }

  return (
    <main className="page">
      <p className="eyebrow">Free 10-minute sheet</p>
      <h1>What are these five tasks costing you?</h1>
      <p className="subhead">
        Write the result, not the task. Then see what those hours cost.
      </p>
      <p className="point">
        A task says what to do. A result says when it is finished. If you only
        write the task, the work comes back to you.
      </p>
      <ol className="steps">
        <li>Write the task the way you would say it today.</li>
        <li>
          Rewrite it as the finished day: by when, what you see, what you no
          longer touch.
        </li>
        <li>Open the panel below if you want the price.</li>
      </ol>

      <div className="sheet">
        <div className="sheet-head">
          <p>Task</p>
          <p>Outcome</p>
        </div>

        <div className="sheet-row">
          <div className="cell">
            <p className="cell-label">Task</p>
            <p className="locked">{EXAMPLE_ROW.task}</p>
          </div>
          <div className="cell">
            <p className="cell-label">Outcome</p>
            <p className="locked">{EXAMPLE_ROW.outcome}</p>
          </div>
        </div>

        {rows.map((row, index) => (
          <div className="sheet-row" key={index}>
            <Field
              label="Task"
              id={`task-${index}`}
              value={row.task}
              listening={listeningKey === `task-${index}`}
              error={micError?.key === `task-${index}` ? micError.message : ""}
              onChange={(value) => updateRow(index, "task", value)}
              onMic={() =>
                toggleMic(`task-${index}`, row.task, (value) =>
                  updateRow(index, "task", value),
                )
              }
            />
            <Field
              label="Outcome"
              id={`outcome-${index}`}
              value={row.outcome}
              listening={listeningKey === `outcome-${index}`}
              error={
                micError?.key === `outcome-${index}` ? micError.message : ""
              }
              onChange={(value) => updateRow(index, "outcome", value)}
              onMic={() =>
                toggleMic(`outcome-${index}`, row.outcome, (value) =>
                  updateRow(index, "outcome", value),
                )
              }
            />
          </div>
        ))}
      </div>

      <details
        className="panel"
        ref={panelRef}
        onToggle={(event) => {
          if (event.currentTarget.open) {
            setCostOpened(true);
            setCostPrompt(false);
          }
        }}
      >
        <summary>
          <span>Check how much this time is costing you.</span>
          <span className="chevron" aria-hidden="true" />
        </summary>
        <div className="panel-body">
          <label className="hourly" htmlFor="hourly-rate">
            What is one hour of your time worth?
            <input
              id="hourly-rate"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={hourly}
              onChange={(event) => setHourly(event.target.value)}
            />
          </label>

          {allRows.map((row, index) =>
            hasText(row) ? (
              <div className="cost-row" key={index}>
                <p className="cost-task" id={`cost-task-${index}`}>
                  {row.task.trim() || row.outcome.trim()}
                </p>
                <label className="hours" htmlFor={`hours-${index}`}>
                  Hours per week
                  <input
                    id={`hours-${index}`}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    aria-describedby={`cost-task-${index}`}
                    value={hours[index]}
                    onChange={(event) => setHour(index, event.target.value)}
                  />
                </label>
                <p className="cost-dollars">
                  {formatDollars(rowMonthly(hours[index], hourly))}
                </p>
              </div>
            ) : null,
          )}

          <p className="cost-total">
            <span>Monthly total</span>
            <span>{formatDollars(total)}</span>
          </p>
        </div>
      </details>

      <div className="actions">
        <button type="button" onClick={onSheet}>
          Get the sheet
        </button>
        <button type="button" onClick={onCosts}>
          Download with costs
        </button>
      </div>
      {costPrompt ? (
        <p className="cost-prompt" role="status">
          Open the cost panel first.
        </p>
      ) : null}

      <div id="ghl-form">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/9v3D1Wo4L04QGTFrVy0N"
          id="inline-9v3D1Wo4L04QGTFrVy0N"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Sofia Rodriguez - Qualifier form"
          data-height="465"
          data-layout-iframe-id="inline-9v3D1Wo4L04QGTFrVy0N"
          data-form-id="9v3D1Wo4L04QGTFrVy0N"
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
          title="Sofia Rodriguez - Qualifier form"
        />
      </div>

      <p className="closing">
        You get the sheet either way. If you are a fit, you will see a time to
        book a call about a Right Hand.
      </p>
    </main>
  );
}

function Field({ label, id, value, listening, error, onChange, onMic }) {
  return (
    <div className="cell">
      <label className="cell-label" htmlFor={id}>
        {label}
      </label>
      <div className="cell-input">
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className={listening ? "mic is-on" : "mic"}
          aria-pressed={listening}
          aria-label={label === "Task" ? "Dictate task" : "Dictate outcome"}
          onClick={onMic}
        >
          <MicIcon />
        </button>
      </div>
      {error ? <p className="mic-error">{error}</p> : null}
    </div>
  );
}
