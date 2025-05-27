import { RangoDeFechas } from "../../airbinb/models/entities/RangoDeFechas.js";
describe("RangoDeFechas", () => {
  let inicio = new Date("2025-01-01");
  let fin = new Date("2025-01-05");
  let rango = new RangoDeFechas(inicio, fin);

  test("construccion correcta del objeto", () => {
    expect(rango.fechaInicio).toStrictEqual(inicio);
    expect(rango.fechaFin).toStrictEqual(fin);
  });

  test("listaDeDias", () => {
    let dias = [];
    for (let i = 1; i <= 5; i++) {
      dias.push(new Date(`2025-01-0${i}`));
    }
    expect(rango.listaDeDias()).toEqual(dias);
  });
});
