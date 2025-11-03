import { VehicleRepository } from "@/domain/ports/vehicle-repository";
import { Vehicle } from "../../domain/entities/vehicle";
import { CreateVehicleInput, UpdateVehicleInput } from "../dtos/vehicle-dto";
import { NotFoundError, ConflictError } from "../errors";
import { logger } from "@/config/logger";

export class VehicleService {
  constructor(private repository: VehicleRepository) {}

  async getVehicleDetails(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      logger.warn({ vehicleId: id }, "Vehicle not found");
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    logger.info({ vehicleId: id, vin: vehicle.vin }, "Vehicle details retrieved");
    return vehicle;
  }

  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    const vehicleExists = await this.repository.getVehicleByVin(data.vin);

    if (vehicleExists) {
      logger.warn({ vin: data.vin }, "Attempt to create vehicle with duplicate VIN");
      throw new ConflictError(
        `Vehicle with VIN ${data.vin} already exists in the system`
      );
    }

    const vehicleData: Omit<Vehicle, "id"> = {
      ...data,
      isSold: data.isSold ?? false,
    };

    const vehicle = await this.repository.createVehicle(vehicleData);
    logger.info({ vehicleId: vehicle.id, vin: vehicle.vin }, "Vehicle created successfully");

    return vehicle;
  }

  async updateVehicle(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      logger.warn({ vehicleId: id }, "Vehicle not found for update");
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    if (data.vin && data.vin !== vehicle.vin) {
      const vinExists = await this.repository.getVehicleByVin(data.vin);
      if (vinExists) {
        logger.warn({ vehicleId: id, newVin: data.vin }, "Attempt to update to duplicate VIN");
        throw new ConflictError(
          `Vehicle with VIN ${data.vin} already exists in the system`
        );
      }
    }

    const updatedVehicle = await this.repository.updateVehicle(id, data);
    logger.info({ vehicleId: id, vin: updatedVehicle.vin }, "Vehicle updated successfully");

    return updatedVehicle;
  }

  async markVehicleAsSold(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.getVehicleById(id);

    if (!vehicle) {
      logger.warn({ vehicleId: id }, "Vehicle not found for marking as sold");
      throw new NotFoundError(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.isSold) {
      logger.warn({ vehicleId: id, vin: vehicle.vin }, "Attempt to mark already sold vehicle");
      throw new ConflictError(
        `Vehicle with ID ${id} is already marked as sold`
      );
    }

    const soldVehicle = await this.repository.updateVehicle(id, { isSold: true });
    logger.info({ vehicleId: id, vin: vehicle.vin }, "Vehicle marked as sold");

    return soldVehicle;
  }
}
