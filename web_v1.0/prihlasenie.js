const prihlasenieForm = document.querySelector("#prihlasenieForm");
const vysledokEl = document.querySelector("#vysledok");
const klucPouzivatela = "prihlasenyPouzivatel";

function zobrazSpravu(text, uspesna) {
  const sprava = document.createElement("p");
  sprava.textContent = text;
  sprava.style.color = uspesna ? "green" : "red";
  vysledokEl.replaceChildren(sprava);
}

function zobrazPouzivatela(pouzivatel) {
  vysledokEl.replaceChildren();

  const info = document.createElement("p");
  info.style.color = "green";
  info.textContent = `Prihlásený používateľ: ${pouzivatel.meno} (${pouzivatel.email})`;

  const odhlasitBtn = document.createElement("button");
  odhlasitBtn.type = "button";
  odhlasitBtn.className = "submit-btn";
  odhlasitBtn.textContent = "Odhlásiť sa";
  odhlasitBtn.addEventListener("click", () => {
    sessionStorage.removeItem(klucPouzivatela);
    zobrazSpravu("Boli ste odhlásený.", true);
  });

  vysledokEl.append(info, odhlasitBtn);
}

function zobrazStavPrihlasenia() {
  const ulozeny = sessionStorage.getItem(klucPouzivatela);
  if (!ulozeny) return;

  let pouzivatel;
  try {
    pouzivatel = JSON.parse(ulozeny);
  } catch (error) {
    sessionStorage.removeItem(klucPouzivatela);
    zobrazSpravu("Uložené údaje prihlásenia sú neplatné. Prihláste sa znova.", false);
    return;
  }

  if (!pouzivatel || typeof pouzivatel.meno !== "string"
    || typeof pouzivatel.email !== "string") {
    sessionStorage.removeItem(klucPouzivatela);
    zobrazSpravu("Uložené údaje prihlásenia sú neplatné. Prihláste sa znova.", false);
    return;
  }

  zobrazPouzivatela(pouzivatel);
}

if (prihlasenieForm) {
  prihlasenieForm.addEventListener("submit", async udalost => {
    udalost.preventDefault();
    vysledokEl.replaceChildren();

    const odoslat = prihlasenieForm.querySelector('button[type="submit"]');
    odoslat.disabled = true;
    try {
      const udaje = {
        email: document.querySelector("#email").value,
        heslo: document.querySelector("#heslo").value
      };
      const odpoved = await fetch("/api/prihlasenie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(udaje)
      });
      const data = await odpoved.json();
      if (!odpoved.ok) {
        throw new Error(data.sprava || `Chyba servera (${odpoved.status})`);
      }
      if (!data.pouzivatel) {
        throw new Error("Server nevrátil údaje používateľa.");
      }

      sessionStorage.setItem(klucPouzivatela, JSON.stringify(data.pouzivatel));
      prihlasenieForm.reset();
      zobrazStavPrihlasenia();
    } catch (error) {
      zobrazSpravu(`Prihlásenie sa nepodarilo: ${error.message}`, false);
    } finally {
      odoslat.disabled = false;
    }
  });
}

zobrazStavPrihlasenia();
