import dynamoose from "../config/dbconfig.mjs";

const CategorySchema = new dynamoose.Schema({
  id:        { type: String, hashKey: true },
  name:      { type: String, required: true },
  type:      { type: String, enum: ["prihod", "trosak"], required: true },
  createdAt: { type: Date, default: () => new Date() }
});

const Kategorija = dynamoose.model("Kategorija", CategorySchema);
export default Kategorija;