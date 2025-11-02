import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { Vehicle } from "../../domain/entities/vehicle";
import { CreateVehicleInput, UpdateVehicleInput } from "../dtos/vehicle.dto";

export class VehicleService {
  constructor(private repository: VehicleRepository) {}

  async getVehicleDetails(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return vehicle;
  }

  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    const vehicleExists = await this.repository.getVehicleByVin(data.vin);

    if (vehicleExists) {
      throw new Error("Vehicle with this VIN already exists");
    }

    const vehicleData: Omit<Vehicle, "id"> = {
      ...data,
      isSold: data.isSold ?? false,
    };

    return await this.repository.createVehicle(vehicleData);
  }

  async updateVehicle(
    id: string,
    data: UpdateVehicleInput
  ): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    return await this.repository.updateVehicle(id, data);
  }

  async markVehicleAsSold(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.isSold) {
      throw new Error("Vehicle is already marked as sold");
    }

    return await this.repository.updateVehicle(id, { isSold: true });
  }
}
