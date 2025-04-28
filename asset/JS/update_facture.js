let id;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  id = urlParams.get("CustomerTransactionId");

  if (!id) {
    alert("ID de facture manquant dans l'URL");
    return;
  }

  try {
    const res = await fetch(
      `../api/update_factures.php?CustomerTransactionId=${id}`
    );
    const data = await res.json();

    const facture = data.items?.[0];
    if (!facture) throw new Error("Facture non trouvée.");

    document.getElementById("CustomerTransactionId").value =
      facture.CustomerTransactionId || "";
    document.getElementById("TransactionNumber").value =
      facture.TransactionNumber || "";
    document.getElementById("TransactionDate").value =
      facture.TransactionDate?.split("T")[0] || "";
    document.getElementById("DueDate").value =
      facture.DueDate?.split("T")[0] || "";
    document.getElementById("TransactionType").value =
      facture.TransactionType || "";
  } catch (err) {
    console.error(err);
    alert("Erreur de chargement des données.");
  }
});

document.getElementById("factureForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedFacture = {
    TransactionNumber: document.getElementById("TransactionNumber").value,
    TransactionDate: document.getElementById("TransactionDate").value,
    DueDate: document.getElementById("DueDate").value,
    TransactionType: document.getElementById("TransactionType").value,
  };

  try {
    const res = await fetch(
      `../Api/save_facture.php?CustomerTransactionId=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFacture),
      }
    );

    const result = await res.json();
    if (res.ok) {
      alert("Facture mise à jour avec succès !");
    } else {
      alert("Erreur : " + (result.error || "Échec de la mise à jour"));
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau lors de la mise à jour.");
  }
});
