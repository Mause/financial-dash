import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-supabase-fp";
import { createClient } from "@supabase/supabase-js";
import "bulma/css/bulma.css";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { AuthProvider } from "./auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Jetbrains } from "./jetbrains";

const dsn = process.env.REACT_APP_SENTRY_DSN;
if (dsn)
  Sentry.init({
    dsn,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!,
);

ReactDOM.render(
  <React.StrictMode>
    <Provider value={supabase}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/jetbrains" element={<Jetbrains />} />
            <Route path="/" element={<App />} index />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
