import Axios from "axios";

export default Axios.create({
  baseURL: "https://api.invoicing.co",
  headers: {
    "X-Api-Secret": process.env.INVOICE_NINJA_SECRET!,
    "X-Api-Token": process.env.INVOICE_NINJA_TOKEN!,
    "X-Requested-With": "XMLHttpRequest",
  },
});
