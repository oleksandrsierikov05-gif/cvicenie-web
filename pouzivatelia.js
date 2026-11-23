const registraciaForm = document.querySelector("#registraciaForm");
const zoznamPouzivatelov = document.querySelector("#zoznamPouzivatelov");
const spravaEl = document.querySelector("#sprava");
const chybaEl = document.querySelector("#chyba");

async function textOdpovede(odpoved) {
  const text = await odpoved.text();
  return text || `Chyba servera (${odpoved.status})`;
}

async function nacitajPouzivatelov() {
  if (chybaEl) chybaEl.textContent = "";
  zoznamPouzivatelov.replaceChildren();

  try {
    const odpoved = await fetch("/api/pouzivatelia");
    if (!odpoved.ok) {
      throw new Error(await textOdpovede(odpoved));
    }

    const pouzivatelia = await odpoved.json();
    if (!Array.isArray(pouzivatelia)) {
      throw new Error("Server vrátil neočakávaný formát údajov.");
    }

    if (pouzivatelia.length === 0) {
      const riadok = document.createElement("tr");
      const bunka = document.createElement("td");
      bunka.colSpan = 4;
      bunka.textContent = "Zatiaľ nie sú zaregistrovaní žiadni používatelia.";
      riadok.append(bunka);
      zoznamPouzivatelov.append(riadok);
      return;
    }

    for (const pouzivatel of pouzivatelia) {
      const riadok = document.createElement("tr");
      for (const hodnota of [pouzivatel.id, pouzivatel.meno, pouzivatel.email]) {
        const bunka = document.createElement("td");
        bunka.textContent = hodnota ?? "";
        riadok.append(bunka);
      }

      const akciaBunka = document.createElement("td");
      const vymazBtn = document.createElement("button");
      vymazBtn.type = "button";
      vymazBtn.className = "table-action-button";
      vymazBtn.textContent = "Vymazať";
      vymazBtn.setAttribute("aria-label", `Vymazať používateľa ${pouzivatel.email}`);
      vymazBtn.addEventListener("click", () => vymazPouzivatela(pouzivatel));
      akciaBunka.append(vymazBtn);
      riadok.append(akciaBunka);
      zoznamPouzivatelov.append(riadok);
    }
  } catch (error) {
    if (chybaEl) chybaEl.textContent = `Zoznam používateľov sa nepodarilo načítať: ${error.message}`;
  }
}

async function vymazPouzivatela(pouzivatel) {
  if (!window.confirm(`Naozaj chcete vymazať používateľa ${pouzivatel.email}?`)) {
    return;
  }

  if (chybaEl) chybaEl.textContent = "";
  try {
    const odpoved = await fetch(`/api/pouzivatelia/${encodeURIComponent(pouzivatel.id)}`, {
      method: "DELETE"
    });
    if (!odpoved.ok) {
      throw new Error(await textOdpovede(odpoved));
    }

    if (spravaEl) spravaEl.textContent = await textOdpovede(odpoved);
    await nacitajPouzivatelov();
  } catch (error) {
    if (chybaEl) chybaEl.textContent = `Používateľa sa nepodarilo vymazať: ${error.message}`;
  }
}

if (registraciaForm) {
  registraciaForm.addEventListener("submit", async udalost => {
    udalost.preventDefault();
    if (spravaEl) spravaEl.textContent = "";
    if (chybaEl) chybaEl.textContent = "";

    const odoslat = registraciaForm.querySelector('button[type="submit"]');
    odoslat.disabled = true;

    try {
      const novyPouzivatel = {
        meno: document.querySelector("#meno").value,
        email: document.querySelector("#email").value,
        heslo: document.querySelector("#heslo").value
      };
      const odpoved = await fetch("/api/pouzivatelia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novyPouzivatel)
      });
      if (!odpoved.ok) {
        throw new Error(await textOdpovede(odpoved));
      }

      if (spravaEl) spravaEl.textContent = await textOdpovede(odpoved);
      registraciaForm.reset();
      await nacitajPouzivatelov();
    } catch (error) {
      if (chybaEl) chybaEl.textContent = `Registrácia sa nepodarila: ${error.message}`;
    } finally {
      odoslat.disabled = false;
    }
  });
}

nacitajPouzivatelov();
