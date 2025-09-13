import { v4 as uuid } from "uuid";
import Category from "../models/Kategorija.mjs";

class KategoryController {
  getAll = async (_req, res) => {
    try {
      const categories = await Category.scan().exec();
      res.json({ categories });
    } catch (e) {
      res.status(500).json({ error: "Greška pri učitavanju kategorija." });
    }
  };

  create = async (req, res) => {
    try {
      const { name, type } = req.body || {};
      if (!name || !String(name).trim()) {
        return res.status(400).json({ error: "Naziv kategorije je obavezan." });
      }
      if (!["prihod", "trosak"].includes(type)) {
        return res.status(400).json({ error: "Tip mora biti 'prihod' ili 'trosak'." });
      }

      const cat = new Category({
        id: uuid(),
        name: String(name).trim(),
        type
      });
      const saved = await cat.save();
      res.status(201).json(saved);
    } catch (e) {
      res.status(500).json({ error: "Greška pri kreiranju kategorije." });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "Nedostaje id." });
      await Kategorija.delete(id);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "Greška pri brisanju kategorije." });
    }
  };
}

export default KategoryController;