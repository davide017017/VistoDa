class BoxStatistiche extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render(stats = {}) {
    const {
      totale = 0,
      completati = 0,
      in_corso = 0,
      consigliati = 0,
      film = 0,
      serie = 0,
      anime = 0,
      standup = 0,
    } = stats;

    const pct = (n, tot) => (tot > 0 ? Math.round((n / tot) * 100) : 0);

    this.innerHTML = `
      <style>
        box-statistiche .vd-stats-section-label {
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #333;
          margin-bottom: 6px;
        }

        box-statistiche .vd-stat-rows {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 0.75rem;
        }

        box-statistiche .vd-stat-row {
          display: grid;
          grid-template-columns: 16px 70px 1fr 24px;
          align-items: center;
          gap: 8px;
        }

        box-statistiche .vd-stat-row i {
          font-size: 0.7rem;
          color: #444;
          text-align: center;
        }

        box-statistiche .vd-stat-row-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #444;
        }

        box-statistiche .vd-bar-track {
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
          overflow: hidden;
        }

        box-statistiche .vd-bar-fill {
          height: 100%;
          background: #8c7a5b;
          border-radius: 2px;
          opacity: 0.7;
        }

        box-statistiche .vd-stat-row-value {
          font-size: 0.7rem;
          font-weight: 700;
          color: #8c7a5b;
          font-family: 'JetBrains Mono', monospace;
          text-align: right;
        }

        box-statistiche .vd-stat-row.is-total .vd-stat-row-label { color: #666; }
        box-statistiche .vd-stat-row.is-total .vd-stat-row-value { color: #a8906a; font-size: 0.8rem; }
        box-statistiche .vd-stat-row.is-total .vd-bar-fill       { opacity: 1; }
      </style>

      <!-- STATO -->
      <div class="vd-stats-section-label">Stato</div>
      <div class="vd-stat-rows">
        ${this._row("bi-collection", "Totale", totale, 100, true)}
        ${this._row("bi-check2", "Visti", completati, pct(completati, totale))}
        ${this._row("bi-eye", "In corso", in_corso, pct(in_corso, totale))}
        ${this._row("bi-star", "Consigliati", consigliati, pct(consigliati, totale))}
      </div>

      <!-- CATEGORIA -->
      <div class="vd-stats-section-label">Categoria</div>
      <div class="vd-stat-rows">
        ${this._row("bi-film", "Film", film, pct(film, totale))}
        ${this._row("bi-tv", "Serie", serie, pct(serie, totale))}
        ${this._row("bi-play-circle", "Anime", anime, pct(anime, totale))}
        ${this._row("bi-mic", "Stand-up", standup, pct(standup, totale))}
      </div>
    `;
  }

  _row(icon, label, value, barPct, isTotal = false) {
    return `
      <div class="vd-stat-row${isTotal ? " is-total" : ""}">
        <i class="bi ${icon}"></i>
        <span class="vd-stat-row-label">${label}</span>
        <div class="vd-bar-track">
          <div class="vd-bar-fill" style="width:${barPct}%"></div>
        </div>
        <span class="vd-stat-row-value">${value}</span>
      </div>
    `;
  }

  computeFromMedia(mediaArray = []) {
    const stats = {
      totale: mediaArray.length,
      completati: mediaArray.filter((m) => m.status === "completed").length,
      in_corso: mediaArray.filter((m) => m.status === "watching").length,
      consigliati: mediaArray.filter((m) => m.status === "recommended").length,
      film: mediaArray.filter((m) => m.type === "film").length,
      serie: mediaArray.filter((m) => m.type === "serie").length,
      anime: mediaArray.filter((m) => m.type === "anime").length,
      standup: mediaArray.filter((m) => m.type === "standup").length,
    };
    this.render(stats);
  }

  update(stats) {
    this.render(stats);
  }
}

customElements.define("box-statistiche", BoxStatistiche);
