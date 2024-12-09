import { Resend } from "resend";

const resend = new Resend("re_PRHcM552_McxftAKdz8UN9AGSE7DADPkN");

const sendEmail = async (req, res) => {
  const { nom, prenom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res
      .status(400)
      .json({ error: "Tous les champs obligatoires doivent être fournis." });
  }

  try {
    const { data } = await resend.emails.send({
      from: "Contact : Petit Creux <onboarding@resend.dev>",
      to: "petitcreuxmessage@hotmail.com",
      subject: "Nouveau message reçue",
      text: `
        Nom: ${nom}
        Prénom: ${prenom || "Prénom non fourni"}
        Email: ${email}
        Message: ${message}
      `,
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default sendEmail;
