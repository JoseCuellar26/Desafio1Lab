import { describe, expect, it } from "vitest";
import reducer, { seleccionarAsiento } from "./salasSlice";
import { agregarReserva } from "./reservasSlice";

describe("salas seat state", () => {
  it("keeps seat selection and occupancy isolated per function", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    const sala = initialState.items[0];
    const funcionA = sala.funciones[0];
    const funcionB = sala.funciones[1];
    const asientoA = funcionA.asientos[0];

    const afterSelection = reducer(
      initialState,
      seleccionarAsiento({
        salaId: sala.id,
        funcionId: funcionA.id,
        asientoId: asientoA.id,
      })
    );

    expect(afterSelection.items[0].funciones[0].asientos[0].estado).toBe(
      "seleccionado"
    );
    expect(afterSelection.items[0].funciones[1].asientos[0].estado).toBe(
      "disponible"
    );

    const afterReserva = reducer(
      afterSelection,
      agregarReserva({
        id: "r1",
        peliculaCodigo: "P001",
        peliculaNombre: "Test",
        salaId: sala.id,
        salaNombre: sala.nombre,
        funcionId: funcionA.id,
        hora: "15:00",
        asientos: [asientoA.id],
        cantidadBoletos: 1,
        precioUnitario: 100,
        total: 100,
        fecha: "2026-01-01T00:00:00.000Z",
      })
    );

    expect(afterReserva.items[0].funciones[0].asientos[0].estado).toBe(
      "ocupado"
    );
    expect(afterReserva.items[0].funciones[1].asientos[0].estado).toBe(
      "disponible"
    );
  });
});
