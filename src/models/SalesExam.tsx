import { useState } from "react";
import { SalesType } from "./SalesType";
const SalesExam=()=>{
const [salesType, setSalesType] = useState<number>(0);

const toggleFlag = (flag: SalesType) => {
  setSalesType(prev => prev ^ flag); // Bitwise XOR ile toggle
  //post etme örneği
    // await axios.post("/api/customers", {
    //     name: "Ahmet",
    //     salesType: salesType, // örn: 5
    // });
};

const isChecked = (flag: SalesType) => (salesType & flag) === flag;

return (
  <div className="flex flex-col gap-2">
    <label>
      <input
        type="checkbox"
        checked={isChecked(SalesType.Store)}
        onChange={() => toggleFlag(SalesType.Store)}
      />
      Mağaza
    </label>
    <label>
      <input
        type="checkbox"
        checked={isChecked(SalesType.Mobile)}
        onChange={() => toggleFlag(SalesType.Mobile)}
      />
      Seyyar
    </label>
    <label>
      <input
        type="checkbox"
        checked={isChecked(SalesType.Online)}
        onChange={() => toggleFlag(SalesType.Online)}
      />
      İnternet
    </label>
  </div>
);
}
export default SalesExam;

