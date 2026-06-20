import { useEffect, useState } from "react";
import InfoIcon from "./icons/InfoIcon.jsx";

export default function Header({ tabs, activeTab, onTabChange }) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (!isInfoOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsInfoOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInfoOpen]);

  return (
    <header className="app-header">
      <h1>Amazon Sales</h1>
      <nav className="tab-nav" aria-label="Dashboard tabs">
        {tabs.map((tab) => (
          <button
            className={`tab-button ${activeTab === tab ? "is-active" : ""}`}
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="icon-button" type="button" aria-label="Dataset info" onClick={() => setIsInfoOpen(true)}>
          <InfoIcon />
        </button>
      </nav>
      {isInfoOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsInfoOpen(false)}>
          <section
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dataset-info-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="info-modal-header">
              <h2 id="dataset-info-title">Dataset Information</h2>
              <button className="modal-close" type="button" aria-label="Close dataset info" onClick={() => setIsInfoOpen(false)}>
                x
              </button>
            </div>
            <dl className="dataset-facts">
              <div>
                <dt>Source</dt>
                <dd>Kaggle</dd>
              </div>
              <div>
                <dt>Dataset</dt>
                <dd>Amazon Sales Analysis Cleaned Data</dd>
              </div>
              <div>
                <dt>Use</dt>
                <dd>Revenue, profit, product, payment, category, and regional sales analysis.</dd>
              </div>
            </dl>
            <a
              className="dataset-link"
              href="https://www.kaggle.com/datasets/litonislam/amazon-sales-analysis-cleaned-data"
              target="_blank"
              rel="noreferrer"
            >
              Open dataset on Kaggle
            </a>
          </section>
        </div>
      )}
    </header>
  );
}
