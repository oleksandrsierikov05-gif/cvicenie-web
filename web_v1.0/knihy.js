const formular = document.querySelector("#formular");
const zoznamKnih = document.querySelector("#zoznam-knih");
const sprava = document.querySelector("#sprava");
const chyba = document.querySelector("#chyba");

function pridajBunku(riadok, hodnota) {
  const bunka = document.createElement("td");
  bunka.textContent = hodnota ?? "";
  riadok.append(bunka);
}

async function textChyby(odpoved) {
  const text = await odpoved.text();
  return text || `Chyba servera (${odpoved.status})`;
}

async function nacitajKnihy() {
  if (chyba) chyba.textContent = "";
  zoznamKnih.replaceChildren();

  try {
    const odpoved = await fetch("/api/knihy");
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    const knihy = await odpoved.json();
    if (!Array.isArray(knihy)) {
      throw new Error("Server vrátil neočakávaný formát údajov.");
    }

    if (knihy.length === 0) {
      const riadok = document.createElement("tr");
      const bunka = document.createElement("td");
      bunka.className = "empty";
      bunka.colSpan = 6;
      bunka.textContent = "V databáze zatiaľ nie sú žiadne knihy.";
      riadok.append(bunka);
      zoznamKnih.append(riadok);
      return;
    }

    for (const kniha of knihy) {
      const riadok = document.createElement("tr");
      pridajBunku(riadok, kniha.id);
      pridajBunku(riadok, kniha.nazov);
      pridajBunku(riadok, kniha.autor);
      pridajBunku(riadok, kniha.rok);
      pridajBunku(riadok, kniha.cena);

      const akcia = document.createElement("td");
      const tlacidlo = document.createElement("button");
      tlacidlo.type = "button";
      tlacidlo.className = "table-action-button";
      tlacidlo.textContent = "Vymazať";
      tlacidlo.setAttribute("aria-label", `Vymazať knihu ${kniha.nazov}`);
      tlacidlo.addEventListener("click", () => vymazKnihu(kniha.id, kniha.nazov));
      akcia.append(tlacidlo);

      const cenaBtn = document.createElement("button");
      cenaBtn.type = "button";
      cenaBtn.className = "table-action-button";
      cenaBtn.textContent = "Zmeniť cenu";
      cenaBtn.addEventListener("click", () => zmenCenu(kniha.id, kniha.cena));
      akcia.append(cenaBtn);

      for (const [pole, popis, textTlacidla] of [
        ["nazov", "nový názov", "Zmeniť názov"],
        ["autor", "nové meno autora", "Zmeniť autora"],
        ["rok", "nový rok vydania", "Zmeniť rok"]
      ]) {
        const upravitBtn = document.createElement("button");
        upravitBtn.type = "button";
        upravitBtn.className = "table-action-button";
        upravitBtn.textContent = textTlacidla;
        upravitBtn.addEventListener("click", () => upravPoleKnihy(kniha, pole, popis));
        akcia.append(upravitBtn);
      }

      riadok.append(akcia);
      zoznamKnih.append(riadok);
    }
  } catch (error) {
    if (chyba) chyba.textContent = `Knihy sa nepodarilo načítať: ${error.message}`;
    const riadok = document.createElement("tr");
    const bunka = document.createElement("td");
    bunka.className = "empty";
    bunka.colSpan = 6;
    bunka.textContent = "Skontrolujte, či je spustený server a databáza.";
    riadok.append(bunka);
    zoznamKnih.append(riadok);
  }
}

async function vymazKnihu(id, nazov) {
  if (!window.confirm(`Naozaj chcete vymazať knihu „${nazov}“?`)) {
    return;
  }

  if (chyba) chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }
    await nacitajKnihy();
  } catch (error) {
    if (chyba) chyba.textContent = `Knihu sa nepodarilo vymazať: ${error.message}`;
  }
}

async function zmenCenu(id, aktualnaCena) {
  const vstup = window.prompt("Zadajte novú cenu:", aktualnaCena);
  if (vstup === null || vstup.trim() === "") {
    return;
  }

  const cena = Number(vstup.replace(",", "."));
  if (!Number.isFinite(cena) || cena < 0) {
    window.alert("Zadajte platnú nezápornú cenu.");
    return;
  }

  if (chyba) chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(id)}/cena`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cena })
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }
    await nacitajKnihy();
  } catch (error) {
    if (chyba) chyba.textContent = `Cenu knihy sa nepodarilo zmeniť: ${error.message}`;
  }
}

async function upravPoleKnihy(kniha, pole, popis) {
  const aktualnaHodnota = kniha[pole];
  const vstup = window.prompt(`Zadajte ${popis}:`, aktualnaHodnota);
  if (vstup === null) return;

  const hodnota = pole === "rok" ? Number(vstup.trim()) : vstup.trim();
  if ((pole === "rok" && !Number.isInteger(hodnota))
    || (pole !== "rok" && !hodnota)) {
    window.alert(`Zadajte platnú hodnotu pre: ${popis}.`);
    return;
  }

  const upraveneUdaje = {
    nazov: kniha.nazov,
    autor: kniha.autor,
    rok: kniha.rok,
    [pole]: hodnota
  };

  if (chyba) chyba.textContent = "";
  try {
    const odpoved = await fetch(`/api/knihy/${encodeURIComponent(kniha.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upraveneUdaje)
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }
    if (sprava) sprava.textContent = `Údaj „${popis}“ bol zmenený.`;
    await nacitajKnihy();
  } catch (error) {
    if (chyba) chyba.textContent = `Knihu sa nepodarilo upraviť: ${error.message}`;
  }
}

if (formular) formular.addEventListener("submit", async udalost => {
  udalost.preventDefault();
  if (sprava) sprava.textContent = "";
  if (chyba) chyba.textContent = "";

  const data = new FormData(formular);
  const kniha = {
    nazov: String(data.get("nazov")).trim(),
    autor: String(data.get("autor")).trim(),
    rok: Number(data.get("rok")),
    cena: Number(data.get("cena"))
  };

    if (!kniha.nazov || !kniha.autor || !Number.isInteger(kniha.rok)
      || !Number.isFinite(kniha.cena) || kniha.cena < 0) {
    chyba.textContent = "Vyplňte správne všetky polia.";
    return;
  }

  const odoslat = formular.querySelector('button[type="submit"]');
  odoslat.disabled = true;

  try {
    const odpoved = await fetch("/api/knihy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kniha)
    });
    if (!odpoved.ok) {
      throw new Error(await textChyby(odpoved));
    }

    formular.reset();
    if (sprava) sprava.textContent = "Kniha bola pridaná.";
    await nacitajKnihy();
  } catch (error) {
    if (chyba) chyba.textContent = `Knihu sa nepodarilo pridať: ${error.message}`;
  } finally {
    odoslat.disabled = false;
  }
});

nacitajKnihy();