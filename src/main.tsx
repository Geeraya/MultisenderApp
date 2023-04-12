import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import { EthereumProvider } from "./context/EthereumProvider"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EthereumProvider>
      <App />
    </EthereumProvider>
  </React.StrictMode>
)
