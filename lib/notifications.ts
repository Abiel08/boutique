import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface NouvelleCommandeInfo {
  commandeId: string;
  nomClient: string;
  telephone: string;
  localisation: string;
  total: number;
}

export async function notifierNouvelleCommande(info: NouvelleCommandeInfo) {
  if (!resend || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn("Notification email non configurée (RESEND_API_KEY manquant).");
    return;
  }

  try {
    await resend.emails.send({
      from: "Boutique <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `🛍️ Nouvelle commande de ${info.nomClient}`,
      html: `
        <h2>Nouvelle commande reçue</h2>
        <p><strong>Client :</strong> ${info.nomClient}</p>
        <p><strong>Téléphone :</strong> ${info.telephone}</p>
        <p><strong>Localisation :</strong> ${info.localisation}</p>
        <p><strong>Total :</strong> ${info.total.toLocaleString()} FCFA</p>
        <p><strong>Paiement :</strong> à la livraison</p>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/commandes">Voir la commande dans le dashboard</a></p>
      `,
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email de notification :", err);
  }
}
