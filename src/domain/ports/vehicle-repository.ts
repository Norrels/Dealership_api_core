import { Vehicle } from "@/domain/entities/vehicle";

export interface VehicleRepository {
  createVehicle(data: Omit<Vehicle, "id">): Promise<Vehicle>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle>;
  getVehicleByVin(vin: string): Promise<Vehicle | null>;
}
