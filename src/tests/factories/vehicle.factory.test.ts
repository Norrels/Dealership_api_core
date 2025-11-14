import { Vehicle, VehicleStatus } from "@/domain/entities/vehicle";
import { CreateVehicleInput } from "@/application/dtos/vehicle-dto";
import { createId } from "@paralleldrive/cuid2";

export class VehicleFactory {
  static createVehicleInput(overrides?: Partial<Omit<CreateVehicleInput, "status">> & { status?: VehicleStatus }): Omit<Vehicle, "id"> {
    return {
      make: "Toyota",
      model: "Corolla",
      year: 2024,
      vin: this.generateVIN(),
      color: "Black",
      price: "25000.00",
      status: "available" as VehicleStatus,
      ...overrides,
    } as Omit<Vehicle, "id">;
  }

  static createVehicle(overrides?: Partial<Vehicle>): Vehicle {
    return {
      id: createId(),
      make: "Toyota",
      model: "Corolla",
      year: 2024,
      vin: this.generateVIN(),
      color: "Black",
      price: "25000.00",
      status: "available" as VehicleStatus,
      ...overrides,
    };
  }

  static generateVIN(): string {
    const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
    let vin = "";
    for (let i = 0; i < 17; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
  }

  static createMultipleVehicles(count: number): Vehicle[] {
    return Array.from({ length: count }, (_, i) =>
      this.createVehicle({
        make: `Make${i}`,
        model: `Model${i}`,
        year: 2020 + i,
      })
    );
  }
}
