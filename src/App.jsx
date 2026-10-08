import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookCallPage from "./BookCallPage.jsx";
import CallBookedPage from "./CallBookedPage.jsx";
import PrivacyPage from "./PrivacyPage.jsx";
import SheetPage from "./SheetPage.jsx";
import SiteFooter from "./SiteFooter.jsx";
import TermsPage from "./TermsPage.jsx";
import ThankYouPage from "./ThankYouPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SheetPage />} />
        <Route path="/book-call" element={<BookCallPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/call-booked" element={<CallBookedPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}
