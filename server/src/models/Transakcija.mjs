import dynamoose from "../config/dbconfig.mjs";

const TransactionSchema = new dynamoose.Schema({
  id:         { type: String, hashKey: true },
  amount:     { type: Number, required: true },
  categoryId: { type: String, required: true },
  note:       { type: String },
  date:       { type: String },
  createdAt:  { type: Date, default: () => new Date() }
});

const Transakcija = dynamoose.model("Transakcija", TransactionSchema);
export default Transakcija;