import { v4 as uuid } from "uuid";
import Transaction from "../models/Transakcija.mjs";
import Category from "../models/Kategorija.mjs";

class TransakcijaController {
  getAll = async (_req, res) => {
    try {
      const transactions = await Transaction.scan().exec();
      res.json({ transactions });
    } catch (e) {
      res.status(500).json({ error: "Greška pri učitavanju transakcija." });
    }
  };

  create = async (req, res) => {
    try {
      const { amount, categoryId, note, date } = req.body || {};

      const num = Number(amount);
      if (!Number.isFinite(num)) {
        return res.status(400).json({ error: "Iznos (amount) mora biti broj." });
      }
      if (!categoryId) {
        return res.status(400).json({ error: "Nedostaje categoryId." });
      }

      // Validiraj da kategorija postoji
      const cat = await Category.get(categoryId);
      if (!cat) {
        return res.status(400).json({ error: "Kategorija ne postoji." });
      }

      const tx = new Transaction({
        id: uuid(),
        amount: num,
        categoryId,
        note: note ? String(note) : undefined,
        date: date || new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      });

      const saved = await tx.save();
      res.status(201).json(saved);
    } catch (e) {
      res.status(500).json({ error: "Greška pri kreiranju transakcije." });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "Nedostaje id." });
      await Transaction.delete(id);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "Greška pri brisanju transakcije." });
    }
  };
}

export default TransakcijaController;