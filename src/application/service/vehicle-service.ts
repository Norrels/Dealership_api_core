import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { Vehicle } from "../../domain/entities/vehicle";
import { CreateVehicleInput, UpdateVehicleInput } from "../dtos/vehicle-dto";
import { NotFoundError, ConflictError } from "../errors";

export class VehicleService {
  constructor(private repository: VehicleRepository) {}

  async getVehicleDetails(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    const vehicleExists = await this.repository.getVehicleByVin(data.vin);

    if (vehicleExists) {
      throw new ConflictError(
        `Vehicle with VIN ${data.vin} already exists in the system`
      );
    }

    const vehicleData: Omit<Vehicle, "id"> = {
      ...data,
      isSold: data.isSold ?? false,
    };

    return await this.repository.createVehicle(vehicleData);
  }

  async updateVehicle(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    if (data.vin && data.vin !== vehicle.vin) {
      const vinExists = await this.repository.getVehicleByVin(data.vin);
      if (vinExists) {
        throw new ConflictError(
          `Vehicle with VIN ${data.vin} already exists in the system`
        );
      }
    }

    return await this.repository.updateVehicle(id, data);
  }

  async markVehicleAsSold(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.isSold) {
      throw new ConflictError(
        `Vehicle with ID ${id} is already marked as sold`
      );
    }

    return await this.repository.updateVehicle(id, { isSold: true });
  }
}
