import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { Vehicle } from "../domain/entities/vehicle";

export class VehicleService {
  constructor(private repository: VehicleRepository) {}

  async getVehicleDetails(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  }

  

  async createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle> {
    const vehicleExists = await this.repository.getVehicleByVin(data.vin);

    if (vehicleExists) {
      throw new Error("Vehicle with this VIN already exists");
    }

    return await this.repository.createVehicle(data);
  }
}
